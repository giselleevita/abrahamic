'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TRADITION_LABEL } from '@/lib/constants'
import { summarisePair, type CPClaim, type CPComparison, type CPEvent, type CPFigure } from '@/lib/compare-people'
import type { Tradition } from '@/generated/prisma/client'

type Props = { figures: CPFigure[]; events: CPEvent[]; claims: CPClaim[]; comparisons: CPComparison[]; initialA?: string; initialB?: string }

export function ComparePeople({ figures, events, claims, comparisons, initialA, initialB }: Props) {
  const [aSlug, setA] = useState(initialA ?? 'moses')
  const [bSlug, setB] = useState(initialB ?? 'muhammad')
  const a = figures.find((f) => f.slug === aSlug) ?? figures[0]
  const b = figures.find((f) => f.slug === bSlug) ?? figures[1]
  const same = a.id === b.id
  const s = same ? null : summarisePair(a, b, events, claims, comparisons)

  const pick = (value: string, onChange: (v: string) => void, label: string) => (
    <label className="block text-sm font-semibold text-slate-800">{label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="editorial-control mt-1 w-full px-3 py-3 text-base">
        {figures.map((f) => <option key={f.id} value={f.slug}>{f.name}</option>)}
      </select>
    </label>
  )
  const names = (f: CPFigure) =>
    (['JEWISH', 'CHRISTIAN', 'ISLAMIC'] as Tradition[]).map((t) => (
      <li key={t} className="flex justify-between gap-3 border-b border-[#eadfca] py-1 text-sm last:border-0">
        <span className="text-slate-600">{TRADITION_LABEL[t]}</span>
        <span className="font-semibold text-slate-950">{f.aliases.find((x) => x.tradition === t)?.name ?? '—'}</span>
      </li>
    ))

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        {pick(aSlug, setA, 'First person')}
        <button type="button" onClick={() => { setA(bSlug); setB(aSlug) }} className="reading-action justify-self-center" aria-label="Swap the two people">⇄</button>
        {pick(bSlug, setB, 'Second person')}
      </div>

      {same ? (
        <p className="mt-6 rounded-2xl border border-[#d7c5ad] bg-white p-5">Choose two different people.</p>
      ) : (
        <div role="status" className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            {[a, b].map((f) => (
              <section key={f.id} className="rounded-3xl border border-[#d7c5ad] bg-white p-5">
                <h2 className="font-serif text-2xl text-slate-950"><Link href={`/figures/${f.slug}`} className="hover:underline">{f.name}</Link></h2>
                <ul className="mt-3">{names(f)}</ul>
              </section>
            ))}
          </div>

          <section className="rounded-3xl border-2 border-[#b7791f] bg-[#fbf6ec] p-5 sm:p-6">
            <h2 className="font-serif text-2xl text-slate-950">What {a.name} and {b.name} share</h2>
            {s!.sharedEvents.length + s!.sharedComparisons.length + s!.sharedThemes.length + s!.nameOverlap.length === 0 ? (
              <p className="mt-3 text-slate-800">The site does not record a direct link between them yet. That does not mean there is none. Try the timeline or the family tree.</p>
            ) : (
              <div className="mt-3 grid gap-5 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#80571b]">Events they both appear in</h3>
                  <ul className="mt-2 space-y-1 text-sm">{s!.sharedEvents.length ? s!.sharedEvents.map((e) => <li key={e.slug}><Link className="font-semibold text-[#173b68] hover:underline" href={`/timeline#${e.slug}`}>{e.name} →</Link></li>) : <li className="text-slate-600">None recorded</li>}</ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#80571b]">Comparisons about both</h3>
                  <ul className="mt-2 space-y-1 text-sm">{s!.sharedComparisons.length ? s!.sharedComparisons.map((c) => <li key={c.id}><Link className="font-semibold text-[#173b68] hover:underline" href={`/comparisons/${c.id}`}>{c.title} →</Link></li>) : <li className="text-slate-600">None recorded</li>}</ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#80571b]">Themes in common</h3>
                  <p className="mt-2 flex flex-wrap gap-2 text-sm">{s!.sharedThemes.length ? s!.sharedThemes.map((t) => <span key={t} className="rounded-full bg-white px-3 py-1 font-semibold">{t}</span>) : <span className="text-slate-600">None recorded</span>}</p>
                </div>
              </div>
            )}
            {s!.nameOverlap.length > 0 && <p className="mt-4 text-sm font-semibold text-slate-900">They share a name: {s!.nameOverlap.join(', ')}.</p>}
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {[{ f: a, t: s!.onlyA.themes }, { f: b, t: s!.onlyB.themes }].map(({ f, t }) => (
              <div key={f.id} className="rounded-3xl border border-[#d7c5ad] bg-white p-5">
                <h3 className="font-serif text-xl text-slate-950">Only {f.name}</h3>
                <p className="mt-2 flex flex-wrap gap-2 text-sm">{t.length ? t.map((x) => <span key={x} className="rounded-full bg-[#fbf6ec] px-3 py-1 font-semibold">{x}</span>) : <span className="text-slate-600">No themes of their own recorded.</span>}</p>
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  )
}
