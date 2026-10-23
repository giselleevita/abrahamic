'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { lineageIds, type LineageEdge } from '@/lib/family-lineage'
import { SEARCH_TRADITIONS } from '@/lib/search-options'
import { verseReaderHref } from '@/lib/verse-links'

type Figure = { id: number; canonicalName: string; slug: string; aliases: { name: string; tradition: string }[] }
type Edge = LineageEdge & { id: number; notes: string | null; source: { slug: string; title: string; tradition: string } | null; verse: { book: string; chapter: number; verse: number; versification: string } | null }
const RELATION = { PARENT: 'is a parent of', CHILD: 'is a child of', SPOUSE: 'is a spouse of', SIBLING: 'is a sibling of', DESCENDANT: 'is an ancestor of' } as Record<string, string>
export function FamilyExplorer({ figures, edges }: { figures: Figure[]; edges: Edge[] }) {
  const [query, setQuery] = useState('')
  const [tradition, setTradition] = useState('')
  const [focus, setFocus] = useState<number | null>(null)
  const scopedEdges = useMemo(() => edges.filter((edge) => !tradition || edge.source?.tradition === tradition), [edges, tradition])
  const lineage = useMemo(() => focus ? lineageIds(focus, scopedEdges) : null, [focus, scopedEdges])
  const available = figures.filter((figure) => (!tradition || figure.aliases.some((alias) => alias.tradition === tradition)) && (!lineage || lineage.has(figure.id)))
  const shown = available.filter((figure) => [figure.canonicalName, ...figure.aliases.map((alias) => alias.name)].some((name) => name.toLowerCase().includes(query.toLowerCase())))
  const names = new Map(figures.map((figure) => [figure.id, figure.canonicalName]))
  const visibleIds = new Set(available.map((figure) => figure.id))
  const relationships = scopedEdges.filter((edge) => visibleIds.has(edge.fromFigureId) && visibleIds.has(edge.toFigureId))
  return <div className="space-y-8">
    <div className="rounded-2xl border border-primary-200 bg-white/80 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Find a figure<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="editorial-control mt-2 w-full px-4 py-3" placeholder="Name or recorded alias" /></label>
        <label className="text-sm font-medium">Tradition<select aria-label="Tradition" value={tradition} onChange={(event) => { setTradition(event.target.value); setFocus(null) }} className="editorial-control mt-2 w-full px-4 py-3"><option value="">All traditions</option>{Object.entries(SEARCH_TRADITIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div>
      <div className="mt-4 flex flex-wrap items-center gap-3"><button className="reading-action" onClick={() => { setQuery(''); setTradition(''); setFocus(null) }}>Reset exploration</button><p role="status" aria-label="Family exploration results" className="text-sm text-primary-700">{shown.length} figures{focus ? ` · Lineage of ${names.get(focus)}` : ''}</p></div>
    </div>
    <section aria-label="Choose a lineage"><h2 className="mb-4 font-serif text-2xl text-primary-950">{focus ? 'A focused lineage' : 'Follow a family connection'}</h2><p className="mb-4 text-sm text-primary-700">Choose a figure to trace ancestors and descendants. Relationships below retain their recorded sources.</p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{shown.map((figure) => <li key={figure.id} className={`rounded-xl border p-4 ${focus === figure.id ? 'border-gold-600 bg-gold-50' : 'border-primary-200 bg-white'}`}><button aria-pressed={focus === figure.id} className="min-h-11 text-left font-serif text-xl text-primary-950 underline decoration-gold-400 underline-offset-4" onClick={() => { setFocus(figure.id); setQuery('') }}>{figure.canonicalName}</button><p className="mt-1 text-xs text-primary-700">{[...new Set(figure.aliases.map((alias) => SEARCH_TRADITIONS[alias.tradition as keyof typeof SEARCH_TRADITIONS]))].join(' · ')}</p><Link href={`/figures/${figure.slug}`} className="mt-3 inline-block py-2 text-sm underline">Explore figure →</Link></li>)}</ul>
      {!shown.length && <p className="rounded-xl border border-primary-200 p-5">No figures match. Try another name or reset the exploration.</p>}
    </section>
    <section aria-labelledby="relationships"><h2 id="relationships" className="mb-4 font-serif text-2xl text-primary-950">Recorded relationships</h2><ul className="space-y-3">{relationships.map((edge) => <li key={edge.id} className="rounded-xl border border-primary-200 bg-white/70 p-5"><p><strong>{names.get(edge.fromFigureId)}</strong> {edge.notes && edge.relationType !== 'PARENT' ? '→' : (RELATION[edge.relationType] ?? '→')} <strong>{names.get(edge.toFigureId)}</strong></p>{edge.notes && <p className="mt-2 text-sm text-primary-700">Project relationship note: {edge.notes}</p>}<p className="mt-3 text-sm">{edge.source ? <>{SEARCH_TRADITIONS[edge.source.tradition as keyof typeof SEARCH_TRADITIONS]} source: <Link className="underline" href={edge.verse ? verseReaderHref(edge.source.slug, edge.verse) : `/sources/${edge.source.slug}`}>{edge.source.title}{edge.verse ? ` · ${edge.verse.book} ${edge.verse.chapter}:${edge.verse.verse}` : ''}</Link></> : 'Source reference not attached.'}</p></li>)}</ul>{!relationships.length && <p className="text-primary-700">No sourced relationships are recorded for this selection.</p>}</section>
  </div>
}
