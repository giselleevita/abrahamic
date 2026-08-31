import { describe, expect, it } from 'vitest'
import {
  REMOVED_TRANSLATION_NAMES,
  buildPublicDemoTranslations,
  filterPublicDemoTranslations,
  isPublicDemoTranslation,
  readerNoteForVerse,
} from './public-demo-policy'

describe('public demo translation policy', () => {
  it('never treats a licensed translation name as allowed on the public demo', () => {
    for (const name of REMOVED_TRANSLATION_NAMES) {
      expect(isPublicDemoTranslation(name)).toBe(false)
    }
  })

  it('allows only the original-language and reader-note translations', () => {
    expect(isPublicDemoTranslation('Hebrew (MT)')).toBe(true)
    expect(isPublicDemoTranslation('Arabic')).toBe(true)
    expect(isPublicDemoTranslation('Reader note (original)')).toBe(true)
  })

  it('filterPublicDemoTranslations strips every licensed translation from a mixed list', () => {
    const mixed = [
      { name: 'Hebrew (MT)' },
      { name: 'KJV' },
      { name: 'Sahih International' },
      { name: 'Reader note (original)' },
      { name: 'JPS 1985' },
      { name: 'Arabic' },
    ]

    const result = filterPublicDemoTranslations(mixed)

    expect(result.map((t) => t.name).sort()).toEqual(
      ['Arabic', 'Hebrew (MT)', 'Reader note (original)'].sort(),
    )
    for (const removed of REMOVED_TRANSLATION_NAMES) {
      expect(result.some((t) => t.name === removed)).toBe(false)
    }
  })

  it('buildPublicDemoTranslations produces only originals + a reader note, never a licensed translation', () => {
    const verse = { sourceKey: 'QURAN', book: 'Al-Fatiha', chapter: 1, verse: 1 }
    const seedTranslations = [
      { label: 'ORIGINAL' as const, name: 'Arabic', text: 'بسم الله' },
      { label: 'CLASSIC' as const, name: 'Yusuf Ali', text: 'In the name of Allah...' },
      { label: 'MODERN' as const, name: 'Sahih International', text: 'In the name of Allah...' },
    ]

    const result = buildPublicDemoTranslations(verse, seedTranslations)

    expect(result.every((t) => isPublicDemoTranslation(t.name))).toBe(true)
    expect(result.some((t) => t.name === 'Yusuf Ali')).toBe(false)
    expect(result.some((t) => t.name === 'Sahih International')).toBe(false)
    expect(result.some((t) => t.name === 'Reader note (original)')).toBe(true)
    expect(result.filter((t) => t.isDefault)).toHaveLength(1)
  })

  it('readerNoteForVerse never quotes a licensed translation string, only project-authored text', () => {
    const note = readerNoteForVerse({
      sourceKey: 'NEW_TESTAMENT',
      book: 'John',
      chapter: 3,
      verse: 16,
    })

    expect(note).toContain('John 3:16')
    expect(note.toLowerCase()).not.toContain('kjv')
    expect(note.toLowerCase()).not.toContain('esv')
  })
})
