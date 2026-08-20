/**
 * Versification alignment check, with an optional quarantine.
 *
 *   npx tsx scripts/import/check-versification.ts
 *   npx tsx scripts/import/check-versification.ts --quarantine
 *
 * The Masoretic text and Christian translations divide verses differently. The
 * best-known case is the Psalms: Hebrew counts a psalm's superscription as
 * verse 1, so Psalm 51:1 in Hebrew is "For the choirmaster, a psalm of David"
 * while Psalm 51:1 in English is "Have mercy on me, God" — which is Hebrew
 * verse 3. Joel has four chapters in Hebrew and three in Christian Bibles.
 *
 * Because both texts were imported into verse rows keyed on
 * (source, book, chapter, verse), a divergent chapter ends up with Hebrew and
 * English on the same row while saying different things. On a platform whose
 * entire purpose is showing what each text says side by side, that is worse
 * than having no Hebrew at all: it silently asserts a correspondence that does
 * not exist.
 *
 * `--quarantine` removes the original-language rows in divergent chapters.
 * Nothing is permanently lost — the importer is idempotent, so re-running it
 * restores them once a real versification mapping exists.
 *
 * The proper fix is to model versification explicitly rather than assume one
 * numbering: store each tradition's own divisions and map between them. This
 * check exists so the gap is visible and measured until then.
 */
import 'dotenv/config'
import prisma from '../../src/lib/prisma'

const ORIGINAL_LANGUAGE = ['Hebrew (MT)']
const REFERENCE = 'World English Bible'

interface Divergent {
  book: string
  chapter: number
  heMax: number
  enMax: number
}

async function findDivergentChapters(): Promise<Divergent[]> {
  return prisma.$queryRaw<Divergent[]>`
    SELECT v.book,
           v.chapter,
           MAX(v.verse) FILTER (WHERE t.name = ANY(${ORIGINAL_LANGUAGE})) AS "heMax",
           MAX(v.verse) FILTER (WHERE t.name = ${REFERENCE})              AS "enMax"
    FROM verses v
    JOIN sources s ON s.id = v."sourceId"
    JOIN verse_translations t ON t."verseId" = v.id
    WHERE s.key IN ('TORAH', 'HEBREW_BIBLE')
    GROUP BY v.book, v.chapter
    HAVING MAX(v.verse) FILTER (WHERE t.name = ANY(${ORIGINAL_LANGUAGE})) IS NOT NULL
       AND MAX(v.verse) FILTER (WHERE t.name = ${REFERENCE}) IS NOT NULL
       AND MAX(v.verse) FILTER (WHERE t.name = ANY(${ORIGINAL_LANGUAGE}))
        <> MAX(v.verse) FILTER (WHERE t.name = ${REFERENCE})
    ORDER BY v.book, v.chapter
  `
}

async function main() {
  const quarantine = process.argv.includes('--quarantine')
  const divergent = await findDivergentChapters()

  const byBook = new Map<string, number>()
  for (const d of divergent) byBook.set(d.book, (byBook.get(d.book) ?? 0) + 1)

  console.log(`\n  chapters where Hebrew and English numbering diverge: ${divergent.length}`)
  for (const [book, n] of [...byBook.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`    ${book.padEnd(16)} ${n}`)
  }

  if (divergent.length === 0) {
    console.log('\n  No divergence detected.')
    return
  }

  if (!quarantine) {
    console.log(
      '\n  These chapters show Hebrew and English on the same verse row while the two' +
        '\n  texts do not correspond. Re-run with --quarantine to remove the Hebrew' +
        '\n  rows in these chapters until versification is modelled properly.',
    )
    process.exitCode = 1
    return
  }

  let removed = 0
  for (const d of divergent) {
    const result = await prisma.verseTranslation.deleteMany({
      where: {
        name: { in: ORIGINAL_LANGUAGE },
        verse: { book: d.book, chapter: d.chapter },
      },
    })
    removed += result.count
  }

  // Quarantining can strand verse rows that only ever existed because the
  // original-language text created them — a Masoretic verse with no Christian
  // counterpart. A verse with no translations renders as a blank line, so they
  // are removed too, but only when nothing in the editorial layer cites them.
  const orphaned = await prisma.$executeRawUnsafe(`
    DELETE FROM verses v
    WHERE NOT EXISTS (SELECT 1 FROM verse_translations t WHERE t."verseId" = v.id)
      AND NOT EXISTS (SELECT 1 FROM claim_verses cv WHERE cv."verseId" = v.id)
      AND NOT EXISTS (SELECT 1 FROM verse_links l WHERE l."verseAId" = v.id OR l."verseBId" = v.id)
      AND NOT EXISTS (SELECT 1 FROM timeline_event_verses te WHERE te."verseId" = v.id)
      AND NOT EXISTS (SELECT 1 FROM figure_relations fr WHERE fr."verseId" = v.id)
  `)

  console.log(`\n  quarantined ${removed} original-language rows across ${divergent.length} chapters`)
  if (orphaned > 0) {
    console.log(`  removed ${orphaned} verse rows left with no translations`)
  }
  console.log('  re-import restores them; the importer is idempotent.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
