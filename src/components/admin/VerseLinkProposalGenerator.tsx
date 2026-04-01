'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Verse, Source } from '@prisma/client'

type VerseWithSource = Verse & { source: Source }

interface Props {
  verses: VerseWithSource[]
}

function verseLabel(v: VerseWithSource) {
  return `${v.source.title} — ${v.book} ${v.chapter}:${v.verse}`
}

export function VerseLinkProposalGenerator({ verses }: Props) {
  const router = useRouter()
  const [verseAId, setVerseAId] = useState('')
  const [verseBId, setVerseBId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ count: number } | null>(null)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!verseAId || !verseBId) return
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/ai/verse-link-candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verseAId: parseInt(verseAId), verseBId: parseInt(verseBId) }),
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Failed to generate proposals')
      return
    }

    const data = await res.json()
    const count = Array.isArray(data) ? data.length : 1
    setResult({ count })
    router.refresh()
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-stone-700">✦ Generate AI proposals</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Pick two verses and ask Claude to propose cross-scriptural links between them.
          </p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs rounded border border-stone-200 px-2 py-1 text-stone-500 hover:bg-stone-50"
        >
          {open ? 'Close' : 'Open'}
        </button>
      </div>

      {open && (
        <form onSubmit={handleGenerate} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Verse A *</label>
              <select
                value={verseAId}
                onChange={(e) => setVerseAId(e.target.value)}
                required
                className="w-full rounded-md border border-stone-200 px-2 py-1.5 text-sm focus:outline-none"
              >
                <option value="">Select verse…</option>
                {verses.map((v) => (
                  <option key={v.id} value={v.id}>{verseLabel(v)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Verse B *</label>
              <select
                value={verseBId}
                onChange={(e) => setVerseBId(e.target.value)}
                required
                className="w-full rounded-md border border-stone-200 px-2 py-1.5 text-sm focus:outline-none"
              >
                <option value="">Select verse…</option>
                {verses.map((v) => (
                  <option key={v.id} value={v.id}>{verseLabel(v)}</option>
                ))}
              </select>
            </div>
          </div>

          {result && (
            <p className="text-sm text-emerald-700 bg-emerald-50 rounded px-3 py-2">
              ✓ {result.count} proposal{result.count !== 1 ? 's' : ''} added to the pending queue above.
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !verseAId || !verseBId}
            className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Generating…' : '✦ Generate proposals'}
          </button>
        </form>
      )}
    </div>
  )
}
