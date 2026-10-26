export type RelatedComparisonCandidate = {
  id: number
  title: string
  figureIds: number[]
  themeIds: number[]
}

/** Rank exact shared figures above broad theme overlap, with stable tie ordering. */
export function rankRelatedComparisons(
  figureIds: number[],
  themeIds: number[],
  candidates: RelatedComparisonCandidate[],
) {
  const figures = new Set(figureIds)
  const themes = new Set(themeIds)
  return candidates
    .map((candidate) => {
      const sharedFigures = new Set(candidate.figureIds.filter((id) => figures.has(id))).size
      const sharedThemes = new Set(candidate.themeIds.filter((id) => themes.has(id))).size
      return { id: candidate.id, title: candidate.title, score: sharedFigures * 3 + sharedThemes }
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.id - b.id)
    .slice(0, 3)
    .map(({ id, title }) => ({ id, title }))
}
