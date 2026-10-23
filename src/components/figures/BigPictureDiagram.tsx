'use client'

import { useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import {
  BIG_LINKS,
  BIG_NODES,
  LAYERS,
  PROPHET_NOTES,
  PROPHET_ORDER,
  PROPHET_PANEL,
  type BigLayer,
  type BigLink,
  type BigNode,
} from '@/lib/big-picture'
import { TRADITION_LABEL } from '@/lib/constants'
import { PronounceButton } from '@/components/ui/PronounceButton'
import type { Tradition } from '@/generated/prisma/client'

const FIG_W = 132
const FIG_H = 46
const REL_W = 190
const REL_H = 62
const CMP_W = 108
const CMP_H = 44

const size = (n: BigNode) =>
  n.kind === 'religion' ? { w: REL_W, h: REL_H } : n.compact ? { w: CMP_W, h: CMP_H } : { w: FIG_W, h: FIG_H }

function geometry(link: BigLink, byId: Map<string, BigNode>) {
  const a = byId.get(link.from)!
  const b = byId.get(link.to)!
  const sa = size(a)
  const sb = size(b)
  if (Math.abs(a.y - b.y) < 5) {
    const dir = b.x > a.x ? 1 : -1
    const x1 = a.x + (dir * sa.w) / 2
    const x2 = b.x - (dir * sb.w) / 2
    return { d: `M ${x1} ${a.y} H ${x2}`, mx: (x1 + x2) / 2, my: a.y - 8 }
  }
  const x1 = a.x
  const y1 = a.y + sa.h / 2
  const x2 = b.x
  const y2 = b.y - sb.h / 2
  const mid = (y1 + y2) / 2
  return { d: `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`, mx: (x1 + x2) / 2, my: mid }
}

const KIND_LABEL: Record<BigLink['kind'], string> = {
  recorded: 'Recorded family link',
  kin: 'Recorded relative',
  tradition: 'A tradition’s own account',
  honoured: 'Honoured by a later tradition',
  gap: 'Generations not drawn',
}

export type BigProfile = { name: string; aliases: { tradition: Tradition; name: string; language: string | null; notes: string | null }[] }

export function BigPictureDiagram({ profiles = {} }: { profiles?: Record<string, BigProfile> }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [on, setOn] = useState<Record<BigLayer, boolean>>({ women: true, kin: true, prophets: true })
  const visible = (n: BigNode) => !n.layer || on[n.layer]
  const nodes = BIG_NODES.filter(visible)
  const shown = new Set(nodes.map((n) => n.id))
  const byId = new Map(BIG_NODES.map((n) => [n.id, n]))
  const drawn = BIG_LINKS.filter((l) => l.kind !== 'honoured' && shown.has(l.from) && shown.has(l.to))
  const honoured = (religionId: string) =>
    BIG_LINKS.filter((l) => l.kind === 'honoured' && l.to === religionId).map((l) => byId.get(l.from)!.label)

  return (
    <section aria-labelledby="big-picture-title" className="space-y-5">
      <div>
        <p className="editorial-eyebrow">The whole picture</p>
        <h2 id="big-picture-title" className="mt-1 font-serif text-3xl text-primary-950">
          How three traditions grew from shared roots
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-primary-700">
          All three begin with a shared story: Adam, Noah and then Abraham. From Abraham the
          paths divide. Each tradition tells its own account of how it began, and the same
          people are remembered in more than one of them.
        </p>
      </div>

      <fieldset className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-primary-200 bg-white px-4 py-3">
        <legend className="px-1 text-sm font-semibold text-primary-900">Show on the diagram</legend>
        {LAYERS.map((layer) => (
          <label key={layer.id} className="flex cursor-pointer items-center gap-2 text-sm text-primary-800">
            <input
              type="checkbox"
              checked={on[layer.id]}
              onChange={(e) => setOn((prev) => ({ ...prev, [layer.id]: e.target.checked }))}
              className="h-4 w-4 accent-[#173b68]"
            />
            <span className="font-semibold">{layer.label}</span>
            <span className="text-primary-600">({layer.hint})</span>
          </label>
        ))}
      </fieldset>

      <figure className="rounded-3xl border border-[#d7c5ad] bg-gradient-to-b from-[#fbf6ec] to-white p-3 sm:p-6">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Overview diagram of how the three traditions are connected, scrollable">
          <svg
            role="group"
            aria-label="Diagram: Adam, Enoch, Noah and Abraham lead to Isaac and Ishmael, and onward to the origins of Judaism, Christianity and Islam. Select a person for their names in each tradition. A text list of every connection follows."
            viewBox="0 0 1050 975"
            className="mx-auto block h-auto w-full min-w-[820px] max-w-[1050px]"
          >
            <defs>
              <marker id="bp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#8a6a3b" />
              </marker>
            </defs>

            {on.prophets && (
              <g>
                <rect x={PROPHET_PANEL.x} y={PROPHET_PANEL.y} width={PROPHET_PANEL.w} height={PROPHET_PANEL.h} rx={18} fill="#f3eadb" stroke="#d7c5ad" strokeWidth="2" />
                <text x={PROPHET_PANEL.x + PROPHET_PANEL.w / 2} y={PROPHET_PANEL.y + 20} textAnchor="middle" fontSize="11" fontWeight="700" fill="#80571b">
                  {PROPHET_PANEL.title}
                </text>
                <text x={PROPHET_PANEL.x + PROPHET_PANEL.w / 2} y={PROPHET_PANEL.y + 34} textAnchor="middle" fontSize="9" fill="#6e6259">
                  {PROPHET_PANEL.note}
                </text>
              </g>
            )}

            <g fill="none" strokeLinecap="round">
              {drawn.map((l) => {
                const g = geometry(l, byId)
                const style =
                  l.kind === 'recorded'
                    ? { stroke: '#173b68', strokeWidth: 3 }
                    : l.kind === 'kin'
                      ? { stroke: '#3f7d5c', strokeWidth: 3 }
                      : l.kind === 'tradition'
                        ? { stroke: '#8a6a3b', strokeWidth: 2.5, strokeDasharray: '8 6', markerEnd: 'url(#bp-arrow)' }
                        : { stroke: '#a89d91', strokeWidth: 2, strokeDasharray: '2 7' }
                return <path key={`${l.from}-${l.to}`} d={g.d} {...style} />
              })}
            </g>

            <g fontSize="12" fill="#534841" textAnchor="middle" style={{ paintOrder: 'stroke' }} stroke="#fbf6ec" strokeWidth="4">
              {drawn.filter((l) => l.label).map((l) => {
                const g = geometry(l, byId)
                return (
                  <text key={`t-${l.from}-${l.to}`} x={g.mx} y={g.my + 4}>
                    {l.label}
                  </text>
                )
              })}
            </g>

            {nodes.map((n) => {
              const { w, h } = size(n)
              const isRel = n.kind === 'religion'
              const body = (
                <g className={n.slug ? 'family-node' : undefined}>
                  <title>{n.slug ? `${n.label}: select for names in each tradition` : n.label}</title>
                  <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx={isRel ? 20 : 16} fill={isRel ? '#173b68' : '#ffffff'} stroke="#173b68" strokeWidth="2" />
                  <text x={n.x} y={n.y + (n.sub ? -3 : 6)} textAnchor="middle" fontSize={isRel ? 19 : n.compact ? (n.label.length > 8 ? 11 : 14) : 16} fontWeight="700" fill={isRel ? '#fff9ed' : '#173b68'}>
                    {n.label}
                  </text>
                  {n.sub && (
                    <text x={n.x} y={n.y + 13} textAnchor="middle" fontSize="11" fill={isRel ? '#e2c69e' : '#6e6259'}>
                      {n.sub}
                    </text>
                  )}
                </g>
              )
              if (!n.slug) return <g key={n.id}>{body}</g>
              const on = selectedId === n.id
              const pick = () => setSelectedId(on ? null : n.id)
              return (
                <g
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={`${n.label}: show names across the traditions`}
                  onClick={pick}
                  onKeyDown={(e: KeyboardEvent<SVGGElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick() }
                  }}
                  className={on ? 'family-node family-node-on' : 'family-node'}
                >
                  {body}
                </g>
              )
            })}

            {nodes.filter((n) => n.kind === 'religion').map((n) => {
              const names = honoured(n.id)
              if (!names.length) return null
              return (
                <text key={`h-${n.id}`} x={n.x} y={n.y + REL_H / 2 + 18} textAnchor="middle" fontSize="12" fontStyle="italic" fill="#534841">
                  <tspan x={n.x}>Also honours</tspan>
                  <tspan x={n.x} dy="15">{names.join(', ')}</tspan>
                </text>
              )
            })}
          </svg>
        </div>

        <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-primary-700" aria-label="Key">
          <span className="inline-flex items-center gap-2"><svg width="34" height="6" aria-hidden="true"><line x1="0" y1="3" x2="34" y2="3" stroke="#173b68" strokeWidth="3" /></svg>Recorded family link</span>
          <span className="inline-flex items-center gap-2"><svg width="34" height="6" aria-hidden="true"><line x1="0" y1="3" x2="34" y2="3" stroke="#3f7d5c" strokeWidth="3" /></svg>Recorded relative (not descent)</span>
          <span className="inline-flex items-center gap-2"><svg width="34" height="6" aria-hidden="true"><line x1="0" y1="3" x2="34" y2="3" stroke="#8a6a3b" strokeWidth="2.5" strokeDasharray="8 6" /></svg>A tradition’s own account</span>
          <span className="inline-flex items-center gap-2"><svg width="34" height="6" aria-hidden="true"><line x1="0" y1="3" x2="34" y2="3" stroke="#a89d91" strokeWidth="2" strokeDasharray="2 7" /></svg>Generations not drawn</span>
        </figcaption>
      </figure>

      {selectedId && (() => {
        const node = byId.get(selectedId)
        const profile = node?.slug ? profiles[node.slug] : undefined
        if (!node) return null
        return (
          <aside aria-live="polite" className="rounded-3xl border-2 border-[#b7791f] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-serif text-2xl text-slate-950">{profile?.name ?? node.label}</h3>
              <button type="button" onClick={() => setSelectedId(null)} className="rounded-full border border-[#d7c5ad] px-3 py-1 text-sm font-semibold text-slate-700 hover:border-[#b7791f]">Close</button>
            </div>
            {profile && profile.aliases.length > 0 ? (
              <ul className="mt-4 grid gap-3 md:grid-cols-3">
                {(['JEWISH', 'CHRISTIAN', 'ISLAMIC'] as Tradition[]).map((t) => {
                  const a = profile.aliases.find((x) => x.tradition === t)
                  return (
                    <li key={t} className="rounded-2xl border border-[#d7c5ad] bg-[#fbf6ec] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#80571b]">{TRADITION_LABEL[t]}</p>
                      {a ? (
                        <>
                          <p className="mt-1 flex items-center gap-2 text-lg font-bold text-slate-950">{a.name}<PronounceButton name={a.name} tradition={t} /></p>
                          {a.notes && <p className="mt-1 text-sm leading-6 text-slate-700">{a.notes}</p>}
                        </>
                      ) : (
                        <p className="mt-1 text-sm text-slate-600">No separate entry on the site yet.</p>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="mt-3 text-slate-700">Read about {node.label} on their page.</p>
            )}
            <p className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
              <Link href={`/figures/${node.slug}`} className="text-[#173b68] hover:underline">Read the full page →</Link>
              <Link href="/map" className="text-[#173b68] hover:underline">See the places →</Link>
            </p>
          </aside>
        )
      })()}

      <details className="rounded-2xl border border-primary-200 bg-white p-5">
        <summary className="cursor-pointer text-base font-semibold text-primary-900">Read every connection as text, with its source</summary>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-primary-800">
          {BIG_LINKS.map((l) => (
            <li key={`${l.from}-${l.to}`}>
              <span className="font-semibold">{byId.get(l.from)!.label} → {byId.get(l.to)!.label}</span>{' '}
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs">{KIND_LABEL[l.kind]}</span>
              <br />
              {l.source}
            </li>
          ))}
          <li>
            <span className="font-semibold">Prophets and forerunners</span>{' '}
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs">Listed in timeline order, no family lines</span>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {PROPHET_ORDER.map((id) => (
                <li key={id}>{PROPHET_NOTES[id]}</li>
              ))}
            </ul>
          </li>
        </ul>
      </details>
    </section>
  )
}
