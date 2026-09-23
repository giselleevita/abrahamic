/**
 * Every mutating route must invalidate the pages its write affects.
 *
 * Pages are cached for an hour (`export const revalidate = 3600`). Without
 * invalidation an editor would publish a change and not see it until the TTL
 * expired — the classic "I saved it and nothing happened" failure, and the
 * reason caching often gets ripped back out.
 *
 * Nine routes had no invalidation of any kind before this test existed: adding
 * a figure, theme, concept, timeline event, or verse link refreshed nothing.
 *
 * The route table is shared with the auth-guard suite; a new mutating route
 * must be added to both.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Authenticated, so handlers run past the guard and reach the write path.
vi.mock('next-auth', () => ({ getServerSession: vi.fn(async () => ({ user: { id: '1', role: 'ADMIN' } })) }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))

const revalidatedPaths: string[] = []
const revalidatedTags: string[] = []

vi.mock('next/cache', () => ({
  revalidatePath: (p: string) => revalidatedPaths.push(p),
  revalidateTag: (t: string) => revalidatedTags.push(t),
  unstable_cache: (fn: unknown) => fn,
}))

// Return plausible rows so handlers reach their success path rather than
// bailing early on a null lookup.
vi.mock('@/lib/prisma', () => {
  const row = { id: 1, slug: 'x', title: 't', name: 'n', youtubeId: 'dQw4w9WgXcQ', status: 'APPROVED', isPublished: false, ageBand: 'AGE_6_8', body: 'b', reviewNotes: null }
  const model = () =>
    new Proxy({}, {
      get: (_t, op: string) => (...args: unknown[]) => {
        void args
        if (op === 'findUnique' || op === 'findFirst') return Promise.resolve(null)
        if (op === 'count') return Promise.resolve(0)
        if (op === 'findMany') return Promise.resolve([])
        return Promise.resolve(row)
      },
    })
  const prisma = new Proxy({}, {
    get: (_target, name: string) =>
      name === '$transaction'
        ? async (callback: (tx: unknown) => unknown) => callback(prisma)
        : model(),
  })
  return { default: prisma }
})

type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/** Routes whose writes change what a public page renders. */
const ROUTES: { path: string; module: string; method: Method; body?: object }[] = [
  { path: '/api/figures/[slug]', module: '@/app/api/figures/[slug]/route', method: 'DELETE' },
  { path: '/api/themes/[slug]', module: '@/app/api/themes/[slug]/route', method: 'DELETE' },
  { path: '/api/concepts/[slug]', module: '@/app/api/concepts/[slug]/route', method: 'DELETE' },
  { path: '/api/timeline/[slug]', module: '@/app/api/timeline/[slug]/route', method: 'DELETE' },
  { path: '/api/claims/[id]', module: '@/app/api/claims/[id]/route', method: 'DELETE' },
  { path: '/api/comparisons/[id]', module: '@/app/api/comparisons/[id]/route', method: 'DELETE' },
  { path: '/api/verse-links/[id]', module: '@/app/api/verse-links/[id]/route', method: 'DELETE' },
  { path: '/api/videos/[id]', module: '@/app/api/videos/[id]/route', method: 'DELETE' },
]

beforeEach(() => {
  revalidatedPaths.length = 0
  revalidatedTags.length = 0
})

describe('cache invalidation on write', () => {
  it.each(ROUTES)('$method $path purges at least one page', async ({ module, method, body }) => {
    const mod = (await import(module)) as Record<string, unknown>
    const handler = mod[method] as (
      req: NextRequest,
      ctx: { params: Promise<Record<string, string>> },
    ) => Promise<Response>

    expect(handler, `${method} is not exported from ${module}`).toBeTypeOf('function')

    const req = new NextRequest('http://localhost/api/test', {
      method,
      ...(body ? { body: JSON.stringify(body), headers: { 'content-type': 'application/json' } } : {}),
    })

    await handler(req, { params: Promise.resolve({ id: '1', slug: 'x' }) })

    expect(
      revalidatedPaths.length,
      'This route writes to the database but purges no cached page, so an editor ' +
        'would not see the change for up to an hour.',
    ).toBeGreaterThan(0)
  })

  it('purges the homepage for entities the homepage renders', async () => {
    const mod = (await import('@/app/api/figures/[slug]/route')) as Record<string, unknown>
    const handler = mod.DELETE as (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>
    await handler(new NextRequest('http://localhost/api/test', { method: 'DELETE' }), {
      params: Promise.resolve({ slug: 'x' }),
    })
    // The homepage shows figure counts and a figures grid.
    expect(revalidatedPaths).toContain('/')
    expect(revalidatedPaths).toContain('/figures')
  })
})
