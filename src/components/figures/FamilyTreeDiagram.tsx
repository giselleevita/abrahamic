'use client'

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import Link from 'next/link'
import {
  layoutFamilyTrees,
  CHIP_W,
  NODE_H,
  NODE_W,
  type FamilyTree,
  type TreeEdge,
  type TreeFigure,
} from '@/lib/family-tree-layout'

const PAD = 16
const ZOOMS = [0.6, 0.8, 1, 1.25, 1.5]

/** Elbow connector from the bottom of a parent to the top of a child. */
function elbow(px: number, py: number, cx: number, cy: number) {
  const midY = (py + cy) / 2
  return `M ${px} ${py} V ${midY} H ${cx} V ${cy}`
}

function relatives(tree: FamilyTree, id: number) {
  const parentOf = new Map(tree.links.map((l) => [l.toId, l.fromId]))
  const kids = new Map<number, number[]>()
  for (const l of tree.links) kids.set(l.fromId, [...(kids.get(l.fromId) ?? []), l.toId])
  const ancestors: number[] = []
  for (let cur = parentOf.get(id); cur !== undefined; cur = parentOf.get(cur)) ancestors.push(cur)
  const descendants = new Set<number>()
  const walk = (n: number) => { for (const k of kids.get(n) ?? []) { descendants.add(k); walk(k) } }
  walk(id)
  return { ancestors, descendants, kids }
}

