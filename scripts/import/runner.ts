/**
 * The ingestion runner.
 *
 * Properties that matter more than speed, because this will be re-run many
 * times against a partially-loaded database:
 *
 *  - Idempotent. Keyed on the natural identity of a verse
 *    (source + book + chapter + verse) and of a translation
 *    (verse + label + name), both of which already carry unique constraints.
 *    Re-running updates text in place rather than duplicating it.
 *  - Resumable. Completed batches remain in place after a later failure, so
 *    re-running fills gaps without duplicating already imported verses.
 *  - Provenance-carrying. Every row records its licence, source URL,
 *    attribution and retrieval time.
 *  - Statistics-aware. Runs ANALYZE at the end: after a bulk load the planner's
 *    statistics are stale, and it will choose a sequential scan over the GIN
 *    index until they are refreshed. This was observed, not assumed.
 */
import prisma from '../../src/lib/prisma'
import {
  REMOVED_TRANSLATION_NAMES,
  PERMITTED_LICENSE_CODES,
} from '../../src/lib/public-demo-policy'
import type { Versification } from '../../src/generated/prisma/client'
import type { ImportAdapter, ImportStats, ImportedVerse } from './types'

const BATCH_LOG_EVERY = 500

async function resolveSourceId(sourceKey: string): Promise<number> {
  const source = await prisma.source.findUnique({
    where: { key: sourceKey as never },
    select: { id: true },
  })
  if (!source) {
    throw new Error(
      `Source "${sourceKey}" is not seeded. Run the seed before importing into it.`,
    )
  }
  return source.id
}

const WRITE_BATCH_SIZE = 100

function verseKey(v: Pick<ImportedVerse, 'book' | 'chapter' | 'verse'>): string {
  return `${v.book}\u0000${v.chapter}\u0000${v.verse}`
}

async function writeBatch(
  sourceId: number,
  verses: ImportedVerse[],
  spec: ImportAdapter['spec'],
  retrievedAt: Date,
  stats: ImportStats,
): Promise<void> {
  const versification: Versification = spec.versification ?? 'CHRISTIAN'
  // Avoid repeated remote round trips: one insert, one lookup, and one
  // translation insert per chapter-sized chunk. Existing rows remain intact.
  const inserted = await prisma.verse.createMany({
    data: verses.map((v) => ({
      sourceId,
      book: v.book,
      bookNumber: v.bookNumber,
      chapter: v.chapter,
      verse: v.verse,
      referenceKey: versification === 'CHRISTIAN'
        ? `${v.book}.${v.chapter}.${v.verse}`
        : `${v.book}.${v.chapter}.${v.verse}.${versification}`,
      versification,
    })),
    skipDuplicates: true,
  })
  stats.versesCreated += inserted.count

  const stored = await prisma.verse.findMany({
    where: {
      sourceId,
      versification,
      OR: verses.map((v) => ({ book: v.book, chapter: v.chapter, verse: v.verse })),
    },
    select: { id: true, book: true, chapter: true, verse: true },
  })
  const ids = new Map(stored.map((v) => [verseKey(v), v.id]))
  const missing = verses.filter((v) => !ids.has(verseKey(v)))
  if (missing.length) {
    throw new Error(`${missing.length} verse identities could not be resolved after insert`)
  }

  const verseIds = stored.map((v) => v.id)
  const existing = await prisma.verseTranslation.findMany({
    where: { verseId: { in: verseIds }, label: spec.label, name: spec.name },
    select: { id: true, verseId: true, text: true },
  })
  const byVerseId = new Map(existing.map((row) => [row.verseId, row]))
  const fresh = verses.filter((v) => !byVerseId.has(ids.get(verseKey(v))!))
  if (fresh.length) {
    const result = await prisma.verseTranslation.createMany({
      data: fresh.map((v) => ({
        verseId: ids.get(verseKey(v))!,
        label: spec.label,
        name: spec.name,
        text: v.text,
        isDefault: false,
        licenseCode: spec.licenseCode,
        sourceUrl: spec.sourceUrl,
        attribution: spec.attribution,
        retrievedAt,
      })),
      skipDuplicates: true,
    })
    stats.translationsCreated += result.count
  }

  for (const v of verses) {
    const row = byVerseId.get(ids.get(verseKey(v))!)
    if (!row) continue
    if (row.text === v.text) {
      stats.skipped += 1
      continue
    }
    await prisma.verseTranslation.update({
      where: { id: row.id },
      data: {
        text: v.text,
        licenseCode: spec.licenseCode,
        sourceUrl: spec.sourceUrl,
        attribution: spec.attribution,
        retrievedAt,
      },
    })
    stats.translationsUpdated += 1
  }
}

