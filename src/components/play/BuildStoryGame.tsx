'use client'

import { useMemo, useState } from 'react'
import { MAP_HEIGHT, MAP_LAND, MAP_WIDTH, project } from '@/lib/map-land'
import { MAP_PLACES } from '@/lib/map-places'
import { pickStoryRound, scramble, type StoryEvent } from '@/lib/build-story'

type Phase = 'where' | 'order' | 'done'

/** Two steps: pin each event to the place it happened, then put the events in story order. */
export function BuildStoryGame({ events }: { events: StoryEvent[] }) {
  const [round, setRound] = useState(0)
  const picked = useMemo(() => pickStoryRound(events, round), [events, round])
  const [phase, setPhase] = useState<Phase>('where')
  const [active, setActive] = useState<string | null>(null)
  const [pins, setPins] = useState<Record<string, string>>({})
  const [whereChecked, setWhereChecked] = useState(false)
  const [order, setOrder] = useState<string[]>(() => scramble(picked, 0).map((e) => e.slug))

  const byslug = new Map(picked.map((e) => [e.slug, e]))
  const placeName = (id: string) => MAP_PLACES.find((p) => p.id === id)?.name ?? ''
  const wherePoints = picked.filter((e) => pins[e.slug] === e.placeId).length
  const correctOrder = [...picked].sort((a, b) => a.order - b.order).map((e) => e.slug)
  const orderPoints = order.filter((s, i) => s === correctOrder[i]).length

  function newRound() {
    const next = round + 1
    const p = pickStoryRound(events, next)
    setRound(next); setPhase('where'); setActive(null); setPins({}); setWhereChecked(false)
    setOrder(scramble(p, next).map((e) => e.slug))
  }
  function move(i: number, d: number) {
    const j = i + d
    if (j < 0 || j >= order.length) return
    const n = [...order]; [n[i], n[j]] = [n[j], n[i]]; setOrder(n)
  }
  const assign = (placeId: string) => {
    if (!active || whereChecked) return
    setPins((p) => ({ ...p, [active]: placeId }))
    setActive(null)
  }

  if (picked.length < 3) return <p className="rounded-2xl border border-[#d7c5ad] bg-white p-6">Not enough mapped events to play yet.</p>

  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-slate-700" aria-live="polite">
        {phase === 'where' ? 'Step 1 of 2 · Where did it happen?' : phase === 'order' ? 'Step 2 of 2 · Put them in story order' : 'Done'}
      </p>

      {phase === 'where' && (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
          <ul className="space-y-2">
            {picked.map((e) => {
              const pinned = pins[e.slug]
              const right = whereChecked && pinned === e.placeId
              const wrong = whereChecked && pinned && pinned !== e.placeId
              return (
                <li key={e.slug}>
                  <button
                    type="button"
                    aria-pressed={active === e.slug}
                    onClick={() => !whereChecked && setActive(active === e.slug ? null : e.slug)}
                    className={`w-full rounded-2xl border-2 p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f] ${right ? 'kids-pop border-green-500 bg-green-50' : wrong ? 'kids-wiggle border-rose-400 bg-rose-50' : active === e.slug ? 'border-[#b7791f] bg-[#fbf6ec]' : 'border-[#d7c5ad] bg-white hover:border-[#b7791f]'}`}
                  >
                    <span className="block font-semibold text-slate-950">{e.name}</span>
                    <span className="block text-sm text-slate-700">
                      {pinned ? `Placed at ${placeName(pinned)}` : active === e.slug ? 'Now choose a place on the map' : 'Select, then choose a place'}
                      {whereChecked && wrong ? ` · it was ${placeName(e.placeId)}` : ''}
                      {right ? ' ✓' : ''}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <figure className="rounded-3xl border border-[#d7c5ad] bg-[#cfe3ea] p-2">
            <svg role="group" aria-label="Map. Select an event first, then a place." viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="block h-auto w-full rounded-2xl">
              <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#cfe3ea" />
              <path d={MAP_LAND} fill="#f1e6cf" stroke="#f1e6cf" strokeWidth="1.2" strokeLinejoin="round" />
              {MAP_PLACES.map((p) => {
                const { x, y } = project(p.lat, p.lon)
                const used = Object.values(pins).includes(p.id)
                return (
                  <g key={p.id}>
                    <circle cx={x} cy={y} r={used ? 11 : 8} fill={used ? '#b7791f' : '#173b68'} stroke="#fff9ed" strokeWidth="2.5" />
                    <text x={x + (p.dx ?? 14)} y={y + (p.dy ?? 4)} fontSize="15" fontWeight="700" fill="#1a1613" stroke="#f1e6cf" strokeWidth="4" paintOrder="stroke" textAnchor={(p.dx ?? 1) < 0 ? 'end' : 'start'}>{p.name}</text>
                    <circle cx={x} cy={y} r={22} fill="transparent" role="button" tabIndex={0} aria-label={`Place the chosen event at ${p.name}`} className={active ? 'cursor-pointer' : 'cursor-not-allowed'} onClick={() => assign(p.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); assign(p.id) } }} />
                  </g>
                )
              })}
            </svg>
          </figure>
        </div>
      )}

      {phase === 'where' && (
        <div className="mt-5 flex flex-wrap items-center gap-4" role="status">
          {!whereChecked ? (
            <button type="button" disabled={Object.keys(pins).length < picked.length} onClick={() => setWhereChecked(true)} className="rounded-xl bg-[#173b68] px-6 py-3 font-bold text-white enabled:hover:bg-[#102d51] disabled:opacity-40">Check the places</button>
          ) : (
            <>
              <p className="text-lg font-bold text-slate-950">{wherePoints} of {picked.length} in the right place.</p>
              <button type="button" onClick={() => setPhase('order')} className="rounded-xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800">Next: put them in order →</button>
            </>
          )}
        </div>
      )}

      {phase !== 'where' && (
        <ol className="space-y-2">
          {order.map((slug, i) => {
            const e = byslug.get(slug)!
            const right = phase === 'done' && slug === correctOrder[i]
            const wrong = phase === 'done' && slug !== correctOrder[i]
            return (
              <li key={slug} className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${right ? 'kids-pop border-green-500 bg-green-50' : wrong ? 'kids-wiggle border-rose-400 bg-rose-50' : 'border-[#d7c5ad] bg-white'}`}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fbf6ec] font-bold text-slate-900">{i + 1}</span>
                <span className="flex-1 font-semibold text-slate-950">{e.name}<span className="block text-sm font-normal text-slate-700">{placeName(e.placeId)}</span></span>
                {phase === 'order' && (
                  <span className="flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="reading-action" aria-label={`Move ${e.name} earlier`}>↑</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1} className="reading-action" aria-label={`Move ${e.name} later`}>↓</button>
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      )}
      {phase === 'order' && (
        <div className="mt-5"><button type="button" onClick={() => setPhase('done')} className="rounded-xl bg-[#173b68] px-6 py-3 font-bold text-white hover:bg-[#102d51]">Check the order</button></div>
      )}
      {phase === 'done' && (
        <div className="mt-5 flex flex-wrap items-center gap-4" role="status">
          <p className="text-lg font-bold text-slate-950">Places: {wherePoints}/{picked.length} · Order: {orderPoints}/{picked.length} {wherePoints + orderPoints === picked.length * 2 ? '🌟' : ''}</p>
          <button type="button" onClick={newRound} className="rounded-xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800">New round</button>
        </div>
      )}
    </div>
  )
}
