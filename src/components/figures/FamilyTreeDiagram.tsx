import Link from 'next/link'
import {
  layoutFamilyTrees,
  CHIP_W,
  NODE_H,
  NODE_W,
  type TreeEdge,
  type TreeFigure,
} from '@/lib/family-tree-layout'

const PAD = 16

/** Elbow connector from the bottom of a parent to the top of a child. */
function elbow(px: number, py: number, cx: number, cy: number) {
  const midY = (py + cy) / 2
  return `M ${px} ${py} V ${midY} H ${cx} V ${cy}`
}

export function FamilyTreeDiagram({ figures, edges }: { figures: TreeFigure[]; edges: TreeEdge[] }) {
  const trees = layoutFamilyTrees(figures, edges)
  if (trees.length === 0) return null

  return (
    <section aria-labelledby="family-diagram-title" className="space-y-6">
      <div>
        <h2 id="family-diagram-title" className="font-serif text-2xl text-primary-950">
          The family tree
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-primary-700">
          Each line joins a parent to a child with a recorded, sourced relationship. A dashed
          box beside a person is another recorded parent. Select a name to read about them.
          Only connections that have been checked are drawn, so some branches stop early.
        </p>
      </div>

      {trees.map((tree) => {
        const byId = new Map(tree.nodes.map((n) => [n.id, n]))
        const width = tree.width + PAD * 2
        const height = tree.height + PAD * 2
        return (
          <figure key={tree.root.id} className="rounded-3xl border border-[#d7c5ad] bg-gradient-to-b from-[#fbf6ec] to-white p-4 sm:p-6">
            <figcaption className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#80571b]">
              Descendants of {tree.root.canonicalName}
            </figcaption>
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={`Family tree of ${tree.root.canonicalName}, scrollable`}>
              <svg
                role="group"
                aria-label={`Family tree: ${tree.nodes.length} people descended from ${tree.root.canonicalName}`}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="mx-auto block max-w-none"
              >
                <g transform={`translate(${PAD} ${PAD})`} fill="none" stroke="#8a6a3b" strokeWidth="2" strokeLinecap="round">
                  {tree.links.map((l) => {
                    const p = byId.get(l.fromId)!
                    const c = byId.get(l.toId)!
                    return <path key={`${l.fromId}-${l.toId}`} d={elbow(p.x + NODE_W / 2, p.y + NODE_H, c.x + NODE_W / 2, c.y)} />
                  })}
                  {tree.sideParents.map((s) => {
                    const c = byId.get(s.childId)!
                    return (
                      <path key={`side-${s.id}-${s.childId}`} d={`M ${s.x} ${s.y + NODE_H / 2} H ${c.x + NODE_W}`} strokeDasharray="4 4" />
                    )
                  })}
                </g>
                <g transform={`translate(${PAD} ${PAD})`}>
                  {tree.sideParents.map((s) => (
                    <Link key={`sidenode-${s.id}-${s.childId}`} href={`/figures/${s.slug}`} prefetch={false}>
                      <g className="family-node">
                        <title>{`${s.canonicalName}, another recorded parent`}</title>
                        <rect x={s.x} y={s.y} width={CHIP_W} height={NODE_H - 4} rx={14} fill="#fffdf8" stroke="#a88a58" strokeWidth="2" strokeDasharray="5 4" />
                        <text x={s.x + CHIP_W / 2} y={s.y + (NODE_H - 4) / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill="#3d3326">
                          {s.canonicalName}
                        </text>
                      </g>
                    </Link>
                  ))}
                  {tree.nodes.map((n) => (
                    <Link key={n.id} href={`/figures/${n.slug}`} prefetch={false}>
                      <g className="family-node">
                        <title>{n.canonicalName}</title>
                        <rect x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx={16} fill={n.generation === 0 ? '#173b68' : '#ffffff'} stroke={n.generation === 0 ? '#173b68' : '#173b68'} strokeWidth="2" />
                        <text x={n.x + NODE_W / 2} y={n.y + NODE_H / 2 + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill={n.generation === 0 ? '#fff9ed' : '#173b68'}>
                          {n.canonicalName}
                        </text>
                      </g>
                    </Link>
                  ))}
                </g>
              </svg>
            </div>
          </figure>
        )
      })}
    </section>
  )
}
