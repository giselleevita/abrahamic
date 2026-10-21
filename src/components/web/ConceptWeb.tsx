'use client'

import { useMemo, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import type { Placed } from '@/lib/force-layout'

export type WebNode = { id: string; kind: 'concept' | 'figure'; label: string; href: string }
export type WebLink = { a: string; b: string; weight: number }

const W = 1000
const H = 680

export function ConceptWeb({ nodes, links, placed }: { nodes: WebNode[]; links: WebLink[]; placed: Placed[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [show, setShow] = useState<'both' | 'concept' | 'figure'>('both')
  const pos = useMemo(() => new Map(placed.map((p) => [p.id, p])), [placed])
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])
  const neighbours = useMemo(() => {
    const m = new Map<string, Set<string>>()
    for (const l of links) {
      if (!m.has(l.a)) m.set(l.a, new Set())
      if (!m.has(l.b)) m.set(l.b, new Set())
      m.get(l.a)!.add(l.b); m.get(l.b)!.add(l.a)
    }
    return m
  }, [links])

  const near = selected ? neighbours.get(selected) ?? new Set<string>() : null
  const lit = (id: string) => !selected || id === selected || near!.has(id)
  const visible = (n: WebNode) => show === 'both' || n.kind === show || lit(n.id) && !!selected
  const sel = selected ? byId.get(selected) : undefined
  const related = selected ? [...(near ?? [])].map((id) => byId.get(id)!).filter(Boolean).sort((x, y) => x.label.localeCompare(y.label)) : []

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="What to show">
        {([['both', 'Ideas and people'], ['concept', 'Ideas only'], ['figure', 'People only']] as const).map(([k, label]) => (
          <button key={k} type="button" aria-pressed={show === k} onClick={() => setShow(k)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${show === k ? 'border-[#b7791f] bg-[#fbf6ec]' : 'border-[#d7c5ad] bg-white hover:border-[#b7791f]'}`}>{label}</button>
        ))}
        <span className="ml-auto flex items-center gap-4 text-xs text-slate-700">
          <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-[#173b68]" /> Idea</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-[#b7791f]" /> Person</span>
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <figure className="overflow-x-auto rounded-3xl border border-[#d7c5ad] bg-[#fbf6ec] p-2">
          <svg role="group" aria-label="Web of ideas and people. Select a node to see what it connects to. The same connections are listed beside it." viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full min-w-[640px]">
            <g stroke="#8a6a3b" fill="none">
              {links.map((l) => {
                const a = pos.get(l.a), b = pos.get(l.b), na = byId.get(l.a), nb = byId.get(l.b)
                if (!a || !b || !na || !nb || !visible(na) || !visible(nb)) return null
                const on = !selected || l.a === selected || l.b === selected
                return <line key={`${l.a}-${l.b}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={on && selected ? 2.5 : 1.2} opacity={on ? (selected ? 0.9 : 0.35) : 0.07} />
              })}
            </g>
            {nodes.filter(visible).map((n) => {
              const p = pos.get(n.id)!
              const on = selected === n.id
              const isConcept = n.kind === 'concept'
              return (
                <g
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={`${n.label}: show connections`}
                  opacity={lit(n.id) ? 1 : 0.25}
                  className="cursor-pointer"
                  onClick={() => setSelected(on ? null : n.id)}
                  onKeyDown={(e: KeyboardEvent<SVGGElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(on ? null : n.id) } }}
                >
                  {isConcept
                    ? <rect x={p.x - 7} y={p.y - 7} width={14} height={14} rx={3} fill={on ? '#b7791f' : '#173b68'} stroke="#fff9ed" strokeWidth="2" />
                    : <circle cx={p.x} cy={p.y} r={on ? 10 : 8} fill="#b7791f" stroke="#fff9ed" strokeWidth="2" />}
                  <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize={on ? 15 : 12} fontWeight={on ? 800 : 600} fill="#1a1613" stroke="#fbf6ec" strokeWidth="4" paintOrder="stroke">{n.label}</text>
                </g>
              )
            })}
          </svg>
        </figure>

        <aside aria-live="polite" className="rounded-3xl border border-[#d7c5ad] bg-white p-5">
          {sel ? (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-[#80571b]">{sel.kind === 'concept' ? 'An idea' : 'A person'}</p>
              <h2 className="mt-1 font-serif text-2xl text-slate-950">{sel.label}</h2>
              <p className="mt-2 text-sm text-slate-700">
                {related.length === 0 ? 'Nothing else is linked to this yet.' : `Linked to ${related.length} ${sel.kind === 'concept' ? 'people' : 'ideas'}:`}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {related.map((r) => (
                  <li key={r.id}><button type="button" onClick={() => setSelected(r.id)} className="rounded-full border border-[#d7c5ad] bg-[#fbf6ec] px-3 py-1 text-sm font-semibold text-[#173b68] hover:border-[#b7791f]">{r.label}</button></li>
                ))}
              </ul>
              <p className="mt-4"><Link href={sel.href} className="font-bold text-[#173b68] hover:underline">Open the page →</Link></p>
            </>
          ) : (
            <>
              <h2 className="font-serif text-2xl text-slate-950">Follow a thread</h2>
              <p className="mt-2 text-slate-700">Select any idea or person. The lines show what they are linked to through the sourced statements on this site. Select a name in the list to hop to it.</p>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
