export type CPFigure = { id: number; slug: string; name: string; aliases: { tradition: string; name: string }[] }
export type CPEvent = { slug: string; name: string; figureIds: number[] }
export type CPClaim = { figureIds: number[]; comparisonIds: number[]; themes: string[] }
export type CPComparison = { id: number; title: string }

export type PairSummary = {
  sharedEvents: CPEvent[]
  sharedComparisons: CPComparison[]
  sharedThemes: string[]
  onlyA: { themes: string[] }
  onlyB: { themes: string[] }
  nameOverlap: string[]
}

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()

/** What two people have in common, using only links already recorded on the site. */
export function summarisePair(
  a: CPFigure,
  b: CPFigure,
  events: CPEvent[],
  claims: CPClaim[],
  comparisons: CPComparison[],
): PairSummary {
  const sharedEvents = events.filter((e) => e.figureIds.includes(a.id) && e.figureIds.includes(b.id))
  const themesOf = (id: number) => new Set(claims.filter((c) => c.figureIds.includes(id)).flatMap((c) => c.themes))
  const ta = themesOf(a.id)
  const tb = themesOf(b.id)
  const compIds = new Set(
    claims.filter((c) => c.figureIds.includes(a.id) && c.figureIds.includes(b.id)).flatMap((c) => c.comparisonIds),
  )
  const namesA = new Set([a.name, ...a.aliases.map((x) => x.name)].map(fold))
  const nameOverlap = [...new Set([b.name, ...b.aliases.map((x) => x.name)])].filter((n) => namesA.has(fold(n)))
  return {
    sharedEvents,
    sharedComparisons: comparisons.filter((c) => compIds.has(c.id)),
    sharedThemes: [...ta].filter((t) => tb.has(t)).sort(),
    onlyA: { themes: [...ta].filter((t) => !tb.has(t)).sort() },
    onlyB: { themes: [...tb].filter((t) => !ta.has(t)).sort() },
    nameOverlap,
  }
}
