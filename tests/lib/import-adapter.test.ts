/**
 * The World English Bible adapter.
 *
 * Network behaviour is the interesting part: the upstream service rate-limits
 * hard enough that an unmitigated run loses roughly a third of its chapters to
 * 429s, which showed up as an apparently non-idempotent import — the second run
 * "created" 91 verses that were really the gaps left by the first.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createWebBibleAdapter,
  TORAH_BOOKS,
  WEB_TORAH_SPEC,
} from '../../scripts/import/adapters/web-bible'

const originalFetch = globalThis.fetch

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (k: string) => headers[k.toLowerCase()] ?? null },
    json: async () => body,
  } as unknown as Response
}

const chapter = (verses: number) => ({
  verses: Array.from({ length: verses }, (_, i) => ({
    book_name: 'Genesis',
    chapter: 1,
    verse: i + 1,
    // Upstream returns trailing newlines and soft breaks.
    text: `Verse ${i + 1} text.\n`,
  })),
})

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }))
afterEach(() => {
  vi.useRealTimers()
  globalThis.fetch = originalFetch
  vi.restoreAllMocks()
})

/** Reads one book's worth of batches from the adapter. */
async function collect(adapter: ReturnType<typeof createWebBibleAdapter>) {
  const out = []
  for await (const batch of adapter.fetchVerses({ limitBooks: 1 })) out.push(...batch)
  return out
}

