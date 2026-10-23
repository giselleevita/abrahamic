/**
 * Public reads when sign-in itself is broken.
 *
 * In production NEXTAUTH_SECRET was missing, so getServerSession threw. Public GET handlers that peek at
 * the session to show staff a little more (drafts) turned that into a 500 for every visitor. They must
 * answer as a VISITOR instead, which can only ever show less. Writes must still refuse.
 * No database needed: Prisma is replaced by a recorder.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('next-auth', () => ({ getServerSession: vi.fn(async () => { throw new Error('NO_SECRET') }) }))
vi.mock('@/lib/auth', () => ({ authOptions: {}, contributorSessionOptions: {} }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))
vi.mock('@/lib/cache', () => ({ revalidateEntity: vi.fn() }))

type Call = { op: string; args: unknown }
const calls: Call[] = []
const data = vi.hoisted(() => ({
  claim: null as null | Record<string, unknown>,
  comparison: null as null | Record<string, unknown>,
}))

vi.mock('@/lib/prisma', () => {
  const rec = (name: string, result: () => unknown) => (args: unknown) => {
    calls.push({ op: name, args })
    return Promise.resolve(result())
  }
  return {
    default: {
      claim: {
        findMany: rec('claim.findMany', () => []),
        findUnique: rec('claim.findUnique', () => data.claim),
        findUniqueOrThrow: rec('claim.findUniqueOrThrow', () => data.claim),
      },
      comparison: { findUnique: rec('comparison.findUnique', () => data.comparison) },
      $transaction: rec('$transaction', () => null),
    },
  }
})

const ctx = (id: string) => ({ params: Promise.resolve({ id }) })
const reads = (op: string) => calls.filter((c) => c.op === op)

beforeEach(() => {
  calls.length = 0
  data.claim = null
  data.comparison = null
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('public reads with broken sign-in', () => {
  it('GET /api/claims answers, and shows only published claims', async () => {
    const { GET } = await import('@/app/api/claims/route')
    const res = await GET(new NextRequest('http://x/api/claims?published=false'))
    expect(res.status).toBe(200)
    // Even asking for unpublished claims, a visitor is forced to published only.
    expect((reads('claim.findMany')[0].args as { where: { isPublished: boolean } }).where.isPublished).toBe(true)
  })

  it('GET /api/claims/[id] hides a draft claim from the visitor', async () => {
    data.claim = { id: 1, isPublished: false, statement: 'draft' }
    const { GET } = await import('@/app/api/claims/[id]/route')
    const res = await GET(new Request('http://x'), ctx('1'))
    expect(res.status).toBe(404)
  })

  it('GET /api/claims/[id] shows a published claim', async () => {
    data.claim = { id: 1, isPublished: true, statement: 'published' }
    const { GET } = await import('@/app/api/claims/[id]/route')
    expect((await GET(new Request('http://x'), ctx('1'))).status).toBe(200)
  })

  it('GET /api/comparisons/[id] hides a draft comparison from the visitor', async () => {
    data.comparison = { id: 1, isPublished: false, title: 'secret draft' }
    const { GET } = await import('@/app/api/comparisons/[id]/route')
    const res = await GET(new Request('http://x'), ctx('1'))
    expect(res.status).toBe(404)
    expect(JSON.stringify(await res.json())).not.toContain('secret draft')
  })

  it('GET /api/comparisons/[id] shows a published one, limited to published claims', async () => {
    data.comparison = { id: 1, isPublished: true, title: 'live', claims: [] }
    const { GET } = await import('@/app/api/comparisons/[id]/route')
    expect((await GET(new Request('http://x'), ctx('1'))).status).toBe(200)
    const include = (reads('comparison.findUnique')[0].args as { include: { claims: { where: unknown } } }).include
    expect(include.claims.where).toEqual({ claim: { isPublished: true } })
  })

  it('logs only the error message, never a token or session', async () => {
    const { GET } = await import('@/app/api/claims/route')
    await GET(new NextRequest('http://x/api/claims'))
    const logged = JSON.stringify((console.error as unknown as { mock: { calls: unknown[][] } }).mock.calls)
    expect(logged).toContain('NO_SECRET')
  })
})

describe('writes still refuse when sign-in is broken', () => {
  it('POST /api/claims does not create anything', async () => {
    const { POST } = await import('@/app/api/claims/route')
    const status = await Promise.resolve()
      .then(() => POST(new Request('http://x', { method: 'POST', body: '{}' })))
      .then((r) => r.status)
      .catch(() => 500)
    expect(status).toBeGreaterThanOrEqual(400)
    expect(calls).toEqual([])
  })

  it('DELETE /api/claims/[id] does not delete anything', async () => {
    const { DELETE } = await import('@/app/api/claims/[id]/route')
    const status = await Promise.resolve()
      .then(() => DELETE(new Request('http://x', { method: 'DELETE' }), ctx('1')))
      .then((r) => r.status)
      .catch(() => 500)
    expect(status).toBeGreaterThanOrEqual(400)
    expect(calls).toEqual([])
  })
})
