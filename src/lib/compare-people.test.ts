import { describe, expect, it } from 'vitest'
import { summarisePair, type CPFigure } from './compare-people'

const moses: CPFigure = { id: 1, slug: 'moses', name: 'Moses', aliases: [{ tradition: 'ISLAMIC', name: 'Musa' }] }
const aaron: CPFigure = { id: 2, slug: 'aaron', name: 'Aaron', aliases: [{ tradition: 'ISLAMIC', name: 'Harun' }] }
const events = [
  { slug: 'burning-bush', name: 'The Burning Bush', figureIds: [1] },
  { slug: 'golden-calf', name: 'The Golden Calf', figureIds: [1, 2] },
]
const claims = [
  { figureIds: [1, 2], comparisonIds: [10], themes: ['Law', 'Prophecy'] },
  { figureIds: [1], comparisonIds: [11], themes: ['Law', 'Miracles'] },
  { figureIds: [2], comparisonIds: [], themes: ['Priesthood'] },
]
const comparisons = [{ id: 10, title: 'The Law' }, { id: 11, title: 'Miracles' }]

describe('summarisePair', () => {
  const s = summarisePair(moses, aaron, events, claims, comparisons)

  it('lists only events and comparisons that both people appear in', () => {
    expect(s.sharedEvents.map((e) => e.slug)).toEqual(['golden-calf'])
    expect(s.sharedComparisons.map((c) => c.id)).toEqual([10])
  })

  it('splits themes into shared and one-sided', () => {
    expect(s.sharedThemes).toEqual(['Law', 'Prophecy'])
    expect(s.onlyA.themes).toEqual(['Miracles'])
    expect(s.onlyB.themes).toEqual(['Priesthood'])
  })

  it('reports shared names only when the names really overlap', () => {
    expect(s.nameOverlap).toEqual([])
    const twin = summarisePair(moses, { ...aaron, aliases: [{ tradition: 'ISLAMIC', name: 'MÛSA' }] }, [], [], [])
    expect(twin.nameOverlap).toEqual(['MÛSA'])
  })
})
