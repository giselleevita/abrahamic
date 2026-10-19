'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { SEARCH_SOURCES, SEARCH_TRADITIONS, SEARCH_TYPES, searchOptions } from '@/lib/search-options'

export function SearchFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const filters = searchOptions(Object.fromEntries(params))
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value); else next.delete(key)
    router.push(`/search?${next}`)
  }
  return <fieldset className="mb-8 rounded-2xl border border-primary-200 bg-white/70 p-4">
    <legend className="px-2 text-sm font-semibold text-primary-800">Refine your exploration</legend>
    <div className="grid gap-4 sm:grid-cols-3">
      {([['tradition', 'Tradition', SEARCH_TRADITIONS], ['type', 'Result type', SEARCH_TYPES], ['source', 'Source', SEARCH_SOURCES]] as const).map(([key, label, choices]) => <label key={key} className="text-sm text-primary-800">{label}
        <select aria-label={label} value={filters[key] ?? ''} onChange={(event) => update(key, event.target.value)} className="editorial-control mt-1 w-full px-3 py-3"><option value="">All {label === 'Result type' ? 'types' : label.toLowerCase() + 's'}</option>{Object.entries(choices).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select>
      </label>)}
    </div>
    <div className="mt-3 flex flex-wrap gap-2">{Object.entries(filters).map(([key]) => <button key={key} type="button" className="reading-action" onClick={() => update(key, '')}>Clear {key === 'type' ? 'result type' : key} ×</button>)}</div>
  </fieldset>
}
