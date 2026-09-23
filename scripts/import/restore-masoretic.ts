/**
 * Restore Hebrew for chapters where its verse division diverges.
 *
 *   npx tsx scripts/import/restore-masoretic.ts --dry-run
 *   npx tsx scripts/import/restore-masoretic.ts
 *
 * Those chapters had their Hebrew quarantined, because storing Masoretic and
 * Christian numbering on the same verse rows made the reader show text side by
 * side that did not correspond — Psalm 51:1 in Hebrew is the superscription,
 * while Psalm 51:1 in English is Hebrew verse 3.
 *
 * Now that a verse row carries its scheme, the Hebrew can come back on its own
 * MASORETIC rows: present and readable, but never claiming to be the same verse
 * as the English beside it. Chapters where the two schemes coincide are left
 * alone — their Hebrew stays on the shared rows, which is what makes the
 * side-by-side reader work for the ~790 chapters that do align.
 */
import 'dotenv/config'
import prisma from '../../src/lib/prisma'
import { runImport, reportStats } from './runner'
import {
  createSefariaAdapter,
  HEBREW_TORAH_MASORETIC_SPEC,
  HEBREW_TANAKH_MASORETIC_SPEC,
  HEBREW_VERSION_QUERY,
} from './adapters/sefaria'
import { TORAH_CANON, NEVIIM_KETUVIM_CANON } from './canon'

/**
 * Chapters holding Christian-numbered text but no Hebrew.
 *
 * After quarantine these are exactly the divergent ones. Deriving the list from
 * the data rather than hardcoding it means a re-run after a fresh import finds
 * the same chapters without anyone maintaining a list.
 */
async function chaptersMissingHebrew(sourceKey: 'TORAH' | 'HEBREW_BIBLE') {
  return prisma.$queryRaw<{ book: string; chapter: number }[]>`
    SELECT v.book, v.chapter
    FROM verses v
    JOIN sources s ON s.id = v."sourceId"
    JOIN verse_translations t ON t."verseId" = v.id
    WHERE s.key = ${sourceKey}::"SourceKey"
      AND v.versification = 'CHRISTIAN'
    GROUP BY v.book, v.chapter
    HAVING bool_or(t.name = 'World English Bible')
       AND NOT bool_or(t.name = 'Hebrew (MT)')
    ORDER BY v.book, v.chapter
  `
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  for (const [sourceKey, canon, spec] of [
    ['TORAH', TORAH_CANON, HEBREW_TORAH_MASORETIC_SPEC],
    ['HEBREW_BIBLE', NEVIIM_KETUVIM_CANON, HEBREW_TANAKH_MASORETIC_SPEC],
  ] as const) {
    const chapters = await chaptersMissingHebrew(sourceKey)
    if (chapters.length === 0) {
      console.log(`\n  ${sourceKey}: no chapters need Masoretic Hebrew.`)
      continue
    }

    const refs = new Set(chapters.map((c) => `${c.book} ${c.chapter}`))
    console.log(`\n  ${sourceKey}: ${refs.size} chapter(s) to restore under MASORETIC`)
    console.log(`    ${[...refs].slice(0, 8).join(', ')}${refs.size > 8 ? ' …' : ''}`)

    const stats = await runImport(
      createSefariaAdapter(canon, spec, HEBREW_VERSION_QUERY, { onlyChapters: refs }),
      { dryRun },
    )
    reportStats(stats)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
