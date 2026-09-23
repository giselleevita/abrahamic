/**
 * Search runs raw SQL, which is the one path that bypasses the Prisma client
 * extension enforcing the public-demo translation policy. The extension hooks
 * model operations and looks for a nested `translations` array; a `$queryRaw`
 * result is a flat row with a `translationName` column, so nothing strips it.
 *
 * That makes search the single hole in an otherwise airtight guard, and these
 * tests exist to keep it closed.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const rawResults: unknown[][] = []
let callIndex = 0

vi.mock('@/lib/prisma', () => ({
  default: {
    // The module issues its six queries in a fixed order; hand each the next
    // canned result set.
    $queryRaw: () => Promise.resolve(rawResults[callIndex++] ?? []),
  },
}))

const { search } = await import('@/lib/search')

function queueResults(sets: unknown[][]) {
  rawResults.length = 0
  rawResults.push(...sets)
  callIndex = 0
}

const verse = (translationName: string) => ({
  id: 1, referenceKey: 'GEN.1.1', book: 'Genesis', chapter: 1, verse: 1,
  sourceKey: 'TORAH', sourceTitle: 'Torah', translationName,
  text: `text from ${translationName}`, rank: 0.5,
})

beforeEach(() => {
  rawResults.length = 0
  callIndex = 0
})

describe('search — translation policy', () => {
  it('drops verses whose translation is licensed, even though raw SQL returned them', async () => {
    queueResults([
      [verse('Hebrew (MT)'), verse('KJV'), verse('Reader note (original)'), verse('ESV')],
      [], [], [], [], [],
    ])

    const results = await search('covenant')

    expect(results.verses.map((v) => v.translationName)).toEqual([
      'Hebrew (MT)',
      'Reader note (original)',
    ])
  })

  it('never lets licensed text reach the returned payload', async () => {
    queueResults([[verse('KJV'), verse('Sahih International')], [], [], [], [], []])

    const results = await search('covenant')

    expect(results.verses).toEqual([])
    expect(JSON.stringify(results)).not.toMatch(/KJV|Sahih/)
  })

  it('counts only the verses that survive the filter', async () => {
    queueResults([[verse('Arabic'), verse('KJV')], [], [], [], [], []])

    const results = await search('covenant')

    expect(results.verses).toHaveLength(1)
    expect(results.total).toBe(1)
  })
})

describe('search — result shaping', () => {
  it('returns an empty result for a query below the minimum length', async () => {
    queueResults([[verse('Arabic')], [], [], [], [], []])

    const results = await search('a')

    expect(results.total).toBe(0)
    // The short query must short-circuit before touching the database at all.
    expect(callIndex).toBe(0)
  })

  it('discards weak trigram name matches', async () => {
    queueResults([
      [],
      [],
      // A near match and a coincidental one.
      [
        { slug: 'moses', canonicalName: 'Moses', similarity: 0.8 },
        { slug: 'noah', canonicalName: 'Noah', similarity: 0.05 },
      ],
      [{ slug: 'mercy', name: 'Mercy', similarity: 0.9 }],
      [],
      [],
    ])

    const results = await search('Mosès')

    expect(results.figures.map((f) => f.slug)).toEqual(['moses'])
    expect(results.themes.map((t) => t.slug)).toEqual(['mercy'])
  })

  it('sums the total across every result kind', async () => {
    queueResults([
      [verse('Arabic')],
      [{ id: 1, statement: 's', sourceKey: 'QURAN', sourceTitle: 'Quran', rank: 0.4 }],
      [{ slug: 'moses', canonicalName: 'Moses', similarity: 0.9 }],
      [{ slug: 'mercy', name: 'Mercy', similarity: 0.9 }],
      [{ slug: 'monotheism', name: 'Monotheism', category: 'THEOLOGY', summary: null, rank: 0.3 }],
      [{ slug: 'exodus', name: 'The Exodus', era: 'EXODUS', summary: null, rank: 0.2 }],
    ])

    const results = await search('covenant')

    expect(results.total).toBe(6)
  })
})
