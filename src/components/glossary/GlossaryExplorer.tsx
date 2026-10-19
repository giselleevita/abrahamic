'use client'
import { useState } from 'react'
import Link from 'next/link'
import { GLOSSARY, termAnchor } from '@/lib/glossary'
const destinations: Record<string, [string, string]> = {
  'Concept categories': ['/concepts', 'Explore concepts'],
  'Timeline presence states': ['/timeline', 'Explore the timeline'],
  'Scripture & tradition': ['/sources', 'Explore source texts'],
  'Interpretive terms': ['/editorial-method', 'Read our editorial method'],
  'Cross-reference link types': ['/comparisons', 'Explore comparisons'],
  'Key theological concepts': ['/learn', 'Explore guided learning'],
}
export function GlossaryExplorer() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const sections = GLOSSARY.filter((section) => !category || section.title === category).map((section) => ({ ...section, entries: section.entries.filter((entry) => `${entry.term} ${entry.definition}`.toLowerCase().includes(query.trim().toLowerCase())) })).filter((section) => section.entries.length)
  return <>
    <div className="mb-8 rounded-2xl border border-primary-200 bg-white/80 p-5"><label className="text-sm font-semibold" htmlFor="glossary-filter">Find a term</label><input id="glossary-filter" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try covenant or interpretation" className="editorial-control mt-2 w-full px-4 py-3" /><nav aria-label="Glossary categories" className="mt-4 flex flex-wrap gap-2"><button className="reading-action" aria-pressed={!category} onClick={() => setCategory('')}>All categories</button>{GLOSSARY.map((section) => <button key={section.title} className="reading-action" aria-pressed={category === section.title} onClick={() => setCategory(section.title)}>{section.title}</button>)}</nav><p role="status" className="mt-4 text-sm text-primary-700">{sections.reduce((sum, section) => sum + section.entries.length, 0)} terms</p>{(query || category) && <button className="reading-action mt-3" onClick={() => { setQuery(''); setCategory('') }}>Reset glossary</button>}</div>
    <div className="space-y-10">{sections.map((section) => <section key={section.title}><h2 className="mb-5 border-b border-primary-200 pb-3 font-serif text-2xl text-primary-950">{section.title}</h2><dl className="space-y-4">{section.entries.map((entry) => <div className="scroll-mt-28 rounded-xl border border-primary-100 bg-white/60 p-5" key={entry.term} id={termAnchor(entry.term)}><dt className="font-serif text-xl font-semibold text-primary-950"><a href={`#${termAnchor(entry.term)}`} className="underline decoration-gold-400 underline-offset-4">{entry.term}</a></dt><dd className="mt-3 leading-relaxed text-primary-800">{entry.definition}{entry.note && <p className="mt-3 text-sm text-primary-700">Note: {entry.note}</p>}<Link href={destinations[section.title][0]} className="mt-3 inline-block py-2 text-sm underline">{destinations[section.title][1]} →</Link></dd></div>)}</dl></section>)}</div>
    {!sections.length && <p className="rounded-xl border border-primary-200 p-6">No terms match. Try a shorter word or reset the glossary.</p>}
  </>
}
