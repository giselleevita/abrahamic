/**
 * What visitors can read of a comparison, through the real route handlers and database.
 * Regression tests for two leaks: an unpublished comparison was readable by anyone via
 * GET /api/comparisons/[id], and an unpublished or archived claim kept appearing inside a
 * published comparison.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const session = vi.hoisted(() => ({ current: null as null | { user: { id: string; role: string } } }))
vi.mock('next-auth', () => ({ getServerSession: vi.fn(async () => session.current) }))
vi.mock('@/lib/auth', () => ({ authOptions: {}, contributorSessionOptions: {} }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))
vi.mock('@/lib/cache', () => ({ revalidateEntity: vi.fn() }))

const describeDb = process.env.DATABASE_URL ? describe : describe.skip
const TAG = 'visibility-test'

describeDb('comparison visibility', () => {
  let prisma: typeof import('@/lib/prisma').default
  let one: typeof import('@/app/api/comparisons/[id]/route')
  let list: typeof import('@/app/api/comparisons/route')
  let torahId = 0
  let n = 0

  const claim = (over: Record<string, unknown> = {}) => {
    n += 1
    return prisma.claim.create({
      data: {
        sourceId: torahId, statement: `${TAG} claim ${Date.now()}-${n}`, contentHash: `${TAG}-${Date.now()}-${n}`,
        editorialStatus: 'PUBLISHED', isPublished: true, requiredTraditions: ['JEWISH'], ...over,
      },
    })
  }
  const comparison = (claimIds: number[], published: boolean) => {
    n += 1
    return prisma.comparison.create({
      data: {
        title: `${TAG} comparison`, slug: `${TAG}-${Date.now()}-${n}`, tag: 'SHARED', isPublished: published,
        claims: { create: claimIds.map((claimId, position) => ({ claimId, position })) },
      },
    })
  }
  const get = (id: number) => one.GET(new Request('http://x'), { params: Promise.resolve({ id: String(id) }) })

  async function wipe() {
    await prisma.comparison.deleteMany({ where: { slug: { startsWith: TAG } } })
    await prisma.claim.deleteMany({ where: { statement: { startsWith: TAG } } })
  }

  beforeAll(async () => {
    prisma = (await import('@/lib/prisma')).default
    one = await import('@/app/api/comparisons/[id]/route')
    list = await import('@/app/api/comparisons/route')
    torahId = (await prisma.source.findFirstOrThrow({ where: { key: 'TORAH' } })).id
    await wipe()
  })
  beforeEach(() => { session.current = null })
  afterAll(async () => { await wipe() })

  it('does not show an unpublished comparison to visitors', async () => {
    const a = await claim()
    const b = await claim()
    const draft = await comparison([a.id, b.id], false)
    const res = await get(draft.id)
    expect(res.status).toBe(404)
    expect(JSON.stringify(await res.json())).not.toContain(TAG)
  })

  it('still lets staff read a draft comparison', async () => {
    const draft = await comparison([(await claim()).id, (await claim()).id], false)
    session.current = { user: { id: 'editor', role: 'EDITOR' } }
    expect((await get(draft.id)).status).toBe(200)
  })

  it('shows a published comparison, without any claim that has since been unpublished', async () => {
    const keep = await claim()
    const gone = await claim()
    const live = await comparison([keep.id, gone.id], true)
    await prisma.claim.update({ where: { id: gone.id }, data: { editorialStatus: 'ARCHIVED', isPublished: false } })

    const body = await (await get(live.id)).json()
    expect(body.claims.map((c: { claimId: number }) => c.claimId)).toEqual([keep.id])
  })

  it('applies the same rule to the public list', async () => {
    const keep = await claim()
    const gone = await claim()
    const live = await comparison([keep.id, gone.id], true)
    await prisma.claim.update({ where: { id: gone.id }, data: { editorialStatus: 'DRAFT', isPublished: false } })

    const res = await list.GET(new (await import('next/server')).NextRequest('http://x/api/comparisons'))
    const found = (await res.json()).find((c: { id: number }) => c.id === live.id)
    expect(found.claims.map((c: { claimId: number }) => c.claimId)).toEqual([keep.id])
  })

  it('returns 404 for a non-numeric id instead of crashing', async () => {
    const res = await one.GET(new Request('http://x'), { params: Promise.resolve({ id: 'abc' }) })
    expect(res.status).toBe(404)
  })
})
