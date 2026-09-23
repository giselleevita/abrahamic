/**
 * Assign one default translation per verse.
 *
 *   npx tsx scripts/import/set-defaults.ts
 *
 * Imports deliberately never claim the `isDefault` slot — which translation a
 * reader sees first is an editorial decision, not something a bulk load should
 * silently change. The consequence is that after an import most verses have no
 * default at all: 37,393 of 37,487 at the time this was written. Pages that
 * query `translations: { where: { isDefault: true } }` — claim cards and
 * comparison blocks among them — then render nothing for those verses.
 *
 * This applies the policy's priority order in one pass, so the rule lives in
 * one place rather than being re-decided per import.
 */
import 'dotenv/config'
import prisma from '../../src/lib/prisma'
import { DEFAULT_PRIORITY } from '../../src/lib/public-demo-policy'

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  // Build a CASE expression from the policy order so ranking cannot drift from
  // what the application believes the priority is.
  const ranking = DEFAULT_PRIORITY
    .map((name, i) => `WHEN ${escapeLiteral(name)} THEN ${i}`)
    .join(' ')

  const before = await prisma.verse.count()
  const withDefault = await prisma.verseTranslation.count({ where: { isDefault: true } })

  console.log(`\n  verses: ${before}   currently holding a default: ${withDefault}`)
  console.log(`  priority: ${DEFAULT_PRIORITY.join(' > ')}`)

  if (dryRun) {
    console.log('\n  DRY RUN — nothing written\n')
    return
  }

  await prisma.$executeRawUnsafe(`UPDATE verse_translations SET "isDefault" = false`)

  // One winner per verse: the highest-priority translation it actually has.
  // Unranked names sort last but still win when a verse has nothing else, so
  // no verse is left without a default.
  const updated = await prisma.$executeRawUnsafe(`
    UPDATE verse_translations SET "isDefault" = true
    WHERE id IN (
      SELECT DISTINCT ON ("verseId") id
      FROM verse_translations
      ORDER BY "verseId",
        CASE name ${ranking} ELSE ${DEFAULT_PRIORITY.length} END,
        id
    )
  `)

  const nowWithDefault = await prisma.verseTranslation.count({ where: { isDefault: true } })
  const orphaned = before - nowWithDefault

  console.log(`  rows marked default: ${updated}`)
  console.log(`  verses with a default: ${nowWithDefault}`)
  console.log(
    orphaned > 0
      ? `  verses still without one: ${orphaned} (these have no translations at all)`
      : '  every verse has a default',
  )
}

/** Minimal literal escaping — these values come from our own constant. */
function escapeLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
