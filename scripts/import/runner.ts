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
 *  - Resumable. Failures are collected per batch, not thrown, so one bad
 *    chapter cannot abandon a 30,000-verse import halfway.
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

async function upsertVerse(
  sourceId: number,
  v: ImportedVerse,
  stats: ImportStats,
  versification: Versification = 'CHRISTIAN',
): Promise<number> {
  // The scheme is part of the reference key so Masoretic and Christian rows for
  // the same citation stay distinct rather than colliding on the unique index.
  const referenceKey =
    versification === 'CHRISTIAN'
      ? `${v.book}.${v.chapter}.${v.verse}`
      : `${v.book}.${v.chapter}.${v.verse}.${versification}`

  const existing = await prisma.verse.findUnique({
    where: {
      sourceId_book_chapter_verse_versification: {
        sourceId,
        book: v.book,
        chapter: v.chapter,
        verse: v.verse,
        versification,
      },
    },
    select: { id: true },
  })

  if (existing) return existing.id

  const created = await prisma.verse.create({
    data: {
      sourceId,
      book: v.book,
      bookNumber: v.bookNumber,
      chapter: v.chapter,
      verse: v.verse,
      referenceKey,
      versification,
    },
    select: { id: true },
  })
  stats.versesCreated += 1
  return created.id
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
    for (const v of batch) {
      stats.fetched += 1

      if (!v.text?.trim()) {
        stats.skipped += 1
        continue
      }
      if (options.dryRun) continue

      try {
        const verseId = await upsertVerse(sourceId, v, stats, spec.versification ?? 'CHRISTIAN')

        // The unique key is (verseId, label, name), so re-running refreshes the
        // text of an existing row rather than creating a second copy.
        const existing = await prisma.verseTranslation.findUnique({
          where: {
            verseId_label_name: { verseId, label: spec.label, name: spec.name },
          },
          select: { id: true, text: true },
        })

        if (existing) {
          if (existing.text !== v.text) {
            await prisma.verseTranslation.update({
              where: { id: existing.id },
              data: {
                text: v.text,
                licenseCode: spec.licenseCode,
                sourceUrl: spec.sourceUrl,
                attribution: spec.attribution,
                retrievedAt,
              },
            })
            stats.translationsUpdated += 1
          } else {
            stats.skipped += 1
          }
        } else {
          await prisma.verseTranslation.create({
            data: {
              verseId,
              label: spec.label,
              name: spec.name,
              text: v.text,
              // Never claims the default slot on import. Which translation a
              // reader sees first is an editorial decision, not an import one.
              isDefault: false,
              licenseCode: spec.licenseCode,
              sourceUrl: spec.sourceUrl,
              attribution: spec.attribution,
              retrievedAt,
            },
          })
          stats.translationsCreated += 1
        }
      } catch (error) {
        // Collected, not thrown: one bad verse must not abandon the run.
        stats.errors.push(
          `${v.book} ${v.chapter}:${v.verse} — ${error instanceof Error ? error.message : String(error)}`,
        )
      }

      if (stats.fetched % BATCH_LOG_EVERY === 0) {
        console.log(`  … ${stats.fetched} verses processed`)
      }
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