export async function runImport(
  adapter: ImportAdapter,
  options: { limitBooks?: number; dryRun?: boolean } = {},
): Promise<ImportStats> {
  const stats: ImportStats = {
    fetched: 0, versesCreated: 0, translationsCreated: 0,
    translationsUpdated: 0, skipped: 0, errors: [],
  }

  const { spec } = adapter

  // Refuse to import text the content policy will then refuse to display.
  // Without this an import can spend an hour writing rows that every page
  // silently filters out, which reads as a broken importer rather than a
  // deliberate policy decision.
  if ((REMOVED_TRANSLATION_NAMES as readonly string[]).includes(spec.name)) {
    throw new Error(
      `"${spec.name}" is on REMOVED_TRANSLATION_NAMES, so the content policy ` +
        `would hide every row this import writes.\n` +
        `  If its licence has been verified for your deployment, remove it from ` +
        `that list in src/lib/public-demo-policy.ts first — that is a licensing ` +
        `decision, not an import one.`,
    )
  }

  if (!PERMITTED_LICENSE_CODES.has(spec.licenseCode)) {
    throw new Error(
      `Licence "${spec.licenseCode}" is not in PERMITTED_LICENSE_CODES, so this ` +
        `text would be imported and then hidden. Add the licence deliberately or ` +
        `pick a different edition.`,
    )
  }

  const sourceId = await resolveSourceId(spec.sourceKey)
  const retrievedAt = new Date()

  console.log(`\n→ Importing "${spec.name}" into ${spec.sourceKey}`)
  console.log(`  licence: ${spec.licenseCode} · ${spec.sourceUrl}`)
  if (options.dryRun) console.log('  DRY RUN — nothing will be written\n')

  for await (const batch of adapter.fetchVerses({ limitBooks: options.limitBooks })) {
    stats.fetched += batch.length
    const valid = batch.filter((v) => v.text?.trim())
    stats.skipped += batch.length - valid.length
    if (options.dryRun || valid.length === 0) continue

    for (let start = 0; start < valid.length; start += WRITE_BATCH_SIZE) {
      const chunk = valid.slice(start, start + WRITE_BATCH_SIZE)
      try {
        await writeBatch(sourceId, chunk, spec, retrievedAt, stats)
      } catch (error) {
        const first = chunk[0]
        stats.errors.push(
          `${first.book} ${first.chapter}:${first.verse} (batch of ${chunk.length}) — ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }
    if (stats.fetched >= BATCH_LOG_EVERY && stats.fetched % BATCH_LOG_EVERY < batch.length) {
      console.log(`  … ${stats.fetched} verses processed`)
    }
  }

  if (!options.dryRun && (stats.versesCreated > 0 || stats.translationsCreated > 0)) {
    // Observed during benchmarking: without this the planner keeps stale
    // statistics and sequential-scans instead of using the GIN index.
    console.log('  refreshing planner statistics…')
    await prisma.$executeRawUnsafe('ANALYZE verses')
    await prisma.$executeRawUnsafe('ANALYZE verse_translations')
  }

  return stats
}

export function reportStats(stats: ImportStats): void {
  console.log('\n  ── Result ─────────────────────────────')
  console.log(`  fetched:                ${stats.fetched}`)
  console.log(`  verses created:         ${stats.versesCreated}`)
  console.log(`  translations created:   ${stats.translationsCreated}`)
  console.log(`  translations updated:   ${stats.translationsUpdated}`)
  console.log(`  unchanged / skipped:    ${stats.skipped}`)
  console.log(`  errors:                 ${stats.errors.length}`)
  for (const e of stats.errors.slice(0, 10)) console.log(`    - ${e}`)
  if (stats.errors.length > 10) {
    console.log(`    … and ${stats.errors.length - 10} more`)
  }
}
