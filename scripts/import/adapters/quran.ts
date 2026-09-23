/**
 * Quran adapter — Uthmani Arabic.
 *
 * The Arabic text of the Quran is a seventh-century work and is not itself
 * under copyright. This fetches the Uthmani script edition, which is the
 * standard printed form.
 *
 * Unlike the biblical adapter this fetches a whole surah per request rather
 * than a chapter at a time: surahs are the natural unit, the API exposes them
 * directly, and 114 requests is far gentler on the service than 6,236.
 *
 * Surah *numbers* are the identity here, not names. The API's transliteration
 * differs from the one already in this database for most seeded surahs, so
 * names come from the pinned canon and the API's are ignored — see the note in
 * canon.ts.
 */
import type { ImportAdapter, ImportedVerse, TranslationSpec } from '../types'
import { QURAN_CANON } from '../canon'

const API = 'https://api.alquran.cloud/v1'

/** One request per surah, so a modest delay is enough. */
const REQUEST_DELAY_MS = 250
const MAX_ATTEMPTS = 5

interface ApiAyah {
  numberInSurah: number
  text: string
}

interface ApiResponse {
  code: number
  data?: { ayahs?: ApiAyah[] }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchSurah(number: number, edition: string): Promise<ApiAyah[]> {
  const url = `${API}/surah/${number}/${edition}`

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const res = await fetch(url, { headers: { accept: 'application/json' } })

    if (res.status === 429 || res.status >= 500) {
      if (attempt === MAX_ATTEMPTS) {
        throw new Error(`Surah ${number}: HTTP ${res.status} after ${MAX_ATTEMPTS} attempts`)
      }
      const header = res.headers.get('retry-after')
      const retryAfter = header === null ? Number.NaN : Number(header)
      const wait = Number.isFinite(retryAfter) && retryAfter >= 0
        ? retryAfter * 1000
        : REQUEST_DELAY_MS * 2 ** attempt
      console.warn(`  … surah ${number}: HTTP ${res.status}, waiting ${Math.round(wait / 1000)}s`)
      await sleep(wait)
      continue
    }

    if (!res.ok) throw new Error(`Surah ${number}: HTTP ${res.status}`)

    const data = (await res.json()) as ApiResponse
    if (data.code !== 200 || !data.data?.ayahs) {
      throw new Error(`Surah ${number}: unexpected response`)
    }
    return data.data.ayahs
  }

  return []
}

/**
 * The Uthmani text carries a leading byte-order mark on the first ayah of most
 * surahs, and the Basmala is prefixed to ayah 1 of every surah but At-Tawbah.
 * Stripping the BOM keeps the stored text clean; the Basmala is left alone
 * because removing it would be an editorial decision about the text itself.
 */
function cleanAyah(text: string): string {
  return text.replace(/^﻿/, '').replace(/\s+/g, ' ').trim()
}

export function createQuranAdapter(spec: TranslationSpec, edition: string): ImportAdapter {
  return {
    spec,
    async *fetchVerses({ limitBooks }: { limitBooks?: number } = {}) {
      const surahs = limitBooks ? QURAN_CANON.slice(0, limitBooks) : QURAN_CANON

      for (const surah of surahs) {
        try {
          const ayahs = await fetchSurah(surah.bookNumber, edition)

          yield ayahs.map<ImportedVerse>((a) => ({
            book: surah.book,
            bookNumber: surah.bookNumber,
            // Existing seeded verses store the surah number as `chapter`, so
            // the same convention is kept: chapter = surah, verse = ayah.
            chapter: surah.bookNumber,
            verse: a.numberInSurah,
            text: cleanAyah(a.text),
          }))
        } catch (error) {
          console.warn(`  ! ${error instanceof Error ? error.message : String(error)}`)
        }

        await sleep(REQUEST_DELAY_MS)
      }
    },
  }
}

export const QURAN_ARABIC_SPEC: TranslationSpec = {
  // Matches the name already used by seeded rows, so the import fills in
  // alongside them rather than creating a parallel translation.
  name: 'Arabic',
  label: 'ORIGINAL',
  sourceKey: 'QURAN',
  licenseCode: 'PD',
  sourceUrl: 'https://alquran.cloud/api',
  attribution: 'Quran, Uthmani script. Arabic source text (public domain).',
}
