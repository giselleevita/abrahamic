/**
 * A `loading.tsx` opens a Suspense boundary, which makes Next start streaming
 * the response before the page body has resolved. Once bytes are on the wire
 * the HTTP status is committed — so any `notFound()` further down renders the
 * not-found UI with a **200**, not a 404.
 *
 * That was live in this app: every dynamic route served "Page not found" with
 * 200, which tells a crawler the page exists and is worth indexing. Harmless at
 * 94 verses, an indexing problem at corpus scale.
 *
 * This test encodes the rule structurally rather than over HTTP, so it runs in
 * milliseconds and pins the exact regression: no streaming boundary may sit
 * above a page that can 404. Where a segment genuinely needs loading UI, put an
 * explicit <Suspense> *inside* the page, below the existence check.
 */
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const APP_DIR = join(process.cwd(), 'src', 'app')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const files = walk(APP_DIR)

const loadingFiles = files.filter((f) => f.endsWith(`${'/'}loading.tsx`))
const notFoundPages = files.filter(
  (f) => f.endsWith('page.tsx') && /\bnotFound\(\)/.test(readFileSync(f, 'utf8')),
)

describe('streaming boundaries vs notFound()', () => {
  it('finds the pages that can 404, so this test cannot silently pass on zero input', () => {
    // Guards against the suite quietly becoming vacuous if the glob breaks.
    expect(notFoundPages.length).toBeGreaterThan(5)
  })

  it.each(loadingFiles.map((f) => relative(process.cwd(), f)))(
    '%s does not sit above any page that calls notFound()',
    (loadingRel) => {
      const segment = join(process.cwd(), loadingRel).replace(/\/loading\.tsx$/, '')
      const shadowed = notFoundPages
        .filter((page) => page.startsWith(`${segment}/`))
        .map((page) => relative(process.cwd(), page))

      expect(
        shadowed,
        `This loading.tsx opens a Suspense boundary above ${shadowed.length} page(s) that ` +
          `call notFound(). Those pages will serve their 404 body with an HTTP 200. ` +
          `Either remove this loading.tsx, or move its UI into a <Suspense> inside each ` +
          `page below the existence check.`,
      ).toEqual([])
    },
  )
})

/**
 * Versification.
 *
 * A verse row carries the scheme its numbering follows. Masoretic-numbered
 * Hebrew and Christian-numbered English are the same passage counted
 * differently — Psalm 51:1 in Hebrew is the superscription, Psalm 51:1 in
 * English is Hebrew verse 3 — so any query that renders verses in a list must
 * pin a scheme. Mixing them puts two "verse 1"s in one list and implies a
 * correspondence that does not exist.
 */
describe('versification is pinned where verses are listed', () => {
  const readerPage = join(APP_DIR, 'sources', '[sourceKey]', 'read', 'page.tsx')

  it('the reader queries an explicit scheme', () => {
    const src = readFileSync(readerPage, 'utf8')
    const queries = src.match(/prisma\.verse\.(findMany|groupBy)\(/g) ?? []
    expect(queries.length).toBeGreaterThan(0)
    // Every verse query in the reader names a scheme.
    expect(src.match(/versification:\s*'(CHRISTIAN|MASORETIC)'/g)?.length ?? 0)
      .toBeGreaterThanOrEqual(queries.length)
  })

  it('separates the two schemes rather than interleaving them', () => {
    const src = readFileSync(readerPage, 'utf8')
    expect(src).toMatch(/versification:\s*'CHRISTIAN'/)
    expect(src).toMatch(/versification:\s*'MASORETIC'/)
  })
})
