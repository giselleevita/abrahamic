import { describe, expect, it } from 'vitest'
import { filterVerseTranslations, filterVersesWithTranslations } from './filter-public-translations'
import { REMOVED_TRANSLATION_NAMES } from './public-demo-policy'

const mixed = [
  { name: 'Hebrew (MT)', text: 'בראשית' },
  { name: 'JPS 1917', text: 'And He said: Take now thy son…' },
  { name: 'JPS 1985', text: 'And He said, "Take your son…"' },
  { name: 'Reader note (original)', text: 'Original reader note…' },
]

describe('filterVerseTranslations', () => {
  it('removes every licensed translation', () => {
    const kept = filterVerseTranslations(mixed).map((t) => t.name)
    expect(kept).toEqual(['Hebrew (MT)', 'Reader note (original)'])
    for (const removed of REMOVED_TRANSLATION_NAMES) {
      expect(kept).not.toContain(removed)
    }
  })

  it('returns empty when a verse only has licensed translations', () => {
    expect(filterVerseTranslations([{ name: 'KJV' }, { name: 'ESV' }])).toEqual([])
  })
})

describe('filterVersesWithTranslations', () => {
  it('filters translations on every verse without dropping the verses', () => {
    const verses = [
      { id: 1, translations: mixed },
      { id: 2, translations: [{ name: 'Sahih International', text: 'x' }] },
    ]
    const out = filterVersesWithTranslations(verses)
    expect(out).toHaveLength(2)
    expect(out[0].translations.map((t) => t.name)).toEqual(['Hebrew (MT)', 'Reader note (original)'])
    expect(out[1].translations).toEqual([])
  })
})