function TreeView({ tree, zoomIndex }: { tree: FamilyTree; zoomIndex: number }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())
  const scroller = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  const byId = useMemo(() => new Map(tree.nodes.map((n) => [n.id, n])), [tree])
  const hidden = useMemo(() => {
    const out = new Set<number>()
    const kids = new Map<number, number[]>()
    for (const l of tree.links) kids.set(l.fromId, [...(kids.get(l.fromId) ?? []), l.toId])
    const hide = (n: number) => { for (const k of kids.get(n) ?? []) { out.add(k); hide(k) } }
    for (const c of collapsed) hide(c)
    return out
  }, [tree, collapsed])

  const rel = selected !== null ? relatives(tree, selected) : null
  const inPath = (id: number) => selected === null || id === selected || rel!.ancestors.includes(id) || rel!.descendants.has(id)
  const zoom = ZOOMS[zoomIndex]
  const width = tree.width + PAD * 2
  const height = tree.height + PAD * 2
  const hasKids = (id: number) => (rel?.kids ?? relatives(tree, id).kids).get(id)?.length

  const selectedNode = selected !== null ? byId.get(selected) : undefined
  const trail = selectedNode && rel ? [...rel.ancestors].reverse().map((a) => byId.get(a)!.canonicalName).concat(selectedNode.canonicalName) : []

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || !scroller.current) return
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false }
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d || !scroller.current) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    if (d.moved) scroller.current.scrollLeft = d.left - dx
  }
  const endDrag = () => { setTimeout(() => { drag.current = null }, 0) }
  const pick = (id: number) => { if (drag.current?.moved) return; setSelected((cur) => (cur === id ? null : id)) }
  const toggle = (id: number) => setCollapsed((cur) => { const n = new Set(cur); if (n.has(id)) n.delete(id); else n.add(id); return n })

  return (
    <figure className="rounded-3xl border border-[#d7c5ad] bg-gradient-to-b from-[#fbf6ec] to-white p-4 sm:p-6">
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#80571b]">Descendants of {tree.root.canonicalName}</span>
        {selected !== null && <button type="button" onClick={() => setSelected(null)} className="reading-action">Clear selection</button>}
      </figcaption>
      <div
        ref={scroller}
        className="cursor-grab overflow-x-auto active:cursor-grabbing"
        tabIndex={0}
        role="region"
        aria-label={`Family tree of ${tree.root.canonicalName}, scrollable. Drag to pan.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <svg
          role="group"
          aria-label={`Family tree: ${tree.nodes.length} people descended from ${tree.root.canonicalName}. Select a person to trace their line.`}
          width={width * zoom}
          height={height * zoom}
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto block max-w-none"
        >
          <g transform={`translate(${PAD} ${PAD})`} fill="none" stroke="#8a6a3b" strokeWidth="2" strokeLinecap="round">
            {tree.links.filter((l) => !hidden.has(l.toId)).map((l) => {
              const p = byId.get(l.fromId)!
              const c = byId.get(l.toId)!
              const on = selected === null || ((l.fromId === selected || rel!.ancestors.includes(l.fromId) || rel!.descendants.has(l.fromId)) && inPath(l.toId))
              return <path key={`${l.fromId}-${l.toId}`} d={elbow(p.x + NODE_W / 2, p.y + NODE_H, c.x + NODE_W / 2, c.y)} opacity={on ? 1 : 0.2} strokeWidth={on && selected !== null ? 4 : 2} stroke={on && selected !== null ? '#b7791f' : '#8a6a3b'} />
            })}
            {tree.sideParents.filter((s) => !hidden.has(s.childId)).map((s) => {
              const c = byId.get(s.childId)!
              return <path key={`side-${s.id}-${s.childId}`} d={`M ${s.x} ${s.y + NODE_H / 2} H ${c.x + NODE_W}`} strokeDasharray="4 4" opacity={inPath(s.childId) ? 1 : 0.2} />
            })}
          </g>
          <g transform={`translate(${PAD} ${PAD})`}>
            {tree.sideParents.filter((s) => !hidden.has(s.childId)).map((s) => (
              <Link key={`sidenode-${s.id}-${s.childId}`} href={`/figures/${s.slug}`} prefetch={false}>
                <g className="family-node" opacity={inPath(s.childId) ? 1 : 0.3}>
                  <title>{`${s.canonicalName}, another recorded parent`}</title>
                  <rect x={s.x} y={s.y} width={CHIP_W} height={NODE_H - 4} rx={14} fill="#fffdf8" stroke="#a88a58" strokeWidth="2" strokeDasharray="5 4" />
                  <text x={s.x + CHIP_W / 2} y={s.y + (NODE_H - 4) / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill="#3d3326">{s.canonicalName}</text>
                </g>
              </Link>
            ))}
            {tree.nodes.filter((n) => !hidden.has(n.id)).map((n) => {
              const on = selected === n.id
              const kidsCount = hasKids(n.id)
              return (
                <g key={n.id} opacity={inPath(n.id) ? 1 : 0.3}>
                  <g
                    role="button"
                    tabIndex={0}
                    aria-pressed={on}
                    aria-label={`${n.canonicalName}: trace their line`}
                    className={on ? 'family-node family-node-on' : 'family-node'}
                    onClick={() => pick(n.id)}
                    onKeyDown={(e: KeyboardEvent<SVGGElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(n.id) } }}
                  >
                    <title>{`${n.canonicalName}: select to trace their line`}</title>
                    <rect x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx={16} fill={n.generation === 0 || on ? '#173b68' : '#ffffff'} stroke="#173b68" strokeWidth="2" />
                    <text x={n.x + NODE_W / 2} y={n.y + NODE_H / 2 + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill={n.generation === 0 || on ? '#fff9ed' : '#173b68'}>{n.canonicalName}</text>
                  </g>
                  {kidsCount ? (
                    <g
                      role="button"
                      tabIndex={0}
                      aria-pressed={collapsed.has(n.id)}
                      aria-label={`${collapsed.has(n.id) ? 'Show' : 'Hide'} the descendants of ${n.canonicalName}`}
                      className="family-node"
                      onClick={() => toggle(n.id)}
                      onKeyDown={(e: KeyboardEvent<SVGGElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(n.id) } }}
                    >
                      <circle cx={n.x + NODE_W / 2} cy={n.y + NODE_H} r={11} fill="#fffdf8" stroke="#8a6a3b" strokeWidth="2" />
                      <text x={n.x + NODE_W / 2} y={n.y + NODE_H + 5} textAnchor="middle" fontSize="16" fontWeight="700" fill="#3d3326">{collapsed.has(n.id) ? '+' : '−'}</text>
                    </g>
                  ) : null}
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {selectedNode && (
        <div role="status" className="mt-4 rounded-2xl border-2 border-[#b7791f] bg-white p-4">
          <p className="text-sm font-bold uppercase tracking-wider text-[#80571b]">Tracing {selectedNode.canonicalName}</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{trail.join(' → ')}</p>
          <p className="mt-1 text-sm text-slate-700">
            {rel!.descendants.size > 0 ? `${rel!.descendants.size} recorded descendant${rel!.descendants.size === 1 ? '' : 's'} below.` : 'No recorded descendants below.'}{' '}
            <Link href={`/figures/${selectedNode.slug}`} className="font-bold text-[#173b68] hover:underline">Read about {selectedNode.canonicalName} →</Link>
          </p>
        </div>
      )}
    </figure>
  )
}

export function FamilyTreeDiagram({ figures, edges }: { figures: TreeFigure[]; edges: TreeEdge[] }) {
  const trees = useMemo(() => layoutFamilyTrees(figures, edges), [figures, edges])
  const [zoomIndex, setZoomIndex] = useState(2)
  if (trees.length === 0) return null

  return (
    <section aria-labelledby="family-diagram-title" className="space-y-6">
      <div>
        <h2 id="family-diagram-title" className="font-serif text-2xl text-primary-950">The family tree</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-primary-700">
          Each line joins a parent to a child with a recorded, sourced relationship. A dashed box beside a person is another
          recorded parent. Select a person to trace their line, press − to fold a branch, and drag to pan. Only connections that
          have been checked are drawn, so some branches stop early.
        </p>
        <div role="group" aria-label="Zoom" className="mt-3 flex items-center gap-2">
          <button type="button" className="reading-action" disabled={zoomIndex === 0} onClick={() => setZoomIndex((z) => Math.max(0, z - 1))} aria-label="Zoom out">−</button>
          <span className="min-w-14 text-center text-sm font-semibold text-slate-800" aria-live="polite">{Math.round(ZOOMS[zoomIndex] * 100)}%</span>
          <button type="button" className="reading-action" disabled={zoomIndex === ZOOMS.length - 1} onClick={() => setZoomIndex((z) => Math.min(ZOOMS.length - 1, z + 1))} aria-label="Zoom in">+</button>
          <button type="button" className="reading-action" onClick={() => setZoomIndex(2)}>Reset</button>
        </div>
      </div>
      {trees.map((tree) => <TreeView key={tree.root.id} tree={tree} zoomIndex={zoomIndex} />)}
    </section>
  )
}
