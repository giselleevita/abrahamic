import { describe, it, expect } from 'vitest'
import { lineageIds } from '@/lib/family-lineage'
import { searchOptions } from '@/lib/search-options'
import { parseReference } from '@/lib/search-references'
import { GLOSSARY, termAnchor } from '@/lib/glossary'

describe('release exploration boundaries', () => {
  it('ignores unsupported search values and keeps independent supported values', () => {
    expect(searchOptions({ tradition: 'ISLAMIC', type: 'verses', source: 'QURAN', category: 'anything' })).toEqual({ tradition: 'ISLAMIC', type: 'verses', source: 'QURAN' })
    expect(searchOptions({ tradition: 'all', type: 'constructor', source: ['TORAH'] })).toEqual({})
  })
  it('parses supported references without changing their numbering', () => {
    expect(parseReference('Genesis 22:2')).toMatchObject({ book: 'Genesis', chapter: 22, verse: 2, quran: false })
    expect(parseReference('John 3:16')).toMatchObject({ book: 'John', chapter: 3, verse: 16 })
    expect(parseReference('Quran 2:255')).toMatchObject({ chapter: 2, verse: 255, quran: true })
    expect(parseReference('Genesis 0:2')).toBeNull()
    expect(parseReference('Genesis 22')).toBeNull()
  })
  it('terminates cyclic lineages, includes ancestors and descendants but excludes siblings', () => {
    const edges = [[1, 2], [2, 3], [3, 1], [1, 4]].map(([fromFigureId, toFigureId]) => ({ fromFigureId, toFigureId, relationType: 'PARENT' }))
    expect([...lineageIds(2, edges)].sort()).toEqual([1, 2, 3, 4])
    expect([...lineageIds(2, edges.filter((edge) => edge.fromFigureId !== 3))].sort()).toEqual([1, 2, 3])
    expect([...lineageIds(9, edges)]).toEqual([9])
    expect([...lineageIds(1, [{ fromFigureId: 1, toFigureId: 2, relationType: 'CHILD' }])]).toEqual([1])
  })
  it('retains unique stable glossary term anchors, including legacy punctuation', () => {
    const anchors = GLOSSARY.flatMap((section) => section.entries.map((entry) => termAnchor(entry.term)))
    expect(new Set(anchors).size).toBe(anchors.length)
    expect(termAnchor('Covenant (Brit)')).toBe('covenant-(brit)')
  })
})
