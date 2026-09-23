/**
 * Corpus completeness check.
 *
 *   npx tsx scripts/import/verify.ts
 *
 * An import exiting zero does not mean a book is complete: the upstream service
 * rate-limits, and a run can silently lose whole chapters. The first full Torah
 * import reported no errors and was still short 241 verses across four books.
 *
 * This compares what is loaded against canonical counts and exits non-zero when
 * anything is missing, so it can gate a deployment rather than being a query
 * someone remembers to run.
 */
import 'dotenv/config'
import prisma from '../../src/lib/prisma'
import { CANON_BY_SOURCE, type CanonBook } from './canon'

interface Row {
  source: string
  book: string
  actual: number
  expected?: number
  chapters: number
  chaptersPresent: number
  omissions: number
  missingChapters: number[]
}

async function checkBook(
  sourceKey: string,
  sourceId: number,
  book: CanonBook,
): Promise<Row> {
  const [actual, present] = await Promise.all([
    prisma.verse.count({ where: { sourceId, book: book.book } }),
    prisma.verse.findMany({
      where: { sourceId, book: book.book },
      select: { chapter: true },
      distinct: ['chapter'],
    }),
  ])

  const seen = new Set(present.map((p) => p.chapter))
  const expectedChapters =
    book.chapterNumbers ?? Array.from({ length: book.chapters }, (_, i) => i + 1)
  const missingChapters = expectedChapters.filter((c) => !seen.has(c))

  // Known textual variants are not gaps, so they come off the expected total.
  const omissions = book.knownOmissions?.length ?? 0

  return {
    source: sourceKey,
    book: book.book,
    actual,
    // Undefined where the canonical total has not been verified; the check
    // then falls back to chapter coverage.
    expected: book.verses === undefined ? undefined : book.verses - omissions,
    chapters: book.chapters,
    chaptersPresent: (book.chapterNumbers?.length ?? book.chapters) - missingChapters.length,
    omissions,
    missingChapters,
  }
}

async function main() {
  const rows: Row[] = []

  for (const [sourceKey, books] of Object.entries(CANON_BY_SOURCE)) {
    const source = await prisma.source.findUnique({
      where: { key: sourceKey as never },
      select: { id: true },
    })
    if (!source) continue

    for (const book of books) {
      rows.push(await checkBook(sourceKey, source.id, book))
    }
  }

  console.log('\n  book              loaded   canonical   status')
  console.log('  ' + '─'.repeat(52))

  let incomplete = 0
  for (const r of rows) {
    const complete =
      r.expected === undefined
        ? r.missingChapters.length === 0
        : r.actual >= r.expected
    if (!complete) incomplete += 1

    const variantNote = r.omissions ? ` (${r.omissions} known variant)` : ''
    const gapNote = r.missingChapters.length
      ? ` (ch ${r.missingChapters.slice(0, 6).join(',')}${r.missingChapters.length > 6 ? '…' : ''})`
      : ''

    let status: string
    if (complete) {
      status = r.expected === undefined
        ? `all ${r.chapters} chapters present`
        : `complete${variantNote}`
    } else if (r.expected === undefined) {
      status = `missing ${r.missingChapters.length} chapter(s)${gapNote}`
    } else {
      status = `short ${r.expected - r.actual}${gapNote || ' (partial chapters)'}`
    }

    const expectedCol = r.expected === undefined ? `${r.chaptersPresent}/${r.chapters} ch` : String(r.expected)
    console.log(
      `  ${r.book.padEnd(16)} ${String(r.actual).padStart(6)}   ${expectedCol.padStart(9)}   ${status}`,
    )
  }

  // Only books with a verified total contribute to the percentage; otherwise
  // the figure would silently mean something different per book.
  const counted = rows.filter((r) => r.expected !== undefined)
  const loaded = counted.reduce((n, r) => n + r.actual, 0)
  const expected = counted.reduce((n, r) => n + (r.expected ?? 0), 0)
  console.log('  ' + '─'.repeat(52))
  console.log(
    `  ${'total'.padEnd(16)} ${String(loaded).padStart(6)}   ${String(expected).padStart(9)}   ` +
      `${expected ? Math.round((loaded / expected) * 1000) / 10 : 0}% of verified books`,
  )

  if (incomplete > 0) {
    console.log(
      `\n  ${incomplete} book(s) incomplete. Re-run the import — it is idempotent and will fill only the gaps.`,
    )
    process.exitCode = 1
  } else {
    console.log('\n  All tracked books are complete.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
