import { describe, expect, it } from 'vitest'
import { MAX_RANGE, parseReference, versesIn } from './verse-ref'

describe('parseReference', () => {
  it('parses a single verse', () => {
    expect(parseReference('Genesis 12:1')).toEqual({ book: 'Genesis', chapter: 12, from: 1, to: 1 })
  })
  it('parses a range with a hyphen or en dash', () => {
    expect(parseReference('Genesis 12:1-3')).toMatchObject({ from: 1, to: 3 })
    expect(parseReference('Genesis 12:1–3')).toMatchObject({ from: 1, to: 3 })
  })
  it('handles numbered and hyphenated book names', () => {
    expect(parseReference('1 Corinthians 13:4')).toMatchObject({ book: '1 Corinthians', chapter: 13 })
    expect(parseReference('Al-Baqarah 2:255')).toMatchObject({ book: 'Al-Baqarah', chapter: 2, from: 255 })
  })
  it('allows a bare chapter:verse (for the Qur\'an)', () => {
    expect(parseReference('2:255')).toEqual({ book: undefined, chapter: 2, from: 255, to: 255 })
  })
  it('tolerates extra whitespace', () => {
    expect(parseReference('  Genesis   12:1  ')).toMatchObject({ book: 'Genesis', chapter: 12 })
  })
  it('rejects anything that is not a citation', () => {
    for (const bad of ['', 'Genesis', 'Genesis 12', '12:', 'Genesis 0:1', 'Genesis 12:0', 'Genesis 12:5-2', 'hello world', 'Genesis 12:1; DROP TABLE']) {
      expect(parseReference(bad), bad).toBeNull()
    }
  })
  it('rejects ranges longer than the limit, so one claim cannot cite a whole chapter', () => {
    expect(parseReference(`Genesis 1:1-${MAX_RANGE}`)).not.toBeNull()
    expect(parseReference(`Genesis 1:1-${MAX_RANGE + 1}`)).toBeNull()
  })
})

describe('versesIn', () => {
  it('lists every verse in the range', () => {
    expect(versesIn({ chapter: 1, from: 3, to: 5 })).toEqual([3, 4, 5])
  })
})
