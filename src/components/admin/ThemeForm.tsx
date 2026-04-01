'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Theme } from '@prisma/client'

interface Props {
  initialData?: Theme
}

const PRESET_COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#7c3aed',
  '#ea580c', '#0891b2', '#be185d', '#ca8a04',
]

export function ThemeForm({ initialData }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(initialData?.name ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [color, setColor] = useState(initialData?.color ?? '#7c3aed')

  function autoSlug() {
    if (!slug)
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      name,
      slug,
      description: description || undefined,
      color,
    }

    const url = initialData ? `/api/themes/${initialData.slug}` : '/api/themes'
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

    router.push('/admin/themes')
    router.refresh()
  }

  async function handleDelete() {
    if (!initialData) return
    if (!confirm(`Delete theme "${initialData.name}"?`)) return
    await fetch(`/api/themes/${initialData.slug}`, { method: 'DELETE' })
    router.push('/admin/themes')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-700">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={autoSlug}
            required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            placeholder="Covenant"
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
            placeholder="covenant"
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
          placeholder="Brief description of this theme…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Colour</label>
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full border-2 transition-transform ${
                  color === c ? 'border-stone-800 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-14 cursor-pointer rounded border border-stone-200 p-0.5"
          />
          <span className="font-mono text-sm text-stone-500">{color}</span>
        </div>
        <div className="mt-2">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: color + '22', color }}
          >
            Preview: {name || 'Theme name'}
          </span>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving…' : initialData ? 'Update Theme' : 'Create Theme'}
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
