import { describe, it, expect } from 'vitest'
import {
  REMOVED_TRANSLATION_NAMES,
  PUBLIC_DEMO_TRANSLATION_NAMES,
  isPublicDemoTranslation,
  filterPublicDemoTranslations,
  buildPublicDemoTranslations,
  readerNoteForVerse,
  type DemoTranslation,
} from '@/lib/public-demo-policy'

const VERSE = { sourceKey: 'TORAH', book: 'Genesis', chapter: 1, verse: 1 }

describe('isPublicDemoTranslation', () => {
  it.each(REMOVED_TRANSLATION_NAMES)('rejects the licensed translation %s', (name) => {
    expect(isPublicDemoTranslation(name)).toBe(false)
  })

  it.each([...PUBLIC_DEMO_TRANSLATION_NAMES])('allows %s', (name) => {
    expect(isPublicDemoTranslation(name)).toBe(true)
  })

  it('rejects unknown names by default rather than allowing them', () => {
    expect(isPublicDemoTranslation('NIV')).toBe(false)
    expect(isPublicDemoTranslation('')).toBe(false)
  })
})

describe('filterPublicDemoTranslations', () => {
  it('strips licensed translations from a mixed list', () => {
    const mixed = [
      { name: 'Hebrew (MT)' },
      { name: 'KJV' },
      { name: 'Reader note (original)' },
      { name: 'Yusuf Ali' },
    ]
    expect(filterPublicDemoTranslations(mixed).map((t) => t.name)).toEqual([
      'Hebrew (MT)',
      'Reader note (original)',
    ])
  })

  it('returns an empty array when every entry is licensed', () => {
    const all = REMOVED_TRANSLATION_NAMES.map((name) => ({ name }))
    expect(filterPublicDemoTranslations(all)).toEqual([])
  })
})

describe('buildPublicDemoTranslations', () => {
  const seeded: DemoTranslation[] = [
    { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'בְּרֵאשִׁית' },
    { label: 'CLASSIC', name: 'KJV', text: 'In the beginning' },
    { label: 'MODERN', name: 'JPS 1985', text: 'When God began' },
  ]

  it('never emits a name outside the allowlist', () => {
    for (const t of buildPublicDemoTranslations(VERSE, seeded)) {
      expect(PUBLIC_DEMO_TRANSLATION_NAMES.has(t.name)).toBe(true)
    }
  })

  it('marks exactly one translation as default', () => {
    const defaults = buildPublicDemoTranslations(VERSE, seeded).filter((t) => t.isDefault)
    expect(defaults).toHaveLength(1)
  })

  it('still yields a reader note when no original-language text was seeded', () => {
    const result = buildPublicDemoTranslations(VERSE, [])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Reader note (original)')
    expect(result[0].isDefault).toBe(true)
  })
})

describe('readerNoteForVerse', () => {
  it.each([
    ['QURAN', 'Islamic'],
    ['NEW_TESTAMENT', 'Christian'],
    ['TORAH', 'Jewish'],
    ['HEBREW_BIBLE', 'Jewish'],
  ])('maps %s to the %s tradition', (sourceKey, tradition) => {
    expect(readerNoteForVerse({ ...VERSE, sourceKey })).toContain(tradition)
  })

  it('includes the human-readable reference', () => {
    expect(readerNoteForVerse({ sourceKey: 'TORAH', book: 'Genesis', chapter: 3, verse: 15 }))
      .toContain('Genesis 3:15')
  })
})
