import { describe, it, expect } from 'vitest'
import {
  REMOVED_TRANSLATION_NAMES,
  PUBLIC_DEMO_TRANSLATION_NAMES,
  isPublicDemoTranslation,
  filterPublicDemoTranslations,
  buildPublicDemoTranslations,
  readerNoteForVerse,
  isPermittedTranslation,
  DEFAULT_PRIORITY,
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

describe('default translation priority', () => {
  const withOriginal: DemoTranslation[] = [
    { label: 'ORIGINAL', name: 'Hebrew (MT)', text: 'בְּרֵאשִׁית' },
  ]

  it('prefers original-language text over the reader note', () => {
    // The reader note is boilerplate about the demo. When real scripture exists
    // for a verse, that is what a reader should see.
    const result = buildPublicDemoTranslations(VERSE, withOriginal)
    expect(result.find((t) => t.isDefault)?.name).toBe('Hebrew (MT)')
  })

  it('prefers Arabic over the reader note for Quranic verses', () => {
    const result = buildPublicDemoTranslations(
      { ...VERSE, sourceKey: 'QURAN' },
      [{ label: 'ORIGINAL', name: 'Arabic', text: 'بِسْمِ اللَّهِ' }],
    )
    expect(result.find((t) => t.isDefault)?.name).toBe('Arabic')
  })

  it('still falls back to the reader note when no original text exists', () => {
    const result = buildPublicDemoTranslations(VERSE, [])
    expect(result.find((t) => t.isDefault)?.name).toBe('Reader note (original)')
  })
})

describe('licence-driven permission', () => {
  it('admits an unknown translation name when its licence is permitted', () => {
    // This is the point of the change: importing a new public-domain text is a
    // data decision, not a code change.
    expect(isPermittedTranslation({ name: 'Some New PD Text', licenseCode: 'PD' })).toBe(true)
    expect(isPermittedTranslation({ name: 'Reader note v2', licenseCode: 'PROJECT' })).toBe(true)
  })

  it('denies an unknown name carrying a licence that is not permitted', () => {
    expect(isPermittedTranslation({ name: 'Some Modern Text', licenseCode: 'CC-BY-NC' })).toBe(false)
    expect(isPermittedTranslation({ name: 'Some Modern Text', licenseCode: 'ALL-RIGHTS-RESERVED' })).toBe(false)
  })

  it('denies an explicitly removed name even if the row claims a good licence', () => {
    // A mislabelled row must not be able to talk its way past the policy.
    for (const name of REMOVED_TRANSLATION_NAMES) {
      expect(isPermittedTranslation({ name, licenseCode: 'PD' })).toBe(false)
      expect(isPermittedTranslation({ name, licenseCode: 'PROJECT' })).toBe(false)
    }
  })

  it('falls back to the name allowlist when no licence was selected', () => {
    // Queries that omit the licence column still work, and fail closed.
    expect(isPermittedTranslation({ name: 'Hebrew (MT)' })).toBe(true)
    expect(isPermittedTranslation({ name: 'World English Bible' })).toBe(true)
    expect(isPermittedTranslation({ name: 'Some New PD Text' })).toBe(false)
  })

  it('treats a null licence as absent rather than as permission', () => {
    expect(isPermittedTranslation({ name: 'Arabic', licenseCode: null })).toBe(true)
    expect(isPermittedTranslation({ name: 'Unknown Text', licenseCode: null })).toBe(false)
  })

  it('filters mixed rows by licence and by name together', () => {
    const rows = [
      { name: 'Hebrew (MT)' },
      { name: 'Newly Imported', licenseCode: 'PD' },
      { name: 'Paywalled Text', licenseCode: 'COMMERCIAL' },
      { name: 'KJV', licenseCode: 'PD' },
    ]
    expect(filterPublicDemoTranslations(rows).map((r) => r.name)).toEqual([
      'Hebrew (MT)',
      'Newly Imported',
    ])
  })
})

describe('default priority ordering', () => {
  it('ranks original language above English, and English above the placeholder', () => {
    // The reader note is boilerplate about the demo. Ranking it above real
    // scripture was a live bug once; this pins the ordering so it cannot
    // return when a new translation is added to the list.
    const order = [...DEFAULT_PRIORITY]
    expect(order.indexOf('Hebrew (MT)')).toBeLessThan(order.indexOf('World English Bible'))
    expect(order.indexOf('Arabic')).toBeLessThan(order.indexOf('World English Bible'))
    expect(order.indexOf('World English Bible')).toBeLessThan(
      order.indexOf('Reader note (original)'),
    )
  })

  it('puts the reader note last', () => {
    expect([...DEFAULT_PRIORITY].at(-1)).toBe('Reader note (original)')
  })

  it('every prioritised name is one the policy actually permits', () => {
    for (const name of DEFAULT_PRIORITY) {
      expect(isPermittedTranslation({ name }), `${name} is prioritised but denied`).toBe(true)
    }
  })
})
