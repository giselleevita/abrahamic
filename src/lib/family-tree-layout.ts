/**
 * Lays recorded PARENT relationships out as top-down trees.
 *
 * Only PARENT edges are drawn. Every figure with at least one recorded parent or
 * child appears; nothing is inferred. A child with several recorded parents
 * hangs from the "primary" parent (the one with the most recorded children, then
 * the lowest id) and shows the others as dashed side parents, so we never
 * assert a marriage that the data does not record.
 */
export type TreeFigure = { id: number; canonicalName: string; slug: string }
export type TreeEdge = { fromFigureId: number; toFigureId: number; relationType: string }

export const NODE_W = 150
export const NODE_H = 48
export const H_GAP = 28
export const V_GAP = 76
export const CHIP_W = 118

export type PlacedNode = TreeFigure & { x: number; y: number; generation: number }
export type SideParent = TreeFigure & { x: number; y: number; childId: number }
export type Link = { fromId: number; toId: number }
export type FamilyTree = {
  root: TreeFigure
  nodes: PlacedNode[]
  sideParents: SideParent[]
  links: Link[]
  width: number
  height: number
}

export function layoutFamilyTrees(figures: TreeFigure[], edges: TreeEdge[]): FamilyTree[] {
  const byId = new Map(figures.map((f) => [f.id, f]))
  const parentEdges = edges.filter(
    (e) => e.relationType === 'PARENT' && byId.has(e.fromFigureId) && byId.has(e.toFigureId) && e.fromFigureId !== e.toFigureId,
  )
  const parentsOf = new Map<number, number[]>()
  const childCount = new Map<number, number>()
  for (const e of parentEdges) {
    parentsOf.set(e.toFigureId, [...(parentsOf.get(e.toFigureId) ?? []), e.fromFigureId])
    childCount.set(e.fromFigureId, (childCount.get(e.fromFigureId) ?? 0) + 1)
  }

  // Primary parent per child.
  const primary = new Map<number, number>()
  const extra = new Map<number, number[]>()
  for (const [child, parents] of parentsOf) {
    const ranked = [...new Set(parents)].sort(
      (a, b) => (childCount.get(b) ?? 0) - (childCount.get(a) ?? 0) || a - b,
    )
    primary.set(child, ranked[0])
    extra.set(child, ranked.slice(1))
  }

  // Guard against cycles: walking up from any node must terminate.
  function hasCycle(start: number) {
    const seen = new Set<number>()
    let cur: number | undefined = start
    while (cur !== undefined) {
      if (seen.has(cur)) return true
      seen.add(cur)
      cur = primary.get(cur)
    }
    return false
  }
  for (const child of [...primary.keys()]) {
    if (hasCycle(child)) { primary.delete(child); extra.delete(child) }
  }

  const childrenOf = new Map<number, number[]>()
  for (const [child, parent] of primary) childrenOf.set(parent, [...(childrenOf.get(parent) ?? []), child])
  for (const list of childrenOf.values()) list.sort((a, b) => a - b)

  const involved = new Set<number>()
  for (const e of parentEdges) { involved.add(e.fromFigureId); involved.add(e.toFigureId) }
  // Roots: involved figures with no primary parent that are not merely a side parent of someone.
  const sideOnly = new Set<number>()
  for (const list of extra.values()) for (const id of list) sideOnly.add(id)
  const roots = [...involved]
    .filter((id) => !primary.has(id) && (!sideOnly.has(id) || (childrenOf.get(id)?.length ?? 0) > 0))
    .sort((a, b) => (childCount.get(b) ?? 0) - (childCount.get(a) ?? 0) || a - b)

  const trees: FamilyTree[] = []
  for (const rootId of roots) {
    const nodes: PlacedNode[] = []
    const sideParents: SideParent[] = []
    const links: Link[] = []
    let cursor = 0
    let maxGen = 0

    const place = (id: number, gen: number): { x: number } => {
      maxGen = Math.max(maxGen, gen)
      const fig = byId.get(id)!
      const kids = childrenOf.get(id) ?? []
      const kidPositions = kids.map((k) => ({ k, ...place(k, gen + 1) }))
      let x: number
      if (kidPositions.length === 0) {
        x = cursor
        // A leaf also reserves room for its own side parents.
        const sides = extra.get(id)?.length ?? 0
        cursor += NODE_W + sides * (CHIP_W + 12) + H_GAP
      } else {
        x = (kidPositions[0].x + kidPositions[kidPositions.length - 1].x) / 2
        // Side parents sit to the right of this node; keep later branches clear of them.
        const sides = extra.get(id)?.length ?? 0
        cursor = Math.max(cursor, x + NODE_W + sides * (CHIP_W + 12) + H_GAP)
        for (const kp of kidPositions) links.push({ fromId: id, toId: kp.k })
      }
      nodes.push({ ...fig, x, y: gen * (NODE_H + V_GAP), generation: gen })
      return { x }
    }
    place(rootId, 0)

    // Side parents sit to the right of their child, then room is reserved for internal nodes too.
    for (const n of nodes) {
      const sides = extra.get(n.id) ?? []
      sides.forEach((pid, i) => {
        const fig = byId.get(pid)
        if (fig) sideParents.push({ ...fig, childId: n.id, x: n.x + NODE_W + 12 + i * (CHIP_W + 12), y: n.y + 2 })
      })
    }

    const maxX = Math.max(...nodes.map((n) => n.x + NODE_W), ...sideParents.map((s) => s.x + CHIP_W))
    const minX = Math.min(...nodes.map((n) => n.x))
    const shift = -minX
    nodes.forEach((n) => { n.x += shift })
    sideParents.forEach((s) => { s.x += shift })
    trees.push({
      root: byId.get(rootId)!,
      nodes,
      sideParents,
      links,
      width: maxX - minX,
      height: (maxGen + 1) * NODE_H + maxGen * V_GAP,
    })
  }
  return trees
}
