/**
 * Runs the neutrality lint over every published question actually in the
 * database.
 *
 * The unit tests in src/lib/learn/neutrality.test.ts prove the rules work on
 * synthetic drafts. This proves the shipped *content* obeys them — the schema
 * CHECKs cannot catch everything (a bare distractor on contested material, an
 * incomplete divergence map), and a quiz that mis-frames a tradition is the
 * failure mode that actually matters here.
 *
 * Skipped when DATABASE_URL is unset.
 */
import { afterAll, describe, expect, it } from 'vitest'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { lintQuestion, isPublishable, type QuestionDraft } from '../src/lib/learn/neutrality'

const DATABASE_URL = process.env.DATABASE_URL
const describeDb = DATABASE_URL ? describe : describe.skip

describeDb('seeded quiz content', () => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })
  afterAll(async () => { await prisma.$disconnect() })

  async function publishedQuestions() {
    return prisma.question.findMany({
      where: { isPublished: true },
      include: { options: { orderBy: { position: 'asc' } }, chapter: { select: { slug: true } } },
      orderBy: [{ chapterId: 'asc' }, { position: 'asc' }],
    })
  }

  it('has questions to check', async () => {
    expect((await publishedQuestions()).length).toBeGreaterThan(0)
  })

  it('passes the neutrality lint with no BLOCK flags', async () => {
    const failures: string[] = []

    for (const q of await publishedQuestions()) {
      const draft: QuestionDraft = {
        kind: q.kind,
        format: q.format,
        prompt: q.prompt,
        explanation: q.explanation,
        subjectTradition: q.subjectTradition,
        isContested: q.isContested,
        hasProvenance: Boolean(q.claimId ?? q.conceptId ?? q.comparisonId ?? q.timelineEventId),
        options: q.options.map((o) => ({
          text: o.text,
          isCorrect: o.isCorrect,
          optionTradition: o.optionTradition,
          presence: o.presence,
          rationale: o.rationale,
        })),
      }

      const blocking = lintQuestion(draft).filter((f) => f.severity === 'BLOCK')
      if (blocking.length > 0) {
        failures.push(`[${q.chapter.slug}] "${q.prompt.slice(0, 60)}" -> ${blocking.map((f) => f.code).join(', ')}`)
      }
      expect(isPublishable(lintQuestion(draft))).toBe(blocking.length === 0)
    }

    expect(failures).toEqual([])
  })

  it('derives isContested from the source rather than trusting the author', async () => {
    const questions = await prisma.question.findMany({
      where: { comparisonId: { not: null } },
      include: { comparison: { select: { tag: true, isControversial: true, slug: true } } },
    })

    for (const q of questions) {
      const shouldBeContested =
        q.comparison!.isControversial || q.comparison!.tag === 'CONTRADICTION'
      expect(
        { slug: q.comparison!.slug, contested: q.isContested },
      ).toEqual({ slug: q.comparison!.slug, contested: shouldBeContested })
    }
  })

  it('gives every contested question a fully attributed option set', async () => {
    const contested = await prisma.question.findMany({
      where: { isPublished: true, isContested: true },
      include: { options: true },
    })

    expect(contested.length).toBeGreaterThan(0) // contested material is included, not avoided
    for (const q of contested) {
      for (const o of q.options) {
        expect(Boolean(o.optionTradition) || Boolean(o.rationale?.trim())).toBe(true)
      }
    }
  })

  it('has a published chapter only when a human recorded a neutrality review', async () => {
    const unreviewed = await prisma.chapter.findMany({
      where: { isPublished: true, neutralityReviewedAt: null },
      select: { slug: true },
    })
    expect(unreviewed.map((c) => c.slug)).toEqual([])
  })
})
