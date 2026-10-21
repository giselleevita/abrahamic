'use client'

import { useMemo, useState } from 'react'
import { TRADITION_LABEL } from '@/lib/constants'
import { pickRound } from '@/lib/evidence-round'

type T = 'JEWISH' | 'CHRISTIAN' | 'ISLAMIC'
export type EvidenceClaim = { id: number; statement: string; tradition: T; source: string }

const COLUMNS: T[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC']

export function EvidenceBoard({ pool }: { pool: EvidenceClaim[] }) {
  const [round, setRound] = useState(0)
  const cards = useMemo(() => pickRound(pool, round), [pool, round])
  const [placed, setPlaced] = useState<Record<number, T>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)

  if (cards.length < 3) return <p className="rounded-2xl border border-[#d7c5ad] bg-white p-6">There are not enough statements to play yet.</p>

  const unplaced = cards.filter((c) => !placed[c.id])
  const score = cards.filter((c) => placed[c.id] === c.tradition).length

  function place(id: number, col: T) {
    if (checked) return
    setPlaced((p) => ({ ...p, [id]: col }))
    setSelected(null)
  }
  function unplace(id: number) {
    if (checked) return
    setPlaced((p) => { const n = { ...p }; delete n[id]; return n })
  }
  function again() { setRound((r) => r + 1); setPlaced({}); setSelected(null); setChecked(false) }

  const card = (c: EvidenceClaim, inColumn: boolean) => {
    const right = checked && placed[c.id] === c.tradition
    const wrong = checked && placed[c.id] && placed[c.id] !== c.tradition
    return (
      <li key={c.id}>
        <button
          type="button"
          draggable={!checked}
          onDragStart={(e) => { e.dataTransfer.setData('text/plain', String(c.id)); setSelected(c.id) }}
          onClick={() => (inColumn ? unplace(c.id) : setSelected(selected === c.id ? null : c.id))}
          aria-pressed={selected === c.id}
          className={`w-full rounded-2xl border-2 p-4 text-left text-base leading-7 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f] ${
            right ? 'kids-pop border-green-500 bg-green-50' : wrong ? 'kids-wiggle border-rose-400 bg-rose-50' : selected === c.id ? 'border-[#b7791f] bg-[#fbf6ec]' : 'border-[#d7c5ad] bg-white hover:border-[#b7791f]'
          }`}
        >
          {c.statement}
          {checked && <span className="mt-2 block text-sm font-semibold text-slate-800">From: {TRADITION_LABEL[c.tradition]} · {c.source}{right ? ' ✓' : ''}</span>}
          {!checked && inColumn && <span className="mt-1 block text-xs text-slate-600">Select to take it back</span>}
        </button>
      </li>
    )
  }

  return (
    <div>
      <section aria-labelledby="deck-title">
        <h2 id="deck-title" className="font-serif text-xl text-slate-950">Statements to place ({unplaced.length} left)</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">{unplaced.map((c) => card(c, false))}</ul>
        {unplaced.length === 0 && !checked && <p className="mt-3 text-slate-700">All placed. Press Check to see the sources.</p>}
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => (
          <section
            key={col}
            aria-label={`${TRADITION_LABEL[col]} column`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const id = Number(e.dataTransfer.getData('text/plain')); if (id) place(id, col) }}
            className="rounded-3xl border-2 border-dashed border-[#c9b48d] bg-[#fbf6ec] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-serif text-xl text-slate-950">{TRADITION_LABEL[col]}</h3>
              <button type="button" disabled={selected === null || checked} onClick={() => selected !== null && place(selected, col)} className="rounded-full border border-[#d7c5ad] bg-white px-3 py-1 text-sm font-bold text-[#173b68] enabled:hover:border-[#b7791f] disabled:opacity-40">Place here</button>
            </div>
            <ul className="mt-3 space-y-3">{cards.filter((c) => placed[c.id] === col).map((c) => card(c, true))}</ul>
          </section>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4" role="status">
        {!checked ? (
          <button type="button" disabled={unplaced.length > 0} onClick={() => setChecked(true)} className="rounded-xl bg-[#173b68] px-6 py-3 text-lg font-bold text-white enabled:hover:bg-[#102d51] disabled:opacity-40">Check</button>
        ) : (
          <>
            <p className="text-lg font-bold text-slate-950">{score} of {cards.length} in the right column. {score === cards.length ? '🌟' : 'Each card above shows its source.'}</p>
            <button type="button" onClick={again} className="rounded-xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800">New round</button>
          </>
        )}
      </div>
    </div>
  )
}
