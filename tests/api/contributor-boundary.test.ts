/**
 * The contributor boundary, enumerated.
 *
 * Contributors sign in with the same cookie and secret as staff. The protection that
 * keeps them out of the CMS is structural: the staff session view returns nothing for a
 * non-staff token, so every `getServerSession(authOptions)` check fails. These tests use
 * the REAL next-auth session code with a REAL signed cookie, so they would catch a
 * regression in either the view or any route that bypassed it.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { encode } from 'next-auth/jwt'
import { MUTATING_ROUTES } from './mutating-routes'

const SECRET = 'contributor-boundary-test-secret'
process.env.NEXTAUTH_SECRET = SECRET
process.env.NEXTAUTH_URL = 'http://localhost:3000'

const jar: Record<string, string> = {}
// next-auth loads `next/headers` through CommonJS require, which vi.mock cannot intercept.
// Instead, route the one-argument (App Router) call into next-auth's own request/response
// form, passing the signed cookie. The session decoding and callbacks stay the real code.
vi.mock('next-auth', async (importOriginal) => {
  const real = await importOriginal<typeof import('next-auth')>()
  const res = { getHeader() {}, setCookie() {}, setHeader() {} }
  return {
    ...real,
    getServerSession: (...args: unknown[]) =>
      (real.getServerSession as (...a: unknown[]) => Promise<unknown>)({ headers: {}, cookies: { ...jar } }, res, args[0]),
  }
})

const prismaCalls: string[] = []
vi.mock('@/lib/prisma', () => {
  const model = (name: string) =>
    new Proxy({}, {
      get: (_t, op: string) => (...args: unknown[]) => {
        prismaCalls.push(`${name}.${op}`)
        void args
        return Promise.resolve(null)
      },
    })
  return { default: new Proxy({}, { get: (_t, name: string) => model(name) }) }
})
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))

async function signIn(claims: Record<string, unknown>) {
  jar['next-auth.session-token'] = await encode({
    secret: SECRET,
    token: { sub: 'u1', checkedAt: Date.now(), ...claims },
  })
}

const staffCases = MUTATING_ROUTES.filter((r) => !r.contributorAllowed).flatMap((r) =>
  r.methods.map((method) => ({ ...r, method })),
)

async function call(module: string, method: string) {
  const mod = (await import(module)) as Record<string, unknown>
  const handler = mod[method] as (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>
  const req = new NextRequest('http://localhost/api/test', {
    method,
    body: method === 'DELETE' ? undefined : JSON.stringify({}),
    headers: { 'content-type': 'application/json' },
  })
  return handler(req, { params: Promise.resolve({ id: '1', slug: 'x', sourceKey: 'TORAH' }) })
}

beforeAll(() => { expect(staffCases.length).toBeGreaterThan(20) })
beforeEach(() => {
  prismaCalls.length = 0
  for (const key of Object.keys(jar)) delete jar[key]
})

describe('contributor boundary', () => {
  it.each(staffCases)('$method $path rejects a signed-in contributor', async ({ module, method }) => {
    await signIn({ uid: 'user-1', role: 'CONTRIBUTOR' })
    const res = await call(module, method)
    expect(res.status).toBe(401)
    expect(prismaCalls, 'handler reached the database for a contributor').toEqual([])
  })

  it.each(staffCases)('$method $path rejects a suspended account (role stripped)', async ({ module, method }) => {
    await signIn({ uid: 'user-1' }) // role removed by the suspension re-check
    const res = await call(module, method)
    expect(res.status).toBe(401)
    expect(prismaCalls).toEqual([])
  })

  const adminOnlyCases = MUTATING_ROUTES.filter((r) => r.adminOnly).flatMap((r) => r.methods.map((method) => ({ ...r, method })))

  it.each(adminOnlyCases)('$method $path refuses an EDITOR with 403 before touching the database', async ({ module, method }) => {
    await signIn({ role: 'EDITOR' })
    const res = await call(module, method)
    expect(res.status).toBe(403)
    expect(prismaCalls).toEqual([])
  })

  it.each(adminOnlyCases)('$method $path refuses a database-backed EDITOR with 403', async ({ module, method }) => {
    await signIn({ uid: 'user-1', role: 'EDITOR' })
    const res = await call(module, method)
    expect(res.status).toBe(403)
    expect(prismaCalls).toEqual([])
  })

  const ownCases = MUTATING_ROUTES.filter((r) => r.contributorAllowed).flatMap((r) => r.methods.map((method) => ({ ...r, method })))

  it.each(ownCases)('$method $path refuses the environment admin, who has no contributor identity', async ({ module, method }) => {
    await signIn({ role: 'ADMIN' })
    expect((await call(module, method)).status).toBe(401)
    expect(prismaCalls).toEqual([])
  })

  it('lets a contributor reach their own endpoint (validation, not authentication, rejects an empty body)', async () => {
    await signIn({ uid: 'user-1', role: 'CONTRIBUTOR' })
    expect((await call('@/app/api/account/reviewer-applications/route', 'POST')).status).toBe(400)
  })

  it('rejects a reviewer application for SHARED or without a statement', async () => {
    await signIn({ uid: 'user-1', role: 'CONTRIBUTOR' })
    const mod = await import('@/app/api/account/reviewer-applications/route')
    const bodies = [
      { tradition: 'SHARED', affiliation: 'Somewhere', statement: 'x'.repeat(30) },
      { tradition: 'JEWISH', affiliation: 'Somewhere', statement: 'short' },
    ]
    for (const body of bodies) {
      const res = await mod.POST(new Request('http://localhost/api/account/reviewer-applications', { method: 'POST', body: JSON.stringify(body) }))
      expect(res.status).toBe(400)
    }
    expect(prismaCalls).toEqual([])
  })

  it('still lets the environment-credential admin through the session check', async () => {
    await signIn({ role: 'ADMIN' })
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    expect(await getServerSession(authOptions)).toMatchObject({ user: { role: 'ADMIN' } })
  })

  it('shows a contributor session only through the contributor view', async () => {
    await signIn({ uid: 'user-1', role: 'CONTRIBUTOR', reviewerTraditions: ['ISLAMIC'] })
    const { getServerSession } = await import('next-auth')
    const { authOptions, contributorSessionOptions } = await import('@/lib/auth')
    expect(await getServerSession(authOptions)).toBeNull()
    expect(await getServerSession(contributorSessionOptions)).toMatchObject({
      user: { id: 'user-1', role: 'CONTRIBUTOR', reviewerTraditions: ['ISLAMIC'] },
    })
  })

  it('does not give the environment admin a contributor identity', async () => {
    await signIn({ role: 'ADMIN' })
    const { getServerSession } = await import('next-auth')
    const { contributorSessionOptions } = await import('@/lib/auth')
    expect(await getServerSession(contributorSessionOptions)).toBeNull()
  })
})
