'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Figure, FigureAlias, Tradition } from '@prisma/client'

type FigureWithAliases = Figure & { aliases: FigureAlias[] }

interface Props {
  initialData?: FigureWithAliases
}

const TRADITIONS: Tradition[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC', 'SHARED']

type AliasRow = { tradition: Tradition; name: string; language: string; notes: string }

const emptyAlias = (): AliasRow => ({ tradition: 'JEWISH', name: '', language: '', notes: '' })

export function FigureForm({ initialData }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [canonicalName, setCanonicalName] = useState(initialData?.canonicalName ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [aliases, setAliases] = useState<AliasRow[]>(
    initialData?.aliases.map((a) => ({
      tradition: a.tradition,
      name: a.name,
      language: a.language ?? '',
      notes: a.notes ?? '',
    })) ?? [emptyAlias()]
  )

  function autoSlug() {
    if (!slug)
      setSlug(canonicalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  function updateAlias(i: number, field: keyof AliasRow, value: string) {
    setAliases(aliases.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)))
  }

  function removeAlias(i: number) {
    setAliases(aliases.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      canonicalName,
      slug,
      description: description || undefined,
      aliases: aliases.filter((a) => a.name.trim()).map((a) => ({
        tradition: a.tradition,
        name: a.name.trim(),
        language: a.language.trim() || undefined,
        notes: a.notes.trim() || undefined,
      })),
    }

    const url = initialData ? `/api/figures/${initialData.slug}` : '/api/figures'
    const method = initialData ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(JSON.stringify(data.error))
      return
    }

    router.push('/admin/figures')
    router.refresh()
  }

  async function handleDelete() {
    if (!initialData) return
    if (!confirm(`Delete "${initialData.canonicalName}"? This cannot be undone.`)) return
    await fetch(`/api/figures/${initialData.slug}`, { method: 'DELETE' })
    router.push('/admin/figures')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-700">Canonical name *</label>
          <input
            value={canonicalName}
            onChange={(e) => setCanonicalName(e.target.value)}
            onBlur={autoSlug}
            required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            placeholder="Abraham"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Slug *</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            pattern="[a-z0-9-]+"
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-mono focus:border-stone-500 focus:outline-none"
            placeholder="abraham"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          placeholder="Brief description of this figure…"
        />
      </div>

      {/* Aliases */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-stone-700">Names across traditions</label>
          <button
            type="button"
            onClick={() => setAliases([...aliases, emptyAlias()])}
            className="text-xs text-stone-500 hover:text-stone-700 border border-stone-200 rounded px-2 py-0.5"
          >
            + Add alias
          </button>
        </div>
        <div className="space-y-2">
          {aliases.map((alias, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-start rounded-lg border border-stone-100 bg-stone-50 p-3">
              <div className="col-span-3">
                <select
                  value={alias.tradition}
                  onChange={(e) => updateAlias(i, 'tradition', e.target.value as Tradition)}
                  className="w-full rounded border border-stone-200 px-2 py-1.5 text-xs focus:outline-none"
                >
                  {TRADITIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-3">
                <input
                  value={alias.name}
                  onChange={(e) => updateAlias(i, 'name', e.target.value)}
                  placeholder="Name *"
                  className="w-full rounded border border-stone-200 px-2 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <input
                  value={alias.language}
                  onChange={(e) => updateAlias(i, 'language', e.target.value)}
                  placeholder="Language"
                  className="w-full rounded border border-stone-200 px-2 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div className="col-span-3">
                <input
                  value={alias.notes}
                  onChange={(e) => updateAlias(i, 'notes', e.target.value)}
                  placeholder="Notes"
                  className="w-full rounded border border-stone-200 px-2 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeAlias(i)}
                  className="text-stone-300 hover:text-red-500 text-base leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving…' : initialData ? 'Update Figure' : 'Create Figure'}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
