'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ConceptCategory, Tradition } from '@prisma/client'

type TradRow = { tradition: Tradition; definition: string }
type ConceptItem = {
  id: number
  slug: string
  name: string
  category: ConceptCategory
  summary: string | null
  traditions: TradRow[]
}

const CATEGORY_ORDER: ConceptCategory[] = [
  'THEOLOGY', 'SOTERIOLOGY', 'ESCHATOLOGY', 'PROPHETHOOD', 'PRACTICE', 'LAW', 'COSMOLOGY',
]

const CATEGORY_LABEL: Record<ConceptCategory, string> = {
  THEOLOGY: 'Theology',
  SOTERIOLOGY: 'Salvation',
  ESCHATOLOGY: 'Afterlife',
  PROPHETHOOD: 'Prophethood',
  PRACTICE: 'Practice',
  LAW: 'Law & Covenant',
  COSMOLOGY: 'Cosmology',
}

const TRAD_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  JEWISH:    { label: 'Jewish',    dot: 'bg-blue-500',  text: 'text-blue-700',  bg: 'bg-blue-50' },
  CHRISTIAN: { label: 'Christian', dot: 'bg-red-600',   text: 'text-red-700',   bg: 'bg-red-50' },
  ISLAMIC:   { label: 'Islamic',   dot: 'bg-green-600', text: 'text-green-700', bg: 'bg-green-50' },
}

const TRADITIONS: Tradition[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC']

export function ConceptFilter({ concepts }: { concepts: ConceptItem[] }) {
  const [active, setActive] = useState<ConceptCategory | 'ALL'>('ALL')

  const presentCategories = CATEGORY_ORDER.filter((cat) =>
    concepts.some((c) => c.category === cat)
  )

  const filtered = active === 'ALL' ? concepts : concepts.filter((c) => c.category === active)

  const groups =
    active === 'ALL'
      ? CATEGORY_ORDER.map((cat) => ({
          cat,
          items: filtered.filter((c) => c.category === cat),
        })).filter((g) => g.items.length > 0)
      : [{ cat: active, items: filtered }]

  return (
    <div>
      {/* Category filter bar */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActive('ALL')}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
            active === 'ALL'
              ? 'border-stone-800 bg-stone-900 text-white shadow-sm'
              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-800'
          }`}
        >
          All <span className="ml-1 opacity-60">{concepts.length}</span>
        </button>
        {presentCategories.map((cat) => {
          const count = concepts.filter((c) => c.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                active === cat
                  ? 'border-stone-800 bg-stone-900 text-white shadow-sm'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-800'
              }`}
            >
              {CATEGORY_LABEL[cat]} <span className="ml-1 opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Results */}
      <div className="space-y-10">
        {groups.map(({ cat, items }) => (
          <section key={cat}>
            {active === 'ALL' && (
              <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
                <span className="h-px flex-1 bg-stone-100" />
                {CATEGORY_LABEL[cat]}
                <span className="h-px flex-1 bg-stone-100" />
              </h2>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((concept) => (
                <ConceptCard key={concept.id} concept={concept} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function ConceptCard({ concept }: { concept: ConceptItem }) {
  return (
    <Link
      href={`/concepts/${concept.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
    >
      {/* Top accent: three tradition colors */}
      <div className="flex h-1">
        <div className="flex-1 bg-blue-500" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-green-600" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-auto">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-stone-900 group-hover:text-stone-700">
              {concept.name}
            </h3>
            <span className="flex-shrink-0 rounded-full border border-stone-100 bg-stone-50 px-2 py-0.5 text-[10px] font-medium text-stone-400">
              {CATEGORY_LABEL[concept.category]}
            </span>
          </div>
          {concept.summary && (
            <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">
              {concept.summary}
            </p>
          )}
        </div>

        {/* Tradition mini-previews */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-stone-100 pt-4">
          {TRADITIONS.map((t) => {
            const trad = concept.traditions.find((tr) => tr.tradition === t)
            const cfg = TRAD_CONFIG[t]
            return (
              <div key={t} className={`rounded-lg p-2 ${trad ? cfg.bg : 'bg-stone-50'}`}>
                <div className="mb-1 flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${trad ? cfg.dot : 'bg-stone-300'}`} />
                  <span className={`text-[9px] font-bold uppercase tracking-wide ${trad ? cfg.text : 'text-stone-300'}`}>
                    {cfg.label}
                  </span>
                </div>
                {trad ? (
                  <p className="text-[10px] leading-snug text-stone-600 line-clamp-3">
                    {trad.definition.slice(0, 90)}{trad.definition.length > 90 ? '…' : ''}
                  </p>
                ) : (
                  <p className="text-[10px] italic text-stone-300">No entry</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Link>
  )
}
