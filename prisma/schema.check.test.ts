/**
 * Pins the hand-written CHECK constraints in the Learn migration.
 *
 * Prisma cannot express these in schema.prisma, so they live in raw SQL at the
 * bottom of the add_learn migration's migration.sql file. A future
 * `prisma migrate dev --create-only` regeneration would NOT reproduce them, and
 * their loss would be silent — the app would keep working while the neutrality
 * and polymorphism guarantees quietly stopped being enforced. These tests fail
 * loudly in that case.
 *
 * Requires a database (CI provisions Postgres and runs migrate deploy).
 * Skipped when DATABASE_URL is unset so unit runs stay offline.
 */
import { afterAll, describe, expect, it } from 'vitest'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const DATABASE_URL = process.env.DATABASE_URL
const describeDb = DATABASE_URL ? describe : describe.skip

describeDb('Learn migration CHECK constraints', () => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })
  afterAll(async () => { await prisma.$disconnect() })

  const EXPECTED = [
    'chapter_items_exactly_one_ref',
    'chapter_items_type_matches_ref',
    'chapters_quiz_pass_percent_range',
    'chapters_quiz_question_count_positive',
    'option_divergence_needs_tradition',
    'questions_contested_kind_allowed',
    'questions_provenance_exactly_one',
    'questions_provenance_matches_type',
    'questions_subject_tradition_not_shared',
    'questions_subject_tradition_required',
  ]

  it('has every hand-written constraint present in the database', async () => {
    const rows = await prisma.$queryRaw<{ conname: string }[]>`
      SELECT conname FROM pg_constraint
      WHERE contype = 'c'
        AND conrelid::regclass::text IN
            ('chapter_items', 'questions', 'question_answer_options', 'chapters')
      ORDER BY conname
    `
    const found = rows.map((r) => r.conname)
    expect(EXPECTED.filter((name) => !found.includes(name))).toEqual([])
  })

  it('rejects a chapter item that references two entities at once', async () => {
    await expect(
      prisma.$executeRaw`
        INSERT INTO chapter_items ("chapterId", "itemType", position, "conceptId", "themeId", "createdAt", "updatedAt")
        VALUES (-1, 'CONCEPT', 0, 1, 1, now(), now())
      `,
    ).rejects.toThrow(/chapter_items_exactly_one_ref/)
  })

  it('rejects a chapter item whose itemType disagrees with the FK that is set', async () => {
    await expect(
      prisma.$executeRaw`
        INSERT INTO chapter_items ("chapterId", "itemType", position, "themeId", "createdAt", "updatedAt")
        VALUES (-1, 'CONCEPT', 0, 1, now(), now())
      `,
    ).rejects.toThrow(/chapter_items_type_matches_ref/)
  })

  it('rejects a TRADITION_TEACHING question with no subjectTradition', async () => {
    await expect(
      prisma.$executeRaw`
        INSERT INTO questions ("chapterId", kind, format, difficulty, position, prompt, explanation,
                               "isPublished", "sourceType", "conceptId", "createdAt", "updatedAt")
        VALUES (-1, 'TRADITION_TEACHING', 'SINGLE_CHOICE', 'CORE', 0, 'p', 'e',
                false, 'CONCEPT', 1, now(), now())
      `,
    ).rejects.toThrow(/questions_subject_tradition_required/)
  })

  it('rejects a contested question asked in a non-attributive kind', async () => {
    await expect(
      prisma.$executeRaw`
        INSERT INTO questions ("chapterId", kind, format, difficulty, position, prompt, explanation,
                               "isPublished", "sourceType", "conceptId", "isContested", "createdAt", "updatedAt")
        VALUES (-1, 'TERMINOLOGY', 'SINGLE_CHOICE', 'CORE', 0, 'p', 'e',
                false, 'CONCEPT', 1, true, now(), now())
      `,
    ).rejects.toThrow(/questions_contested_kind_allowed/)
  })

  it('rejects a question with no provenance at all', async () => {
    await expect(
      prisma.$executeRaw`
        INSERT INTO questions ("chapterId", kind, format, difficulty, position, prompt, explanation,
                               "isPublished", "sourceType", "createdAt", "updatedAt")
        VALUES (-1, 'TERMINOLOGY', 'SINGLE_CHOICE', 'CORE', 0, 'p', 'e',
                false, 'CONCEPT', now(), now())
      `,
    ).rejects.toThrow(/questions_provenance_exactly_one/)
  })

  it('rejects SHARED as the subject tradition of an attributive question', async () => {
    await expect(
      prisma.$executeRaw`
        INSERT INTO questions ("chapterId", kind, format, difficulty, position, prompt, explanation,
                               "isPublished", "sourceType", "conceptId", "subjectTradition", "createdAt", "updatedAt")
        VALUES (-1, 'TRADITION_TEACHING', 'SINGLE_CHOICE', 'CORE', 0, 'p', 'e',
                false, 'CONCEPT', 1, 'SHARED', now(), now())
      `,
    ).rejects.toThrow(/questions_subject_tradition_not_shared/)
  })
})
