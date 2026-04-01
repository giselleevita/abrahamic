'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

// This page is client so we can fetch source data on mount
export default function EditSourcePage({
  params,
}: {
  params: Promise<{ key: string }>
}) {
  const { key } = use(params)
  return <EditSourceForm sourceKey={key} />
}

function EditSourceForm({ sourceKey }: { sourceKey: string }) {
  const router = useRouter()
  const [source, setSource] = useState<{ title: string; language: string; description: string | null; tradition: string; key: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('')
  const [description, setDescription] = useState('')

  // Fetch on first render
  if (!fetched) {
    setFetched(true)
    fetch(`/api/sources/${sourceKey}`)
      .then((r) => r.json())
      .then((s) => {
        setSource(s)
        setTitle(s.title)
        setLanguage(s.language)
        setDescription(s.description ?? '')
      })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch(`/api/sources/${sourceKey}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        language,
        description: description || null,
      }),
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(JSON.stringify(data.error))
      return
    }

    router.push('/admin/sources')
    router.refresh()
  }

  if (!source) return <p className="text-stone-400 text-sm">Loading…</p>

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <a href="/admin/sources" className="text-sm text-stone-500 hover:text-stone-700">← Sources</a>
        <h1 className="text-2xl font-bold text-stone-900">{source.title}</h1>
        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">{source.tradition}</span>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Language</label>
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
              placeholder="Hebrew, Greek, Arabic…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
