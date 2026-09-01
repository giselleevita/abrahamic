import { describe, expect, it } from 'vitest'
import { formatVerseRef, verseAnchorId, verseReaderHref } from './verse-links'

const ref = { book: 'Genesis', chapter: 22, verse: 2 }

describe('verseReaderHref', () => {
  it('builds a reader URL anchored to the verse', () => {
    expect(verseReaderHref('torah', ref)).toBe(
      '/sources/torah/read?book=Genesis&chapter=22#v-2',
    )
  })

  it('encodes books whose names contain spaces', () => {
    const href = verseReaderHref('hebrew-bible', { book: '1 Samuel', chapter: 2, verse: 5 })
    expect(href).toBe('/sources/hebrew-bible/read?book=1+Samuel&chapter=2#v-5')
    expect(href).not.toContain(' ')
  })

  it('anchors match the ids the reader renders', () => {
    expect(verseReaderHref('quran', ref)).toContain(`#${verseAnchorId(ref.verse)}`)
  })
})

describe('formatVerseRef', () => {
  it('formats a citation', () => {
    expect(formatVerseRef(ref)).toBe('Genesis 22:2')
  })
})
