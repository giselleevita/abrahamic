'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Concept, ConceptTradition, ConceptCategory, Tradition } from '@prisma/client'

type ConceptWithTraditions = Concept & { traditions: ConceptTradition[] }

interface Props { initialData?: ConceptWithTraditions }

const CATEGORIES: ConceptCategory[] = ['THEOLOGY','SOTERIOLOGY','ESCHATOLOGY','PROPHETHOOD','PRACTICE','LAW','COSMOLOGY']
const TRADITIONS: Tradition[] = ['JEWISH','CHRISTIAN','ISLAMIC']
const CATEGORY_LABEL: Record<ConceptCategory, string> = {
  THEOLOGY: 'Theology', SOTERIOLOGY: 'Soteriology', ESCHATOLOGY: 'Eschatology',
  PROPHETHOOD: 'Prophethood', PRACTICE: 'Practice', LAW: 'Law & Covenant', COSMOLOGY: 'Cosmology',
}
const TRADITION_LABEL: Partial<Record<Tradition, string>> = {
  JEWISH: 'Judaism', CHRISTIAN: 'Christianity', ISLAMIC: 'Islam',
}

type TradRow = { tradition: Tradition; definition: string; nuances: string }

function defaultTraditions(existing: ConceptTradition[]): TradRow[] {
  return TRADITIONS.map((t) => {
    const e = existing.find((tr) => tr.tradition === t)
    return { tradition: t, definition: e?.definition ?? '', nuances: e?.nuances ?? '' }
  })
}

export function ConceptForm({ initialData }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(initialData?.name ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [category, setCategory] = useState<ConceptCategory>(initialData?.category ?? 'THEOLOGY')
  const [summary, setSummary] = useState(initialData?.summary ?? '')
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [traditions, setTraditions] = useState<TradRow[]>(
    defaultTraditions(initialData?.traditions ?? [])
  )

  function autoSlug() {
    if (!slug) setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  function updateTradition(i: number, field: 'definition' | 'nuances', value: string) {
    setTraditions(traditions.map((t, idx) => idx === i ? { ...t, [field]: value } : t))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')

    const payload = {
      name, slug, category,
      summary: summary || undefined,
      isPublished,
      traditions: traditions.filter((t) => t.definition.trim()).map((t) => ({
        tradition: t.tradition,
        definition: t.definition.trim(),
        nuances: t.nuances.trim() || undefined,
      })),
    }

    const url = initialData ? `/api/concepts/${initialData.slug}` : '/api/concepts'
    const method = initialData ? 'PATCH' : 'POST'

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setLoading(false)
    if (!res.ok) { const d = await res.json(); setError(JSON.stringify(d.error)); return }
    router.push('/admin/concepts'); router.refresh()
  }

  async function handleDelete() {
    if (!initialData || !confirm(`Delete "${initialData.name}"?`)) return
    await fetch(`/api/concepts/${initialData.slug}`, { method: 'DELETE' })
    router.push('/admin/concepts'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-700">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} onBlur={autoSlug} required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none" placeholder="Original Sin" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Slug *</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required pattern="[a-z0-9-]+"
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-mono focus:outline-none" placeholder="original-sin" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Category *</label>
        <select value={category} onChange={(e) => setCategory(e.target.value as ConceptCategory)}
          className="mt-1 rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none">
          {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Summary</label>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none"
          placeholder="Neutral 1-2 sentence overview…" />
      </div>

      {/* Tradition definitions */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-stone-700">Tradition definitions</label>
        {traditions.map((trad, i) => (
          <div key={trad.tradition} className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3">
            <p className="text-sm font-semibold text-stone-700">{TRADITION_LABEL[trad.tradition]}</p>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Definition *</label>
              <textarea value={trad.definition} onChange={(e) => updateTradition(i, 'definition', e.target.value)}
                rows={4} className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:outline-none"
                placeholder={`How ${TRADITION_LABEL[trad.tradition]} understands this concept…`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Nuances / internal diversity</label>
              <textarea value={trad.nuances} onChange={(e) => updateTradition(i, 'nuances', e.target.value)}
                rows={2} className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:outline-none"
                placeholder="Minority positions, denominations, historical debates…" />
            </div>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded border-stone-300" />
        <span className="text-sm font-medium text-stone-700">Published</span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 transition-colors">
          {loading ? 'Saving…' : initialData ? 'Update Concept' : 'Create Concept'}
        </button>
        {initialData && (
          <button type="button" onClick={handleDelete}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