describe('WEB adapter — provenance', () => {
  it('records a public-domain licence, source, and attribution', () => {
    expect(WEB_TORAH_SPEC.licenseCode).toBe('PD')
    expect(WEB_TORAH_SPEC.sourceUrl).toMatch(/^https:\/\//)
    expect(WEB_TORAH_SPEC.attribution).toMatch(/public domain/i)
  })

  it('only targets books it has canonical chapter counts for', () => {
    expect(TORAH_BOOKS).toHaveLength(5)
    expect(TORAH_BOOKS.map((b) => b.name)).toEqual([
      'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    ])
    // Genesis has 50 chapters; a wrong count silently truncates a book.
    expect(TORAH_BOOKS[0].chapters).toBe(50)
  })
})

describe('WEB adapter — fetching', () => {
  it('normalises whitespace out of upstream text', async () => {
    globalThis.fetch = vi.fn(async () => jsonResponse(chapter(1))) as unknown as typeof fetch

    const verses = await collect(
      createWebBibleAdapter([{ name: 'Genesis', number: 1, chapters: 1 }], WEB_TORAH_SPEC),
    )

    expect(verses[0].text).toBe('Verse 1 text.')
    expect(verses[0].text).not.toMatch(/\n/)
  })

  it('carries the canonical book number through, not the API’s', async () => {
    globalThis.fetch = vi.fn(async () => jsonResponse(chapter(2))) as unknown as typeof fetch

    const verses = await collect(
      createWebBibleAdapter([{ name: 'Genesis', number: 1, chapters: 1 }], WEB_TORAH_SPEC),
    )

    expect(verses.every((v) => v.bookNumber === 1)).toBe(true)
  })

  it('retries a 429 rather than dropping the chapter', async () => {
    let calls = 0
    globalThis.fetch = vi.fn(async () => {
      calls += 1
      return calls === 1 ? jsonResponse({}, 429, { 'retry-after': '0' }) : jsonResponse(chapter(3))
    }) as unknown as typeof fetch

    const verses = await collect(
      createWebBibleAdapter([{ name: 'Genesis', number: 1, chapters: 1 }], WEB_TORAH_SPEC),
    )

    expect(calls).toBe(2)
    expect(verses).toHaveLength(3)
  })

  it('gives up after repeated rate limits without throwing out the run', async () => {
    globalThis.fetch = vi.fn(async () =>
      jsonResponse({}, 429, { 'retry-after': '0' }),
    ) as unknown as typeof fetch
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const verses = await collect(
      createWebBibleAdapter([{ name: 'Genesis', number: 1, chapters: 1 }], WEB_TORAH_SPEC),
    )

    // The chapter is lost, but the generator completes so the rest of the book
    // still imports — and the next run repairs the gap.
    expect(verses).toEqual([])
    expect(warn).toHaveBeenCalled()
  })

  it('stops at the end of a book when a chapter comes back empty', async () => {
    let calls = 0
    globalThis.fetch = vi.fn(async () => {
      calls += 1
      return calls === 1 ? jsonResponse(chapter(2)) : jsonResponse({ verses: [] })
    }) as unknown as typeof fetch

    const verses = await collect(
      createWebBibleAdapter([{ name: 'Genesis', number: 1, chapters: 50 }], WEB_TORAH_SPEC),
    )

    expect(verses).toHaveLength(2)
    // Two requests, not fifty: the empty chapter ends the book.
    expect(calls).toBe(2)
  })
})

describe('single-chapter books', () => {
  it('requests an explicit verse range so the chapter is not read as a verse', async () => {
    // "Philemon 1" means *verse* 1 upstream, not chapter 1. Without a range the
    // book imports one verse of twenty-five and still passes a chapter-coverage
    // check, because its single chapter exists.
    const urls: string[] = []
    globalThis.fetch = vi.fn(async (url: string) => {
      urls.push(String(url))
      return jsonResponse(chapter(25))
    }) as unknown as typeof fetch

    await collect(
      createWebBibleAdapter(
        [{ name: 'Philemon', number: 57, chapters: 1, singleChapterVerses: 25 }],
        WEB_TORAH_SPEC,
      ),
    )

    expect(urls[0]).toContain('Philemon+1:1-25')
  })

  it('leaves multi-chapter books on a plain chapter reference', async () => {
    const urls: string[] = []
    globalThis.fetch = vi.fn(async (url: string) => {
      urls.push(String(url))
      return jsonResponse(chapter(31))
    }) as unknown as typeof fetch

    await collect(
      createWebBibleAdapter([{ name: 'Genesis', number: 1, chapters: 1 }], WEB_TORAH_SPEC),
    )

    expect(urls[0]).toContain('Genesis+1')
    expect(urls[0]).not.toContain(':1-')
  })

  it('every single-chapter book in the canon declares its verse count', async () => {
    const { TORAH_CANON, GOSPEL_CANON, NEVIIM_KETUVIM_CANON, REST_OF_NT_CANON } =
      await import('../../scripts/import/canon')

    const oneChapterBooks = [
      ...TORAH_CANON, ...GOSPEL_CANON, ...NEVIIM_KETUVIM_CANON, ...REST_OF_NT_CANON,
    ].filter((b) => b.chapters === 1)

    expect(oneChapterBooks.length).toBeGreaterThan(0)
    for (const b of oneChapterBooks) {
      expect(b.singleChapterVerses, `${b.book} would import a single verse`).toBeGreaterThan(1)
    }
  })
})

describe('import policy guard', () => {
  it('refuses to import a translation the content policy would hide', async () => {
    const { runImport } = await import('../../scripts/import/runner')
    const { JPS_TORAH_SPEC } = await import('../../scripts/import/adapters/sefaria')

    // JPS 1917 is on REMOVED_TRANSLATION_NAMES. Importing it would write rows
    // that every page then filters out — an hour of work producing nothing
    // visible, which reads as a broken importer rather than a policy decision.
    await expect(
      runImport(
        { spec: JPS_TORAH_SPEC, async *fetchVerses() {} },
        { dryRun: true },
      ),
    ).rejects.toThrow(/REMOVED_TRANSLATION_NAMES/)
  })

  it('refuses a licence that is not permitted', async () => {
    const { runImport } = await import('../../scripts/import/runner')

    await expect(
      runImport(
        {
          spec: {
            name: 'Some Commercial Text', label: 'MODERN', sourceKey: 'TORAH',
            licenseCode: 'ALL-RIGHTS-RESERVED',
            sourceUrl: 'https://example.com', attribution: 'x',
          },
          async *fetchVerses() {},
        },
        { dryRun: true },
      ),
    ).rejects.toThrow(/PERMITTED_LICENSE_CODES/)
  })

  it('allows a permitted licence through the guard', async () => {
    const { runImport } = await import('../../scripts/import/runner')
    const { HEBREW_TORAH_SPEC } = await import('../../scripts/import/adapters/sefaria')

    // Reaches the source lookup rather than being rejected by policy.
    await expect(
      runImport({ spec: HEBREW_TORAH_SPEC, async *fetchVerses() {} }, { dryRun: true }),
    ).rejects.not.toThrow(/REMOVED_TRANSLATION_NAMES|PERMITTED_LICENSE_CODES/)
  })
})
