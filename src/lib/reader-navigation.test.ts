import { describe, expect, it } from 'vitest'
import { buildBookOptions } from './reader-navigation'

describe('buildBookOptions', () => {
  it('deduplicates repeated book/chapter metadata and sorts chapters', () => {
    expect(buildBookOptions([
      { book: 'Romans', bookNumber: 45, chapter: 3 },
      { book: 'Romans', bookNumber: 45, chapter: 1 },
      { book: ' Romans ', bookNumber: 45, chapter: 3 },
      { book: 'Genesis', bookNumber: 1, chapter: 2 },
      { book: 'Genesis', bookNumber: 1, chapter: 1 },
    ])).toEqual([
      { book: 'Genesis', bookNumber: 1, chapters: [1, 2] },
      { book: 'Romans', bookNumber: 45, chapters: [1, 3] },
    ])
  })
})
