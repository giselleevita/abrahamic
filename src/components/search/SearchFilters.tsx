'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const TRADITION_OPTIONS = ['JEWISH', 'CHRISTIAN', 'ISLAMIC', 'SHARED'] as const
const SOURCE_OPTIONS = ['TORAH', 'HEBREW_BIBLE', 'NEW_TESTAMENT', 'QURAN'] as const
const CATEGORY_OPTIONS = [
  'THEOLOGY', 'SOTERIOLOGY', 'ESCHATOLOGY', 'PROPHETHOOD', 'PRACTICE', 'LAW', 'COSMOLOGY'
] as const

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const tradition = searchParams.get('tradition') || ''
  const source = searchParams.get('source') || ''
  const category = searchParams.get('category') || ''

  const updateSearch = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="mb-8 space-y-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
      <h3 className="text-sm font-semibold text-stone-900">Filters</h3>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={tradition}
          onChange={(e) => updateSearch({ tradition: e.target.value, source, category })}
          className="rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
        >
          <option value="">All Traditions</option>
          {TRADITION_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={source}
          onChange={(e) => updateSearch({ tradition, source: e.target.value, category })}
          className="rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
        >
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => updateSearch({ tradition, source, category: e.target.value })}
          className="rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
        >
          <option value="">All Categories</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {(tradition || source || category) && (
          <button
            onClick={() => router.push(`/search?q=${q}`)}
            className="rounded border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
