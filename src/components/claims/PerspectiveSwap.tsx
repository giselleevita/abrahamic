'use client'

import { useMemo, useState } from 'react'
import { diffWords } from '@/lib/word-diff'
import { TRADITION_LABEL } from '@/lib/constants'
import type { Tradition } from '@/generated/prisma/client'

export type SwapView = { tradition: Tradition; statement: string; source: string }

/**
 * Two versions side by side. "Highlight" marks words found in only one
 * version; "Challenge" hides the marks and asks the reader to tap the words
 * they think differ. Marks mean "absent from the other version", not
 * "disagrees", and the page says so.
 */
export function PerspectiveSwap({ views }: { views: SwapView[] }) {
  const traditions = [...new Set(views.map((v) => v.tradition))]
  const [aT, setA] = useState<Tradition>(traditions[0])
  const [bT, setB] = useState<Tradition>(traditions[1] ?? traditions[0])
  const [mode, setMode] = useState<'highlight' | 'challenge'>('highlight')
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const [checked, setChecked] = useState(false)

  const a = views.find((v) => v.tradition === aT)!
  const b = views.find((v) => v.tradition === bT)!
  const diff = useMemo(() => diffWords(a.statement, b.statement), [a, b])
  const target = diff.b.map((w, i) => (!w.shared ? i : -1)).filter((i) => i >= 0)
  const hits = target.filter((i) => picked.has(i)).length
  const wrongPicks = [...picked].filter((i) => diff.b[i].shared).length

  function reset() { setPicked(new Set()); setChecked(false) }
  function swap() { setA(bT); setB(aT); reset() }
  function toggle(i: number) {
    if (checked) return
    const next = new Set(picked)
    if (next.has(i)) next.delete(i); else next.add(i)
    setPicked(next)
  }

  const select = (value: Tradition, onChange: (t: Tradition) => void, label: string) => (
    <label className="text-sm font-semibold text-slate-800">{label}
      <select value={value} onChange={(e) => { onChange(e.target.value as Tradition); reset() }} className="editorial-control ml-2 px-3 py-2">
        {traditions.map((t) => <option key={t} value={t}>{TRADITION_LABEL[t]}</option>)}
      </select>
    </label>
  )

  return (
    <section aria-labelledby="swap-title" className="mt-10 rounded-3xl border border-[#d7c5ad] bg-white p-5 sm:p-7">
      <h2 id="swap-title" className="font-serif text-2xl text-slate-950">Compare two versions closely</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
        Pick two traditions. Words found in only one of the versions are marked. A marked word does not mean
        the traditions disagree, only that you should read that part closely.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {select(aT, setA, 'Left')}
        <button type="button" onClick={swap} className="reading-action" aria-label="Swap the two traditions">⇄ Swap</button>
        {select(bT, setB, 'Right')}
        <div role="group" aria-label="Mode" className="ml-auto flex gap-2">
          {(['highlight', 'challenge'] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => { setMode(m); reset() }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${mode === m ? 'border-[#b7791f] bg-[#fbf6ec]' : 'border-[#d7c5ad] bg-white hover:border-[#b7791f]'}`}>
              {m === 'highlight' ? 'Highlight differences' : 'Spot the difference'}
            </button>
          ))}
        </div>
      </div>

      {aT === bT ? (
        <p className="mt-5 rounded-2xl bg-[#fbf6ec] p-4 text-slate-800">Choose two different traditions to compare.</p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[#d7c5ad] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#80571b]">{TRADITION_LABEL[aT]} · {a.source}</p>
            <p className="mt-2 text-lg leading-8 text-slate-900">
              {diff.a.map((w, i) => (
                <span key={i}>{mode === 'highlight' && !w.shared ? <mark className="rounded bg-amber-200 px-0.5">{w.text}</mark> : w.text}{' '}</span>
              ))}
            </p>
          </article>
          <article className="rounded-2xl border border-[#d7c5ad] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#80571b]">{TRADITION_LABEL[bT]} · {b.source}</p>
            <p className="mt-2 text-lg leading-8 text-slate-900">
              {diff.b.map((w, i) => {
                if (mode === 'highlight') return <span key={i}>{!w.shared ? <mark className="rounded bg-amber-200 px-0.5">{w.text}</mark> : w.text}{' '}</span>
                const on = picked.has(i)
                const cls = checked
                  ? !w.shared ? (on ? 'bg-green-200' : 'bg-amber-200 ring-2 ring-amber-500') : on ? 'bg-rose-200 line-through' : ''
                  : on ? 'bg-sky-200' : 'hover:bg-slate-100'
                return (
                  <span key={i}>
                    <button type="button" aria-pressed={on} onClick={() => toggle(i)} className={`rounded px-0.5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#b7791f] ${cls}`}>{w.text}</button>{' '}
                  </span>
                )
              })}
            </p>
          </article>
        </div>
      )}

      {mode === 'challenge' && aT !== bT && (
        <div className="mt-4 flex flex-wrap items-center gap-4" role="status">
          {!checked ? (
            <>
              <p className="text-sm text-slate-700">Tap the words in the right-hand version that you think are not in the left-hand one.</p>
              <button type="button" onClick={() => setChecked(true)} className="rounded-xl bg-[#173b68] px-5 py-2 font-bold text-white hover:bg-[#102d51]">Check my answer</button>
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-900">You found {hits} of {target.length} unshared words{wrongPicks > 0 ? `, and tapped ${wrongPicks} shared word${wrongPicks === 1 ? '' : 's'}` : ''}.</p>
              <button type="button" onClick={reset} className="reading-action">Try again</button>
            </>
          )}
        </div>
      )}
    </section>
  )
}
