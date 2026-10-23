export type LineageEdge = { fromFigureId: number; toFigureId: number; relationType: string }
/** Ancestors and descendants are traversed separately; a sibling is not an ancestor. */
export function lineageIds(focus: number, edges: LineageEdge[]): Set<number> {
  const ids = new Set([focus])
  for (const direction of ['ancestors', 'descendants'] as const) {
    const visited = new Set<number>()
    const queue = [focus]
    for (let index = 0; index < queue.length; index++) {
      const current = queue[index]
      if (visited.has(current)) continue
      visited.add(current); ids.add(current)
      for (const edge of edges) {
        // Legacy CHILD records also contain spiritual relationships; never turn those into biological lineage.
        if (edge.relationType !== 'PARENT') continue
        const parent = edge.fromFigureId
        const child = edge.toFigureId
        if (direction === 'ancestors' && child === current) queue.push(parent)
        if (direction === 'descendants' && parent === current) queue.push(child)
      }
    }
  }
  return ids
}
