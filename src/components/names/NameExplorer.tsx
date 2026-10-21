'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { TRADITION_LABEL } from '@/lib/constants'
import type { Tradition } from '@/generated/prisma/client'

type Person = {
  slug: string
  name: string
  aliases: { tradition: Tradition; name: string; notes: string | null }[]
}

const TRADITIONS: Tradition[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC']
const TRY = ['Ibrahim', 'Musa', 'Isa', 'Maryam', 'Yunus', 'Idris']

/** Remove accents and punctuation so "Ya'qub" and "Yaqub" find each other. */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N} ]/gu, '').toLowerCase()

export function NameExplorer({ people }: { people: Person[] }) {
  const [query, setQuery] = useState('')
  const q = fold(query.trim())
  const matches = useMemo(() => {
    if (!q) return []
    return people.filter((p) => [p.name, ...p.aliases.map((a) => a.name)].some((n) => fold(n).includes(q)))
  }, [people, q])

  return (
    <div>
      <label htmlFor="name-search" className="block text-lg font-semibold text-slate-950">Type any name</label>
      <input
        id="name-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Try Moses, Musa or Moshe"
        className="editorial-control mt-2 w-full px-4 py-3 text-lg"
        autoComplete="off"
      />
      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700">
        <span>Or try:</span>
        {TRY.map((n) => (
          <button key={n} type="button" onClick={() => setQuery(n)} className="rounded-full border border-[#d7c5ad] bg-white px-3 py-1 font-semibold text-[#173b68] hover:border-[#b7791f]">{n}</button>
        ))}
      </p>

      <div role="status" className="mt-6">
        {q && matches.length === 0 && <p className="rounded-2xl border border-[#d7c5ad] bg-white p-5 text-slate-800">No one on the site has a name like “{query}”. Try another spelling.</p>}
        {matches.map((p) => (
          <section key={p.slug} className="mb-5 rounded-3xl border border-[#d7c5ad] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl text-slate-950">{p.name}</h2>
              <Link href={`/figures/${p.slug}`} className="text-sm font-bold text-[#173b68] hover:underline">Read the full page →</Link>
            </div>
            <ul className="mt-4 grid gap-3 md:grid-cols-3">
              {TRADITIONS.map((t) => {
                const a = p.aliases.find((x) => x.tradition === t)
                return (
                  <li key={t} className="rounded-2xl border border-[#d7c5ad] bg-[#fbf6ec] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#80571b]">{TRADITION_LABEL[t]}</p>
                    {a ? (
                      <>
                        <p className={`mt-1 text-lg font-bold ${fold(a.name).includes(q) ? 'text-[#b7791f]' : 'text-slate-950'}`}>{a.name}</p>
                        {a.notes && <p className="mt-1 text-sm leading-6 text-slate-700">{a.notes}</p>}
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-slate-600">No separate entry yet.</p>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
