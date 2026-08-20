/**
 * Import CLI.
 *
 *   npx tsx scripts/import/index.ts web-torah --books 1 --dry-run
 *   npx tsx scripts/import/index.ts web-torah --books 1
 *   npx tsx scripts/import/index.ts web-nt
 *
 * Imports are idempotent, so re-running after a partial failure is the normal
 * way to finish a load rather than something to avoid.
 */
// tsx does not read .env on its own; `prisma db seed` gets it from
// prisma.config.ts, but this CLI is invoked directly.
import 'dotenv/config'
import prisma from '../../src/lib/prisma'
import { runImport, reportStats } from './runner'
import {
  createWebBibleAdapter,
  TORAH_BOOKS,
  NT_BOOKS,
  HEBREW_BIBLE_BOOKS,
  REST_OF_NT_BOOKS,
  WEB_TORAH_SPEC,
  WEB_NT_SPEC,
  WEB_HEBREW_BIBLE_SPEC,
} from './adapters/web-bible'
import { createQuranAdapter, QURAN_ARABIC_SPEC } from './adapters/quran'
import {
  createSefariaAdapter,
  HEBREW_TORAH_SPEC, HEBREW_TANAKH_SPEC,
  JPS_TORAH_SPEC, JPS_TANAKH_SPEC,
  HEBREW_VERSION_QUERY, JPS_VERSION_QUERY,
} from './adapters/sefaria'
import { TORAH_CANON, NEVIIM_KETUVIM_CANON } from './canon'
import type { ImportAdapter } from './types'

const ADAPTERS: Record<string, () => ImportAdapter> = {
  'web-torah': () => createWebBibleAdapter(TORAH_BOOKS, WEB_TORAH_SPEC),
  'web-nt': () => createWebBibleAdapter(NT_BOOKS, WEB_NT_SPEC),
  'web-hebrew-bible': () => createWebBibleAdapter(HEBREW_BIBLE_BOOKS, WEB_HEBREW_BIBLE_SPEC),
  'web-nt-rest': () => createWebBibleAdapter(REST_OF_NT_BOOKS, WEB_NT_SPEC),
  'quran-arabic': () => createQuranAdapter(QURAN_ARABIC_SPEC, 'quran-uthmani'),
  'hebrew-torah': () => createSefariaAdapter(TORAH_CANON, HEBREW_TORAH_SPEC, HEBREW_VERSION_QUERY),
  'hebrew-tanakh': () => createSefariaAdapter(NEVIIM_KETUVIM_CANON, HEBREW_TANAKH_SPEC, HEBREW_VERSION_QUERY),
  // Both refuse to run while "JPS 1917" is on REMOVED_TRANSLATION_NAMES.
  'jps-torah': () => createSefariaAdapter(TORAH_CANON, JPS_TORAH_SPEC, JPS_VERSION_QUERY),
  'jps-tanakh': () => createSefariaAdapter(NEVIIM_KETUVIM_CANON, JPS_TANAKH_SPEC, JPS_VERSION_QUERY),
}

function parseArgs(argv: string[]) {
  const name = argv[2]
  const booksFlag = argv.indexOf('--books')
  return {
    name,
    limitBooks: booksFlag > -1 ? Number(argv[booksFlag + 1]) : undefined,
    dryRun: argv.includes('--dry-run'),
  }
}

async function main() {
  const { name, limitBooks, dryRun } = parseArgs(process.argv)

  if (!name || !ADAPTERS[name]) {
    console.error(`Usage: tsx scripts/import/index.ts <${Object.keys(ADAPTERS).join('|')}> [--books N] [--dry-run]`)
    process.exit(1)
  }

  const stats = await runImport(ADAPTERS[name](), { limitBooks, dryRun })
  reportStats(stats)

  // A run that fetched nothing is a failure worth a non-zero exit, so CI or a
  // scheduled job notices rather than reporting success on an empty import.
  if (stats.fetched === 0) {
    console.error('\n  Nothing was fetched — treating as a failure.')
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
