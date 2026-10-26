import { describe, expect, it } from 'vitest'
import { rankRelatedComparisons } from './related-comparisons'

describe('rankRelatedComparisons', () => {
  it('ranks a specific shared figure before broad shared themes', () => {
    const ranked = rankRelatedComparisons([7], [2, 3], [
      { id: 1, title: 'Broad theme', figureIds: [], themeIds: [2, 3] },
      { id: 2, title: 'Same figure', figureIds: [7], themeIds: [] },
    ])
    expect(ranked.map((item) => item.title)).toEqual(['Same figure', 'Broad theme'])
  })

  it('deduplicates relationships, excludes unrelated records, and returns at most three', () => {
    const candidates = [1, 2, 3, 4].map((id) => ({ id, title: `Comparison ${id}`, figureIds: [7, 7], themeIds: [2] }))
    candidates.push({ id: 5, title: 'Unrelated', figureIds: [90], themeIds: [90] })
    expect(rankRelatedComparisons([7], [2], candidates)).toEqual([
      { id: 1, title: 'Comparison 1' },
      { id: 2, title: 'Comparison 2' },
      { id: 3, title: 'Comparison 3' },
    ])
  })
})
