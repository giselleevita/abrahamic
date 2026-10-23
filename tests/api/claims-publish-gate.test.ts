/**
 * The publishing gate, end to end through the real route handlers and the real database.
 * Only the session is faked (an administrator); everything else is the production code path.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const session = vi.hoisted(() => ({ current: null as null | { user: { id: string; role: string } } }))
vi.mock('next-auth', () => ({ getServerSession: vi.fn(async () => session.current) }))
vi.mock('@/lib/auth', () => ({ authOptions: {}, contributorSessionOptions: {} }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))
vi.mock('@/lib/cache', () => ({ revalidateEntity: vi.fn() }))

const describeDb = process.env.DATABASE_URL ? describe : describe.skip
const TAG = 'publish-gate-test'

describeDb('claim publishing gate (API + database)', () => {
  let prisma: typeof import('@/lib/prisma').default
  let claimsRoute: typeof import('@/app/api/claims/route')
  let claimRoute: typeof import('@/app/api/claims/[id]/route')
  let reviewsRoute: typeof import('@/app/api/claims/[id]/reviews/route')
  let contestedRoute: typeof import('@/app/api/claims/[id]/contested/route')
  let torahId = 0
  let verseId = 0

  const json = (url: string, method: string, body: unknown) =>
    new Request(url.startsWith('http') ? url : `http://x/${url}`, { method, body: JSON.stringify(body), headers: { 'content-type': 'application/json' } })
  const ctx = (id: number) => ({ params: Promise.resolve({ id: String(id) }) })
  const as = (role: 'ADMIN' | 'EDITOR') => { session.current = { user: { id: role === 'ADMIN' ? 'admin' : 'editor', role } } }

  async function newClaim(extra: Record<string, unknown> = {}) {
    const res = await claimsRoute.POST(json('http://x/api/claims', 'POST', {
      sourceId: torahId, statement: `${TAG} ${Date.now()}-${Math.random()}`, verseIds: [verseId], editorialStatus: 'IN_REVIEW', ...extra,
    }))
    expect(res.status).toBe(201)
    return (await res.json()) as { id: number }
  }
  const publish = (id: number) => claimRoute.PUT(json(`http://x/api/claims/${id}`, 'PUT', { editorialStatus: 'PUBLISHED' }), ctx(id))
  const review = (id: number, body: unknown) => reviewsRoute.POST(json(`http://x/api/claims/${id}/reviews`, 'POST', body), ctx(id))

  async function wipe() {
    await prisma.claim.deleteMany({ where: { statement: { startsWith: TAG } } })
  }

  beforeAll(async () => {
    prisma = (await import('@/lib/prisma')).default
    claimsRoute = await import('@/app/api/claims/route')
    claimRoute = await import('@/app/api/claims/[id]/route')
    reviewsRoute = await import('@/app/api/claims/[id]/reviews/route')
    contestedRoute = await import('@/app/api/claims/[id]/contested/route')
    torahId = (await prisma.source.findFirstOrThrow({ where: { key: 'TORAH' } })).id
    verseId = (await prisma.verse.findFirstOrThrow({ where: { sourceId: torahId } })).id
    await wipe()
  })
  beforeEach(() => as('ADMIN'))
  afterAll(async () => { await wipe() })

  it('creates a claim with the traditions its source describes', async () => {
    const created = await newClaim()
    const row = await prisma.claim.findUniqueOrThrow({ where: { id: created.id } })
    expect(row.requiredTraditions).toEqual(['JEWISH'])
    expect(row.editorialStatus).toBe('IN_REVIEW')
    expect(row.revision).toBe(1)
  })

  it('lets an editor add a tradition but never remove the source tradition', async () => {
    const created = await newClaim({ extraTraditions: ['ISLAMIC'] })
    const row = await prisma.claim.findUniqueOrThrow({ where: { id: created.id } })
    expect(row.requiredTraditions.sort()).toEqual(['ISLAMIC', 'JEWISH'])
  })

  it('refuses to create a claim that is already published', async () => {
    const res = await claimsRoute.POST(json('http://x/api/claims', 'POST', {
      sourceId: torahId, statement: `${TAG} born published`, verseIds: [verseId], isPublished: true,
    }))
    expect(res.status).toBe(400)
    expect(await prisma.claim.count({ where: { statement: `${TAG} born published` } })).toBe(0)
  })

  it('refuses to publish without sign-off and names the missing tradition', async () => {
    const created = await newClaim()
    const res = await publish(created.id)
    expect(res.status).toBe(409)
    expect((await res.json()).error).toMatch(/missing sign-off for Judaism/)
    expect((await prisma.claim.findUniqueOrThrow({ where: { id: created.id } })).editorialStatus).toBe('IN_REVIEW')
  })

  it('publishes once the required tradition has signed off, and records an honest summary', async () => {
    const created = await newClaim()
    expect((await review(created.id, { tradition: 'JEWISH', verdict: 'ACCURATE' })).status).toBe(201)
    expect((await publish(created.id)).status).toBe(200)
    const row = await prisma.claim.findUniqueOrThrow({ where: { id: created.id } })
    expect(row.editorialStatus).toBe('PUBLISHED')
    // The administrator stood in, so this must read as the project editor, not a Jewish member.
    expect(row.signoffSummary).toEqual({ revision: 1, states: { JEWISH: 'EDITOR' } })
    const stored = await prisma.claimReview.findFirstOrThrow({ where: { claimId: created.id } })
    expect(stored.kind).toBe('PROJECT_EDITOR')
  })

  it('does not let an editor publish, whatever the sign-off state', async () => {
    const created = await newClaim()
    await review(created.id, { tradition: 'JEWISH', verdict: 'ACCURATE' })
    as('EDITOR')
    expect((await publish(created.id)).status).toBe(403)
  })

  it('blocks publication while an objection is unresolved', async () => {
    const created = await newClaim()
    await review(created.id, { tradition: 'JEWISH', verdict: 'ACCURATE' })
    expect((await review(created.id, { tradition: 'JEWISH', verdict: 'OBJECTS', comment: 'This wording misstates the view.' })).status).toBe(201)
    const res = await publish(created.id)
    expect(res.status).toBe(409)
    expect((await res.json()).error).toMatch(/objected|requested changes/)
  })

  it('lets an administrator publish past an objection only as contested, with a reason', async () => {
    const created = await newClaim()
    await review(created.id, { tradition: 'JEWISH', verdict: 'OBJECTS', comment: 'This wording misstates the view.' })
    const noReason = await contestedRoute.PATCH(json('x', 'PATCH', { isContested: true, reason: 'ok' }), ctx(created.id))
    expect(noReason.status).toBe(400)
    const marked = await contestedRoute.PATCH(json('x', 'PATCH', { isContested: true, reason: 'Published with the disagreement shown.' }), ctx(created.id))
    expect(marked.status).toBe(200)
    expect((await publish(created.id)).status).toBe(200)
    const row = await prisma.claim.findUniqueOrThrow({ where: { id: created.id } })
    expect(row.isContested).toBe(true)
    expect(row.signoffSummary).toMatchObject({ states: { JEWISH: 'CONTESTED' } })
  })

  it('refuses to mark a claim contested when nobody has objected', async () => {
    const created = await newClaim()
    await review(created.id, { tradition: 'JEWISH', verdict: 'ACCURATE' })
    const res = await contestedRoute.PATCH(json('x', 'PATCH', { isContested: true, reason: 'Trying to bypass review.' }), ctx(created.id))
    expect(res.status).toBe(409)
  })

  it('voids sign-off when the wording changes', async () => {
    const created = await newClaim()
    await review(created.id, { tradition: 'JEWISH', verdict: 'ACCURATE' })
    const edit = await claimRoute.PUT(json('x', 'PUT', { statement: `${TAG} reworded ${Date.now()}` }), ctx(created.id))
    expect(edit.status).toBe(200)
    const row = await prisma.claim.findUniqueOrThrow({ where: { id: created.id } })
    expect(row.revision).toBe(2)
    expect(row.signoffSummary).toBeNull()
    expect((await publish(created.id)).status).toBe(409)
  })

  it('cannot reword and publish in a single request using the old sign-off', async () => {
    const created = await newClaim()
    await review(created.id, { tradition: 'JEWISH', verdict: 'ACCURATE' })
    const res = await claimRoute.PUT(
      json('x', 'PUT', { statement: `${TAG} sneaky ${Date.now()}`, editorialStatus: 'PUBLISHED' }), ctx(created.id),
    )
    expect(res.status).toBe(409)
    expect((await prisma.claim.findUniqueOrThrow({ where: { id: created.id } })).editorialStatus).toBe('IN_REVIEW')
  })

  it('rejects a review for a tradition the claim does not describe, and for a draft', async () => {
    const created = await newClaim()
    expect((await review(created.id, { tradition: 'ISLAMIC', verdict: 'ACCURATE' })).status).toBe(400)
    const draft = await newClaim({ editorialStatus: 'DRAFT' })
    expect((await review(draft.id, { tradition: 'JEWISH', verdict: 'ACCURATE' })).status).toBe(409)
  })

  it('writes an audit event for every review', async () => {
    const created = await newClaim()
    await review(created.id, { tradition: 'JEWISH', verdict: 'ACCURATE' })
    const events = await prisma.editorialAuditEvent.findMany({ where: { entityType: 'Claim', entityId: String(created.id), action: 'REVIEW' } })
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({ actorId: 'admin', actorRole: 'ADMIN' })
  })
})
