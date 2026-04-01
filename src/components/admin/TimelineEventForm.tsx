'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TimelineEvent, TimelineEventTradition, TimelineEra } from '@prisma/client'

type EventWithTraditions = TimelineEvent & { traditions: TimelineEventTradition[] }

interface Props { initialData?: EventWithTraditions }

const ERAS: TimelineEra[] = ['PRIMORDIAL','PATRIARCHAL','EXODUS','KINGDOM','GOSPEL','EARLY_ISLAM']
const ERA_LABEL: Record<TimelineEra, string> = {
  PRIMORDIAL: 'Primordial / Creation', PATRIARCHAL: 'Patriarchal Age', EXODUS: 'Exodus & Sinai',
  KINGDOM: 'Kingdom & Prophets', GOSPEL: 'Gospel Period', EARLY_ISLAM: 'Early Islam',
}

const TRADITIONS = ['JEWISH','CHRISTIAN','ISLAMIC','SHARED'] as const
type TraditionKey = typeof TRADITIONS[number]

const TRADITION_LABEL: Record<TraditionKey, string> = {
  JEWISH: 'Judaism', CHRISTIAN: 'Christianity', ISLAMIC: 'Islam', SHARED: 'Shared / All',
}

const PRESENCES = ['AFFIRMED','MODIFIED','SILENT','REJECTED'] as const
type PresenceKey = typeof PRESENCES[number]

const PRESENCE_LABEL: Record<PresenceKey, string> = {
  AFFIRMED: 'Affirmed', MODIFIED: 'Modified / Adapted', SILENT: 'Silent (no mention)', REJECTED: 'Rejected',
}

type TradRow = { tradition: TraditionKey; presence: PresenceKey; notes: string }

function defaultTraditions(existing: TimelineEventTradition[]): TradRow[] {
  return TRADITIONS.map((t) => {
    const e = existing.find((tr) => tr.tradition === t)
    return {
      tradition: t,
      presence: (e?.presence as PresenceKey) ?? 'SILENT',
      notes: e?.notes ?? '',
    }
  })
}

export function TimelineEventForm({ initialData }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(initialData?.name ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [era, setEra] = useState<TimelineEra>(initialData?.era ?? 'PRIMORDIAL')
  const [position, setPosition] = useState(initialData?.position ?? 0)
  const [summary, setSummary] = useState(initialData?.summary ?? '')
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [traditions, setTraditions] = useState<TradRow[]>(
    defaultTraditions(initialData?.traditions ?? [])
  )

  function autoSlug() {
    if (!slug) setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  function updateTrad(i: number, field: 'presence' | 'notes', value: string) {
    setTraditions(traditions.map((t, idx) => idx === i ? { ...t, [field]: value } : t))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')

    const payload = {
      name, slug, era,
      position: Number(position),
      summary: summary || undefined,
      isPublished,
      traditions: traditions.map((t) => ({
        tradition: t.tradition,
        presence: t.presence,
        notes: t.notes.trim() || undefined,
      })),
    }

    const url = initialData ? `/api/timeline/${initialData.slug}` : '/api/timeline'
    const method = initialData ? 'PATCH' : 'POST'

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setLoading(false)
    if (!res.ok) { const d = await res.json(); setError(JSON.stringify(d.error)); return }
    router.push('/admin/timeline'); router.refresh()
  }

  async function handleDelete() {
    if (!initialData || !confirm(`Delete "${initialData.name}"?`)) return
    await fetch(`/api/timeline/${initialData.slug}`, { method: 'DELETE' })
    router.push('/admin/timeline'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-700">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} onBlur={autoSlug} required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none" placeholder="The Creation of Adam" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Slug *</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required pattern="[a-z0-9-]+"
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-mono focus:outline-none" placeholder="creation-of-adam" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-700">Era *</label>
          <select value={era} onChange={(e) => setEra(e.target.value as TimelineEra)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none">
            {ERAS.map((er) => <option key={er} value={er}>{ERA_LABEL[er]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Position (sort order) *</label>
          <input type="number" value={position} onChange={(e) => setPosition(Number(e.target.value))} required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Summary</label>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none"
          placeholder="Brief neutral description of the event…" />
      </div>

      {/* Tradition presence */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-stone-700">Tradition treatment</label>
        {traditions.map((trad, i) => (
          <div key={trad.tradition} className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3">
            <p className="text-sm font-semibold text-stone-700">{TRADITION_LABEL[trad.tradition]}</p>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Presence</label>
              <select value={trad.presence} onChange={(e) => updateTrad(i, 'presence', e.target.value)}
                className="rounded-md border border-stone-200 px-3 py-1.5 text-sm focus:outline-none">
                {PRESENCES.map((p) => <option key={p} value={p}>{PRESENCE_LABEL[p]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Notes / details</label>
              <textarea value={trad.notes} onChange={(e) => updateTrad(i, 'notes', e.target.value)}
                rows={3} className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:outline-none"
                placeholder="How this tradition understands or treats this event…" />
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
          {loading ? 'Saving…' : initialData ? 'Update Event' : 'Create Event'}
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
