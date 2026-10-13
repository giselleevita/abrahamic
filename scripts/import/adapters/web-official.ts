/** Official eBible VPL archive adapter for the public-domain World English Bible. */
import { execFileSync } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { ImportAdapter, ImportedVerse, TranslationSpec } from '../types'
import { TORAH_CANON, NEVIIM_KETUVIM_CANON, GOSPEL_CANON, REST_OF_NT_CANON, type CanonBook } from '../canon'

const ARCHIVE_URL = 'https://ebible.org/Scriptures/engwebp_vpl.zip'
const ARCHIVE_MEMBER = 'engwebp_vpl.txt'
const BOOK_CODES = 'GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SOL ISA JER LAM EZE DAN HOS JOE AMO OBA JON MIC NAH HAB ZEP HAG ZEC MAL MAT MAR LUK JOH ACT ROM 1CO 2CO GAL EPH PHI COL 1TH 2TH 1TI 2TI TIT PHM HEB JAM 1PE 2PE 1JO 2JO 3JO JUD REV'.split(' ')
const ALL_BOOKS = [...TORAH_CANON, ...NEVIIM_KETUVIM_CANON, ...GOSPEL_CANON, ...REST_OF_NT_CANON]
const BOOK_BY_CODE = new Map(BOOK_CODES.map((code, index) => [code, ALL_BOOKS[index]]))

if (BOOK_CODES.length !== ALL_BOOKS.length) throw new Error('Official WEB book map is incomplete')

export function parseOfficialWebVerse(line: string): ImportedVerse | null {
  const match = /^([A-Z0-9]{3}) (\d+):(\d+) (.+)$/.exec(line)
  if (!match) return null
  const book = BOOK_BY_CODE.get(match[1])
  if (!book) return null
  const chapter = Number(match[2])
  const verse = Number(match[3])
  if (chapter < 1 || chapter > book.chapters || verse < 1) return null
  return { book: book.book, bookNumber: book.bookNumber, chapter, verse, text: match[4].trim() }
}

async function readOfficialArchive(): Promise<string> {
  const response = await fetch(ARCHIVE_URL, { signal: AbortSignal.timeout(60_000) })
  if (!response.ok) throw new Error(`Official WEB download failed: HTTP ${response.status}`)
  const directory = await mkdtemp(join(tmpdir(), 'abrahamic-web-'))
  try {
    const archive = join(directory, 'web.zip')
    await writeFile(archive, Buffer.from(await response.arrayBuffer()))
    return execFileSync('unzip', ['-p', archive, ARCHIVE_MEMBER], { encoding: 'utf8', maxBuffer: 12 * 1024 * 1024 })
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

export const OFFICIAL_WEB_SPEC: TranslationSpec = {
  name: 'World English Bible', label: 'MODERN', sourceKey: 'TORAH', licenseCode: 'PD',
  sourceUrl: 'https://ebible.org/find/show.php?id=engwebp',
  attribution: 'World English Bible, eBible.org (public domain).',
}

export function createOfficialWebAdapter(books: CanonBook[], spec: TranslationSpec): ImportAdapter {
  return {
    spec,
    async *fetchVerses({ limitBooks }: { limitBooks?: number } = {}) {
      const selected = new Set((limitBooks ? books.slice(0, limitBooks) : books).map((book) => book.book))
      const archive = await readOfficialArchive()
      let chapterKey = ''
      let batch: ImportedVerse[] = []
      for (const line of archive.split(/\r?\n/)) {
        const verse = parseOfficialWebVerse(line)
        if (!verse || !selected.has(verse.book)) continue
        const key = `${verse.book}:${verse.chapter}`
        if (key !== chapterKey && batch.length) { yield batch; batch = [] }
        chapterKey = key
        batch.push(verse)
      }
      if (batch.length) yield batch
    },
  }
}
