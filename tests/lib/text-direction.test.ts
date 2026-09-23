import { describe, it, expect } from 'vitest'
import { detectScript, directionOf, langOf, textAttributes } from '@/lib/text-direction'

// Real strings from the seeded corpus, not invented samples.
const HEBREW = 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ'
const ARABIC = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
const GREEK = 'Ἐν ἀρχῇ ἦν ὁ λόγος'
const ENGLISH = 'In the beginning God created the heavens and the earth'

describe('detectScript', () => {
  it.each([
    ['Hebrew', HEBREW, 'hebrew'],
    ['Arabic', ARABIC, 'arabic'],
    ['Greek', GREEK, 'greek'],
    ['English', ENGLISH, 'latin'],
  ])('identifies %s', (_label, text, expected) => {
    expect(detectScript(text)).toBe(expected)
  })

  it('treats an English note that quotes one Hebrew word as English', () => {
    // Counting rather than presence-testing is what makes this work: a reader
    // note citing a term must still lay out left-to-right.
    const note = `The word ${'בְּרֵאשִׁית'} opens the account and is usually rendered "in the beginning".`
    expect(detectScript(note)).toBe('latin')
    expect(directionOf(note)).toBe('ltr')
  })

  it('treats Hebrew with an embedded reference as Hebrew', () => {
    expect(detectScript(`${HEBREW} (Genesis 1:1)`)).toBe('hebrew')
  })

  it('falls back to latin for text with no letters at all', () => {
    expect(detectScript('1:1 — 3:15')).toBe('latin')
    expect(detectScript('')).toBe('latin')
  })
})

describe('directionOf', () => {
  it.each([
    [HEBREW, 'rtl'],
    [ARABIC, 'rtl'],
    [GREEK, 'ltr'],
    [ENGLISH, 'ltr'],
  ])('resolves direction', (text, expected) => {
    expect(directionOf(text)).toBe(expected)
  })
})

describe('langOf', () => {
  it.each([
    [HEBREW, 'he'],
    [ARABIC, 'ar'],
    [GREEK, 'el'],
    [ENGLISH, 'en'],
  ])('emits a BCP-47 tag so assistive tech switches voice', (text, expected) => {
    expect(langOf(text)).toBe(expected)
  })
})

describe('textAttributes', () => {
  it('marks Hebrew right-to-left and raises its size', () => {
    const attrs = textAttributes(HEBREW)
    expect(attrs.dir).toBe('rtl')
    expect(attrs.lang).toBe('he')
    expect(attrs.className).toContain('text-[1.15em]')
  })

  it('leaves English unstyled and left-to-right', () => {
    const attrs = textAttributes(ENGLISH)
    expect(attrs).toEqual({ dir: 'ltr', lang: 'en', className: '' })
  })

  it('never returns rtl for Latin text', () => {
    for (const sample of [ENGLISH, GREEK, 'Genesis 1:1', '']) {
      expect(textAttributes(sample).dir).toBe('ltr')
    }
  })
})
