import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../src/generated/prisma/client'
import { unmetSignoffs, type ReviewRow, type ReviewTradition } from '../../src/lib/editorial/signoff'

const describeDb = process.env.DATABASE_URL ? describe : describe.skip
const PREFIX = 'signoff-db-test'

describeDb('tradition sign-off (database triggers)', () => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
  let sourceId = 0
  let seq = 0

  async function makeClaim(opts: { required: ReviewTradition[]; contested?: boolean; status?: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' }) {
    seq += 1
    return prisma.claim.create({
      data: {
        sourceId,
        statement: `${PREFIX} statement ${Date.now()}-${seq}`,
        contentHash: `${PREFIX}-${Date.now()}-${seq}`,
        editorialStatus: opts.status ?? 'IN_REVIEW',
        isPublished: opts.status === 'PUBLISHED',
        requiredTraditions: opts.required,
        isContested: opts.contested ?? false,
      },
    })
  }

  const review = (claimId: number, revision: number, row: ReviewRow, reviewerId: string) =>
    prisma.claimReview.create({ data: { claimId, revision, tradition: row.tradition, kind: row.kind, verdict: row.verdict, reviewerId } })

  const publish = (id: number) =>
    prisma.claim.update({ where: { id }, data: { editorialStatus: 'PUBLISHED', isPublished: true } })

  async function wipe() {
    await prisma.comparison.deleteMany({ where: { slug: { startsWith: PREFIX } } })
    await prisma.claim.deleteMany({ where: { contentHash: { startsWith: PREFIX } } })
  }

  beforeAll(async () => {
    sourceId = (await prisma.source.findFirstOrThrow({ where: { key: 'TORAH' } })).id
    await wipe()
  })
  afterAll(async () => {
    await wipe()
    await prisma.$disconnect()
  })

  it('agrees with the pure rules for every combination of verdicts', async () => {
    const options: (ReviewRow | null)[] = [
      null,
      { tradition: 'JEWISH', kind: 'TRADITION_MEMBER', verdict: 'ACCURATE' },
      { tradition: 'JEWISH', kind: 'PROJECT_EDITOR', verdict: 'ACCURATE' },
      { tradition: 'JEWISH', kind: 'TRADITION_MEMBER', verdict: 'OBJECTS' },
      { tradition: 'JEWISH', kind: 'TRADITION_MEMBER', verdict: 'NEEDS_CHANGES' },
    ]
    const forTradition = (opt: ReviewRow | null, tradition: ReviewTradition): ReviewRow | null =>
      opt ? { ...opt, tradition } : null

    const requiredSets: ReviewTradition[][] = [['JEWISH'], ['JEWISH', 'CHRISTIAN']]
    let checked = 0
    for (const required of requiredSets) {
      for (const contested of [false, true]) {
        for (const first of options) {
          for (const second of required.length > 1 ? options : [null]) {
            const rows = [forTradition(first, 'JEWISH'), forTradition(second, 'CHRISTIAN')].filter((r): r is ReviewRow => r !== null)
            const claim = await makeClaim({ required, contested })
            for (const [i, row] of rows.entries()) {
              await review(claim.id, claim.revision, row, row.kind === 'PROJECT_EDITOR' ? 'admin' : `member-${i}`)
            }
            const expected = unmetSignoffs(required, rows, contested).allowed
            const outcome = await publish(claim.id).then(() => true, () => false)
            expect(outcome, `required=${required} contested=${contested} rows=${JSON.stringify(rows)}`).toBe(expected)
            checked += 1
          }
        }
      }
    }
    expect(checked).toBe(2 * (5 + 25))
  }, 60_000)

  it('refuses to publish a claim that has no required traditions', async () => {
    const claim = await makeClaim({ required: [] })
    await expect(publish(claim.id)).rejects.toThrow(/signoff/)
  })

  it('names the missing tradition in the error', async () => {
    const claim = await makeClaim({ required: ['JEWISH', 'CHRISTIAN'] })
    await review(claim.id, claim.revision, { tradition: 'JEWISH', kind: 'TRADITION_MEMBER', verdict: 'ACCURATE' }, 'm1')
    await expect(publish(claim.id)).rejects.toThrow(/missing sign-off for CHRISTIAN/)
  })

  it('does not gate claims that are already published (legacy content stays up)', async () => {
    const claim = await makeClaim({ required: ['JEWISH'], status: 'PUBLISHED' })
    const updated = await prisma.claim.update({ where: { id: claim.id }, data: { notes: 'touched' } })
    expect(updated.editorialStatus).toBe('PUBLISHED')
  })

  it('allows unpublishing and does not require sign-off to go back to draft', async () => {
    const claim = await makeClaim({ required: ['JEWISH'], status: 'PUBLISHED' })
    const updated = await prisma.claim.update({ where: { id: claim.id }, data: { editorialStatus: 'DRAFT', isPublished: false } })
    expect(updated.editorialStatus).toBe('DRAFT')
  })

  it('bumps the revision when the statement changes, voiding earlier sign-offs', async () => {
    const claim = await makeClaim({ required: ['ISLAMIC'] })
    await review(claim.id, claim.revision, { tradition: 'ISLAMIC', kind: 'TRADITION_MEMBER', verdict: 'ACCURATE' }, 'm1')
    const edited = await prisma.claim.update({
      where: { id: claim.id },
      data: { statement: `${PREFIX} edited ${Date.now()}`, contentHash: `${PREFIX}-edited-${Date.now()}-${seq}`, signoffSummary: { revision: 1, states: { ISLAMIC: 'MEMBER' } }, isContested: true },
    })
    expect(edited.revision).toBe(claim.revision + 1)
    expect(edited.isContested).toBe(false)
    expect(edited.signoffSummary).toBeNull()
    await expect(publish(claim.id)).rejects.toThrow(/missing sign-off for ISLAMIC/)
  })

  it('does not bump the revision for edits that leave the statement alone', async () => {
    const claim = await makeClaim({ required: ['ISLAMIC'] })
    const updated = await prisma.claim.update({ where: { id: claim.id }, data: { notes: 'a note' } })
    expect(updated.revision).toBe(claim.revision)
  })

  it('rejects a review recorded against a stale revision', async () => {
    const claim = await makeClaim({ required: ['ISLAMIC'] })
    await prisma.claim.update({ where: { id: claim.id }, data: { statement: `${PREFIX} v2 ${Date.now()}`, contentHash: `${PREFIX}-v2-${Date.now()}-${seq}` } })
    await expect(
      review(claim.id, claim.revision, { tradition: 'ISLAMIC', kind: 'TRADITION_MEMBER', verdict: 'ACCURATE' }, 'm1'),
    ).rejects.toThrow(/revision/)
  })

  it('rejects a review for a tradition the claim does not require', async () => {
    const claim = await makeClaim({ required: ['ISLAMIC'] })
    await expect(
      review(claim.id, claim.revision, { tradition: 'JEWISH', kind: 'TRADITION_MEMBER', verdict: 'ACCURATE' }, 'm1'),
    ).rejects.toThrow(/not a tradition this claim requires/)
  })

  it('rejects a SHARED review and a project-editor review by anyone but the administrator', async () => {
    const claim = await makeClaim({ required: ['ISLAMIC'] })
    await expect(
      prisma.claimReview.create({ data: { claimId: claim.id, revision: claim.revision, tradition: 'SHARED', kind: 'TRADITION_MEMBER', verdict: 'ACCURATE', reviewerId: 'm1' } }),
    ).rejects.toThrow()
    await expect(
      review(claim.id, claim.revision, { tradition: 'ISLAMIC', kind: 'PROJECT_EDITOR', verdict: 'ACCURATE' }, 'someone-else'),
    ).rejects.toThrow()
  })

  it('keeps a review (anonymously) when the reviewer account is deleted', async () => {
    const claim = await makeClaim({ required: ['ISLAMIC'] })
    await review(claim.id, claim.revision, { tradition: 'ISLAMIC', kind: 'TRADITION_MEMBER', verdict: 'ACCURATE' }, 'deleted-user-id')
    expect(await prisma.claimReview.count({ where: { claimId: claim.id } })).toBe(1)
  })

  it('only lets a comparison go live once all its claims are published', async () => {
    const published = await makeClaim({ required: ['JEWISH'], status: 'PUBLISHED' })
    const draft = await makeClaim({ required: ['JEWISH'], status: 'DRAFT' })
    const comparison = await prisma.comparison.create({
      data: {
        title: `${PREFIX} comparison`, slug: `${PREFIX}-${Date.now()}`, tag: 'SHARED',
        claims: { create: [{ claimId: published.id, position: 0 }, { claimId: draft.id, position: 1 }] },
      },
    })
    await expect(prisma.comparison.update({ where: { id: comparison.id }, data: { isPublished: true } })).rejects.toThrow(/every claim in a comparison must be published/)
    await prisma.claim.update({ where: { id: draft.id }, data: { editorialStatus: 'IN_REVIEW' } })
    await review(draft.id, draft.revision, { tradition: 'JEWISH', kind: 'TRADITION_MEMBER', verdict: 'ACCURATE' }, 'm1')
    await publish(draft.id)
    const live = await prisma.comparison.update({ where: { id: comparison.id }, data: { isPublished: true } })
    expect(live.isPublished).toBe(true)
  })

  it('stops an unpublished claim being attached to an already-published comparison', async () => {
    const published = await makeClaim({ required: ['JEWISH'], status: 'PUBLISHED' })
    const draft = await makeClaim({ required: ['JEWISH'], status: 'DRAFT' })
    const comparison = await prisma.comparison.create({
      data: { title: `${PREFIX} live`, slug: `${PREFIX}-live-${Date.now()}`, tag: 'SHARED', claims: { create: [{ claimId: published.id, position: 0 }] } },
    })
    await prisma.comparison.update({ where: { id: comparison.id }, data: { isPublished: true } })
    // Publishing and swapping the claims in one update used to slip past the publish gate.
    await expect(
      prisma.comparison.update({
        where: { id: comparison.id },
        data: { claims: { deleteMany: {}, create: [{ claimId: draft.id, position: 0 }] } },
      }),
    ).rejects.toThrow(/published comparison can only contain published claims/)
  })

  it('refuses to publish a comparison with no claims', async () => {
    const comparison = await prisma.comparison.create({ data: { title: `${PREFIX} empty`, slug: `${PREFIX}-empty-${Date.now()}`, tag: 'SHARED' } })
    await expect(prisma.comparison.update({ where: { id: comparison.id }, data: { isPublished: true } })).rejects.toThrow(/no claims/)
  })
})
