import { describe, expect, it } from 'vitest'
import { artworkIssues, chapterReadiness } from './readiness'

const artwork = {
  artworkPath: '/journeys/abraham.jpg', artworkAlt: 'Desert camp',
  artworkCredit: 'Project', artworkSourceUrl: '/licensing', artworkLicense: 'PROJECT',
}

describe('journey publication readiness', () => {
  it('requires complete, reusable artwork attribution including source URL', () => {
    expect(artworkIssues({ ...artwork, artworkSourceUrl: null })).toContain('source URL')
    expect(artworkIssues({ ...artwork, artworkLicense: 'UNKNOWN' })).toContain('reusable licence')
    expect(artworkIssues(artwork)).toEqual([])
  })

  it('accepts inherited course artwork and evidence-linked comparisons', () => {
    const chapter = {
      artworkPath: null, artworkAlt: null, artworkCredit: null,
      artworkSourceUrl: null, artworkLicense: null,
      neutralityReviewedAt: new Date(), items: [{ itemType: 'COMPARISON' }],
    }
    expect(chapterReadiness(chapter, artwork)).toMatchObject({ ready: true, evidenceLinks: 1, directVerses: 0 })
  })

  it('reports missing review, content, and evidence separately', () => {
    const chapter = { ...artwork, neutralityReviewedAt: null, items: [] }
    expect(chapterReadiness(chapter, artwork).issues).toEqual([
      'Neutrality review', 'No learning items', 'No evidence links',
    ])
  })
})
