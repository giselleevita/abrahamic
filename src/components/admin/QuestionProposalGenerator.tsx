'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Option = { id: number; label: string }

export function QuestionProposalGenerator({
  chapters, concepts, comparisons,
}: {
  chapters: Option[]
  concepts: Option[]
  comparisons: Option[]
}) {
  const router = useRouter()
  const [chapterId, setChapterId] = useState('')
  const [sourceType, setSourceType] = useState<'CONCEPT' | 'COMPARISON'>('COMPARISON')
  const [sourceId, setSourceId] = useState('')
  const [count, setCount] = useState('2')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const sources = sourceType === 'CONCEPT' ? concepts : comparisons

  async function generate() {
    if (!chapterId || !sourceId) return
    setLoading(true)
    setMessage(null)

    const res = await fetch('/api/ai/question-candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chapterId: Number(chapterId),
        sourceType,
        sourceId: Number(sourceId),
        count: Number(count),
      }),
    })
    setLoading(false)

    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMessage(typeof body.error === 'string' ? body.error : `Failed (${res.status})`)
      return
    }
    setMessage(
      body.created > 0
        ? `Drafted ${body.created} candidate(s) for review.`
        : (body.message ?? 'No usable proposals returned.'),
    )
    router.refresh()
  }

  return (
    <div className="mb-8 space-y-3 rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-stone-900">Draft questions ✦</h2>
      <p className="text-xs text-stone-500">
        Drafts go to the review queue below — nothing is published directly. Each draft is
        checked against the neutrality rules at generation time.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          aria-label="Chapter"
          className="rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
        >
          <option value="">Choose chapter…</option>
          {chapters.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>

        <select
          value={sourceType}
          onChange={(e) => { setSourceType(e.target.value as 'CONCEPT' | 'COMPARISON'); setSourceId('') }}
          aria-label="Source type"
          className="rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
        >
          <option value="COMPARISON">From a comparison</option>
          <option value="CONCEPT">From a concept</option>
        </select>

        <select
          value={sourceId}
          onChange={(e) => setSourceId(e.target.value)}
          aria-label="Source"
          className="rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
        >
          <option value="">Choose source…</option>
          {sources.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>

        <select
          value={count}
          onChange={(e) => setCount(e.target.value)}
          aria-label="How many"
          className="rounded border border-stone-300 px-3 py-2 text-sm text-stone-900"
        >
          <option value="1">1 question</option>
          <option value="2">2 questions</option>
          <option value="3">3 questions</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={generate}
          disabled={loading || !chapterId || !sourceId}
          className="rounded-md bg-stone-800 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Drafting…' : 'Draft questions'}
        </button>
        {message && <p className="text-sm text-stone-600">{message}</p>}
      </div>
    </div>
  )
}
