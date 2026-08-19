/**
 * World English Bible adapter.
 *
 * WEB is chosen as the first import because its status is not in question: it
 * is explicitly dedicated to the public domain by its publisher, so ingest,
 * search, and the reader can all be built and proven while the harder licensing
 * calls (JPS 1917, KJV, Quran translations) are still being verified.
 *
 * Fetches a chapter at a time and is deliberately unhurried — this runs rarely,
 * against someone else's free service.
 */
import type { ImportAdapter, ImportedVerse, TranslationSpec } from '../types'
import {
  TORAH_CANON, GOSPEL_CANON, NEVIIM_KETUVIM_CANON, REST_OF_NT_CANON,
  type CanonBook,
} from '../canon'

const API = 'https://bible-api.com'

/** Politeness delay between chapter requests. */
const REQUEST_DELAY_MS = 350

interface ApiVerse {
  book_name: string
  chapter: number
  verse: number
  text: string
}

interface ApiResponse {
  verses?: ApiVerse[]
  error?: string
}

/**
 * Books to import, with their canonical order and chapter counts.
 *
 * Chapter counts are hardcoded rather than discovered because the API has no
 * index endpoint, and a wrong count either silently truncates a book or wastes
 * requests on 404s. These are the standard Protestant canon counts.
 */
interface BookSpec { name: string; number: number; chapters: number; singleChapterVerses?: number }

// Derived from the shared canon so the importer and the completeness check can
// never disagree about how many chapters a book has.
const toSpec = (b: CanonBook): BookSpec => ({
  name: b.book, number: b.bookNumber, chapters: b.chapters,
  singleChapterVerses: b.singleChapterVerses,
})

export const TORAH_BOOKS: BookSpec[] = TORAH_CANON.map(toSpec)
export const NT_BOOKS: BookSpec[] = GOSPEL_CANON.map(toSpec)
export const HEBREW_BIBLE_BOOKS: BookSpec[] = NEVIIM_KETUVIM_CANON.map(toSpec)
export const REST_OF_NT_BOOKS: BookSpec[] = REST_OF_NT_CANON.map(toSpec)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const MAX_ATTEMPTS = 5

/**
 * Fetch one chapter, backing off on rate limits.
 *
 * The service rate-limits harder than a fixed delay can absorb — an
 * unmitigated run loses roughly a third of its chapters to 429s. Exponential
 * backoff honouring `Retry-After` turns those into slow successes rather than
 * gaps that a later run has to notice and repair.
 */
/**
 * Build the reference for one chapter.
 *
 * For a single-chapter book the upstream service reads "Philemon 1" as verse 1,
 * not chapter 1 — so a plain chapter request silently returns one verse, and
 * the book passes a chapter-coverage check while holding 1 verse of 25. Those
 * books need an explicit, in-bounds verse range; an over-long range 404s rather
 * than clamping.
 */
function chapterReference(book: BookSpec, chapter: number): string {
  return book.singleChapterVerses
    ? `${book.name}+${chapter}:1-${book.singleChapterVerses}`
    : `${book.name}+${chapter}`
}

async function fetchChapter(reference: string, label: string): Promise<ApiVerse[]> {
  // Encode the book name (some contain spaces) but keep the reference
  // punctuation literal, matching the form verified against the service.
  const url =
    `${API}/${encodeURIComponent(reference).replace(/%2B/g, '+').replace(/%3A/g, ':')}` +
    '?translation=web'

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const res = await fetch(url, { headers: { accept: 'application/json' } })

    if (res.status === 429 || res.status >= 500) {
      if (attempt === MAX_ATTEMPTS) {
        throw new Error(`${label}: HTTP ${res.status} after ${MAX_ATTEMPTS} attempts`)
      }
      // A present `Retry-After` is authoritative, including an explicit 0.
      // Absent, `headers.get` returns null, and Number(null) is 0 — which would
      // silently disable backoff, so the header's presence is checked first.
      const header = res.headers.get('retry-after')
      const retryAfter = header === null ? Number.NaN : Number(header)
      const wait = Number.isFinite(retryAfter) && retryAfter >= 0
        ? retryAfter * 1000
        : REQUEST_DELAY_MS * 2 ** attempt
      console.warn(`  … ${label}: HTTP ${res.status}, waiting ${Math.round(wait / 1000)}s`)
      await sleep(wait)
      continue
    }

    if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`)

    const data = (await res.json()) as ApiResponse
    if (data.error) throw new Error(`${label}: ${data.error}`)
    return data.verses ?? []
  }

  return []
}

export function createWebBibleAdapter(
  books: BookSpec[],
  spec: TranslationSpec,
): ImportAdapter {
  return {
    spec,
    async *fetchVerses({ limitBooks }: { limitBooks?: number } = {}) {
      const selected = limitBooks ? books.slice(0, limitBooks) : books

      for (const book of selected) {
        for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
          try {
            const verses = await fetchChapter(
              chapterReference(book, chapter),
              `${book.name} ${chapter}`,
            )
            if (verses.length === 0) break // past the end of the book

            yield verses.map<ImportedVerse>((v) => ({
              book: book.name,
              bookNumber: book.number,
              chapter: v.chapter,
              verse: v.verse,
              // The API returns text with trailing newlines and soft breaks.
              text: v.text.replace(/\s+/g, ' ').trim(),
            }))
          } catch (error) {
            // Yield nothing for this chapter; the runner records the gap and
            // the next run will fill it, because the import is idempotent.
            console.warn(`  ! ${error instanceof Error ? error.message : String(error)}`)
          }

          await sleep(REQUEST_DELAY_MS)
        }
      }
    },
  }
}

export const WEB_TORAH_SPEC: TranslationSpec = {
  name: 'World English Bible',
  label: 'MODERN',
  sourceKey: 'TORAH',
  licenseCode: 'PD',
  sourceUrl: 'https://ebible.org/find/show.php?id=eng-web',
  attribution: 'World English Bible (public domain)',
}

export const WEB_NT_SPEC: TranslationSpec = {
  ...WEB_TORAH_SPEC,
  sourceKey: 'NEW_TESTAMENT',
}

export const WEB_HEBREW_BIBLE_SPEC: TranslationSpec = {
  ...WEB_TORAH_SPEC,
  sourceKey: 'HEBREW_BIBLE',
}
