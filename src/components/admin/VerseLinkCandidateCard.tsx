'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { VerseLinkCandidate, Verse, Source } from '@prisma/client'

type CandidateWithVerses = VerseLinkCandidate & {
  verseA: Verse & { source: Source }
  verseB: Verse & { source: Source }
}

interface Props {
  candidate: CandidateWithVerses
}

const LINK_TYPE_LABEL: Record<string, string> = {
  PARALLEL: 'Parallel',
  INTERTEXTUAL: 'Intertextual reference',
  THEMATIC: 'Thematic link',
  CONTRASTING: 'Contrasting',
}

export function VerseLinkCandidateCard({ candidate }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'APPROVED' | 'REJECTED' | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [done, setDone] = useState(false)

  async function handleAction(status: 'APPROVED' | 'REJECTED') {
    setLoading(status)
    await fetch(`/api/ai/verse-link-candidates/${candidate.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewNotes: reviewNotes || undefined }),
    })
    setLoading(null)
    setDone(true)
    router.refresh()
  }

  if (done) return null

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
          {LINK_TYPE_LABEL[candidate.linkType] ?? candidate.linkType}
        </span>
        <span className="text-xs text-stone-400">{new Date(candidate.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { verse: candidate.verseA, label: 'Verse A' },
          { verse: candidate.verseB, label: 'Verse B' },
        ].map(({ verse, label }) => (
          <div key={label} className="rounded-lg border border-stone-100 bg-stone-50 p-3">
            <p className="text-xs font-medium text-stone-400 mb-1">{label}</p>
            <p className="text-xs font-semibold text-stone-600">{verse.source.title}</p>
            <p className="text-sm text-stone-800">
              {verse.book} {verse.chapter}:{verse.verse}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border-l-2 border-amber-200 bg-amber-50 px-3 py-2">
        <p className="text-xs font-medium text-amber-700 mb-0.5">AI rationale</p>
        <p className="text-sm text-stone-700">{candidate.aiRationale}</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-500 mb-1">Review notes (optional)</label>
        <input
          type="text"
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          placeholder="Add context for future reference…"
          className="w-full rounded-md border border-stone-200 px-3 py-1.5 text-sm focus:border-stone-400 focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleAction('APPROVED')}
          disabled={loading !== null}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {loading === 'APPROVED' ? 'Approving…' : 'Approve'}
        </button>
        <button
          onClick={() => handleAction('REJECTED')}
          disabled={loading !== null}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-50 transition-colors"
        >
          {loading === 'REJECTED' ? 'Rejecting…' : 'Reject'}
        </button>
      </div>
    </div>
  )
}
