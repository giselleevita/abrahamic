/**
 * Sefaria adapter — Hebrew Tanakh and JPS 1917.
 *
 * Two imports matter here, and both are confirmed Public Domain by Sefaria's
 * own API rather than by assumption:
 *
 *  - "Tanach with Nikkud" is the Hebrew source text. The platform's stated
 *    policy is that original-language scripture is shown, and until now that
 *    was 25 Hebrew verses against 5,852 in the Torah alone — while the Quran
 *    had its complete Arabic. This closes that gap.
 *
 *  - JPS 1917 is a *Jewish* translation of the Tanakh. The Hebrew Bible's
 *    English is currently the World English Bible, a Christian translation, so
 *    the Jewish scriptures were being presented through a Christian rendering.
 *    On a platform whose whole premise is letting each tradition speak in its
 *    own terms, that is a real editorial problem, not a cosmetic one.
 *
 * Sefaria returns a whole chapter per request as an array indexed by verse,
 * which is simpler than the verse-level shapes the other adapters handle.
 */
import type { ImportAdapter, ImportedVerse, TranslationSpec } from '../types'
import { TORAH_CANON, NEVIIM_KETUVIM_CANON, type CanonBook } from '../canon'

const API = 'https://www.sefaria.org/api/v3/texts'

const REQUEST_DELAY_MS = 300
const MAX_ATTEMPTS = 4

interface ApiVersion {
  versionTitle?: string
  license?: string
  text?: unknown
}

interface ApiResponse {
  versions?: ApiVersion[]
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Sefaria returns chapter text as an array of strings, but a verse can itself
 * be an array when the source splits it. Flattening keeps one string per verse.
 */
function flattenVerse(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(flattenVerse).join(' ')
  return ''
}

/**
 * Sefaria embeds editorial markup in the text — footnote spans, small-caps
 * markers for the Divine Name, and line breaks. Stripping tags leaves the
 * scripture; the surrounding text is kept intact.
 */
function stripMarkup(text: string): string {
  return text
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/g, '')
    .replace(/<i\s+class="footnote"[^>]*>[\s\S]*?<\/i>/g, '')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchChapter(
  book: string,
  chapter: number,
  versionQuery: string,
): Promise<{ verses: string[]; license?: string }> {
  const ref = encodeURIComponent(`${book} ${chapter}`)
  const url = `${API}/${ref}?version=${versionQuery}`

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const res = await fetch(url, { headers: { accept: 'application/json' } })

    if (res.status === 429 || res.status >= 500) {
      if (attempt === MAX_ATTEMPTS) {
        throw new Error(`${book} ${chapter}: HTTP ${res.status} after ${MAX_ATTEMPTS} attempts`)
      }
      const header = res.headers.get('retry-after')
      const retryAfter = header === null ? Number.NaN : Number(header)
      const wait = Number.isFinite(retryAfter) && retryAfter >= 0
        ? retryAfter * 1000
        : REQUEST_DELAY_MS * 2 ** attempt
      console.warn(`  … ${book} ${chapter}: HTTP ${res.status}, waiting ${Math.round(wait / 1000)}s`)
      await sleep(wait)
      continue
    }

    if (!res.ok) throw new Error(`${book} ${chapter}: HTTP ${res.status}`)

    const data = (await res.json()) as ApiResponse
    const version = data.versions?.[0]
    if (!version?.text) throw new Error(`${book} ${chapter}: no text in response`)

    const raw = Array.isArray(version.text) ? version.text : []
    return {
      verses: raw.map((v) => stripMarkup(flattenVerse(v))),
      license: version.license,
    }
  }

  return { verses: [] }
}

export function createSefariaAdapter(
  books: CanonBook[],
  spec: TranslationSpec,
  versionQuery: string,
): ImportAdapter {
  return {
    spec,
    async *fetchVerses({ limitBooks }: { limitBooks?: number } = {}) {
      const selected = limitBooks ? books.slice(0, limitBooks) : books
      let licenceChecked = false

      for (const book of selected) {
        for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
          try {
            const { verses, license } = await fetchChapter(book.book, chapter, versionQuery)

            // Verify the licence the service actually reports on the first
            // successful response, rather than trusting the spec. If upstream
            // ever re-licenses an edition, the import stops instead of quietly
            // ingesting text under terms the policy does not permit.
            if (!licenceChecked && license) {
              licenceChecked = true
              const normalised = license.toLowerCase().replace(/[^a-z]/g, '')
              if (normalised !== 'publicdomain') {
                throw new Error(
                  `Refusing to import: upstream reports licence "${license}" for ` +
                    `"${spec.name}", but this import is configured as ${spec.licenseCode}.`,
                )
              }
              console.log(`  upstream licence confirmed: ${license}`)
            }

            if (verses.length === 0) break

            yield verses.flatMap<ImportedVerse>((text, i) =>
              text
                ? [{
                    book: book.book,
                    bookNumber: book.bookNumber,
                    chapter,
                    verse: i + 1,
                    text,
                  }]
                : [],
            )
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            // A licence mismatch is fatal; a fetch failure is a gap the next
            // run repairs.
            if (message.startsWith('Refusing to import')) throw error
            console.warn(`  ! ${message}`)
          }

          await sleep(REQUEST_DELAY_MS)
        }
      }
    },
  }
}

/** Hebrew source text for the Torah. Matches the seeded translation name. */
export const HEBREW_TORAH_SPEC: TranslationSpec = {
  name: 'Hebrew (MT)',
  label: 'ORIGINAL',
  sourceKey: 'TORAH',
  licenseCode: 'PD',
  sourceUrl: 'https://www.sefaria.org/texts/Tanakh',
  attribution: 'Tanach with Nikkud, via Sefaria (public domain).',
}

export const HEBREW_TANAKH_SPEC: TranslationSpec = {
  ...HEBREW_TORAH_SPEC,
  sourceKey: 'HEBREW_BIBLE',
}

/**
 * A Jewish English translation, so the Tanakh is not presented solely through
 * a Christian rendering.
 */
export const JPS_TORAH_SPEC: TranslationSpec = {
  name: 'JPS 1917',
  label: 'CLASSIC',
  sourceKey: 'TORAH',
  licenseCode: 'PD',
  sourceUrl: 'https://www.sefaria.org/texts/Tanakh',
  attribution: 'The Holy Scriptures: A New Translation (JPS 1917), via Sefaria (public domain).',
}

export const JPS_TANAKH_SPEC: TranslationSpec = {
  ...JPS_TORAH_SPEC,
  sourceKey: 'HEBREW_BIBLE',
}

export const HEBREW_VERSION_QUERY = 'hebrew|Tanach with Nikkud'
export const JPS_VERSION_QUERY =
  'english|The Holy Scriptures: A New Translation (JPS 1917)'

export { TORAH_CANON, NEVIIM_KETUVIM_CANON }
