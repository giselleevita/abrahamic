/**
 * The admin boundary, enumerated.
 *
 * Every mutating route handler must reject an unauthenticated caller with 401
 * *before* touching the database. Asserting "Prisma was never called" as well
 * as the status code is what makes this a real guard test: a handler that
 * queried first and checked auth afterwards would still return 401 while
 * having already leaked work to the database.
 *
 * When a phase adds a mutating route, add it to MUTATING_ROUTES.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('next-auth', () => ({ getServerSession: vi.fn(async () => null) }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))

// A Prisma stand-in where every property access yields a spy. Any DB call by a
// handler that should have short-circuited will register on `prismaCalls`.
const prismaCalls: string[] = []
vi.mock('@/lib/prisma', () => {
  const model = (name: string) =>
    new Proxy(
      {},
      {
        get: (_t, op: string) => (...args: unknown[]) => {
          prismaCalls.push(`${name}.${op}`)
          void args
          return Promise.resolve(null)
        },
      },
    )
  return {
    default: new Proxy({}, { get: (_t, name: string) => model(name) }),
  }
})

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const MUTATING_ROUTES: { path: string; module: string; methods: Method[] }[] = [
  { path: '/api/claims', module: '@/app/api/claims/route', methods: ['POST'] },
  { path: '/api/claims/[id]', module: '@/app/api/claims/[id]/route', methods: ['PUT', 'DELETE'] },
  { path: '/api/comparisons', module: '@/app/api/comparisons/route', methods: ['POST'] },
  { path: '/api/comparisons/[id]', module: '@/app/api/comparisons/[id]/route', methods: ['PUT', 'DELETE'] },
  { path: '/api/concepts', module: '@/app/api/concepts/route', methods: ['POST'] },
  { path: '/api/concepts/[slug]', module: '@/app/api/concepts/[slug]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/figures', module: '@/app/api/figures/route', methods: ['POST'] },
  { path: '/api/figures/[slug]', module: '@/app/api/figures/[slug]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/themes', module: '@/app/api/themes/route', methods: ['POST'] },
  { path: '/api/themes/[slug]', module: '@/app/api/themes/[slug]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/timeline', module: '@/app/api/timeline/route', methods: ['POST'] },
  { path: '/api/timeline/[slug]', module: '@/app/api/timeline/[slug]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/translations', module: '@/app/api/translations/route', methods: ['POST'] },
  { path: '/api/translations/[id]', module: '@/app/api/translations/[id]/route', methods: ['PATCH', 'DELETE'] },
  { path: '/api/verse-links', module: '@/app/api/verse-links/route', methods: ['POST'] },
  { path: '/api/verse-links/[id]', module: '@/app/api/verse-links/[id]/route', methods: ['DELETE'] },
  { path: '/api/sources/[sourceKey]', module: '@/app/api/sources/[sourceKey]/route', methods: ['PATCH'] },
  { path: '/api/ai/summary', module: '@/app/api/ai/summary/route', methods: ['POST'] },
  { path: '/api/ai/theme-suggestions', module: '@/app/api/ai/theme-suggestions/route', methods: ['POST'] },
  { path: '/api/ai/verse-link-candidates', module: '@/app/api/ai/verse-link-candidates/route', methods: ['POST'] },
  { path: '/api/ai/verse-link-candidates/[id]', module: '@/app/api/ai/verse-link-candidates/[id]/route', methods: ['PATCH'] },
]

beforeEach(() => {
  prismaCalls.length = 0
})

describe('admin boundary', () => {
  const cases = MUTATING_ROUTES.flatMap((r) =>
    r.methods.map((method) => ({ ...r, method })),
  )

  it.each(cases)('$method $path rejects an anonymous caller', async ({ module, method }) => {
    const mod = (await import(module)) as Record<string, unknown>
    const handler = mod[method] as (
      req: NextRequest,
      ctx: { params: Promise<Record<string, string>> },
    ) => Promise<Response>

    expect(handler, `${method} is not exported`).toBeTypeOf('function')

    const req = new NextRequest('http://localhost/api/test', {
      method,
      body: method === 'DELETE' ? undefined : JSON.stringify({}),
      headers: { 'content-type': 'application/json' },
    })

    const res = await handler(req, { params: Promise.resolve({ id: '1', slug: 'x', sourceKey: 'TORAH' }) })

    expect(res.status).toBe(401)
    expect(prismaCalls, 'handler reached the database before authenticating').toEqual([])
  })
})
