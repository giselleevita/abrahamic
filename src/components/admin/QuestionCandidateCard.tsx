'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { NeutralityFlag } from '@/lib/learn/neutrality'

type ProposedOption = {
  text: string
  isCorrect?: boolean
  optionTradition?: string | null
  rationale?: string | null
}

type Candidate = {
  id: number
  kind: string
  format: string
  prompt: string
  explanation: string
  subjectTradition: string | null
  aiRationale: string
  aiModel: string | null
  createdAt: string | Date
  proposedOptions: unknown
  neutralityFlags: unknown
  chapter: { title: string }
  concept: { name: string } | null
  comparison: { title: string } | null
}

export function QuestionCandidateCard({ candidate }: { candidate: Candidate }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'APPROVED' | 'REJECTED' | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const options = (Array.isArray(candidate.proposedOptions) ? candidate.proposedOptions : []) as ProposedOption[]
  const flags = (Array.isArray(candidate.neutralityFlags) ? candidate.neutralityFlags : []) as NeutralityFlag[]
  const blocked = flags.some((f) => f.severity === 'BLOCK')

  async function act(status: 'APPROVED' | 'REJECTED') {
    setLoading(status)
    setError(null)
    const res = await fetch(`/api/ai/question-candidates/${candidate.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewNotes: reviewNotes || undefined }),
    })
    setLoading(null)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? `Request failed (${res.status})`)
      return
    }
    setDone(true)
    router.refresh()
  }

  if (done) return null

  const source = candidate.comparison?.title ?? candidate.concept?.name ?? 'Unknown source'

  return (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
          {candidate.kind}
        </span>
        {candidate.subjectTradition && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
            {candidate.subjectTradition}
          </span>
        )}
        <span className="text-xs text-stone-400">
          {candidate.chapter.title} · from {source}
        </span>
        <span className="ml-auto text-xs text-stone-400">
          {new Date(candidate.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-base font-semibold text-stone-900">{candidate.prompt}</p>

      <ul className="space-y-1.5">
        {options.map((option, i) => (
          <li
            key={i}
            className={`rounded-lg border px-3 py-2 text-sm ${
              option.isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-stone-200 bg-stone-50'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className={option.isCorrect ? 'text-emerald-700' : 'text-stone-400'}>
                {option.isCorrect ? '✓' : '○'}
              </span>
              <div className="min-w-0">
                <p className="text-stone-800">{option.text}</p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {option.optionTradition ? `Attributed to ${option.optionTradition}` : 'No tradition'}
                  {option.rationale ? ` · ${option.rationale}` : ''}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-lg border-l-2 border-blue-200 bg-blue-50 px-3 py-2">
        <p className="mb-0.5 text-xs font-medium text-blue-700">Explanation shown after answering</p>
        <p className="text-sm text-stone-700">{candidate.explanation}</p>
      </div>

      <div className="rounded-lg border-l-2 border-amber-200 bg-amber-50 px-3 py-2">
        <p className="mb-0.5 text-xs font-medium text-amber-700">
          AI rationale{candidate.aiModel ? ` (${candidate.aiModel})` : ''}
        </p>
        <p className="text-sm text-stone-700">{candidate.aiRationale}</p>
      </div>

      {flags.length > 0 && (
        <div className="rounded-lg border-l-2 border-rose-300 bg-rose-50 px-3 py-2">
          <p className="mb-1 text-xs font-medium text-rose-700">Neutrality check</p>
          <ul className="space-y-1">
            {flags.map((flag) => (
              <li key={flag.code} className="text-sm text-stone-700">
                <span className={`font-semibold ${flag.severity === 'BLOCK' ? 'text-rose-700' : 'text-amber-700'}`}>
                  {flag.severity}
                </span>{' '}
                {flag.message}
              </li>
            ))}
          </ul>
          {blocked && (
            <p className="mt-2 text-xs font-medium text-rose-700">
              Approval is disabled while a BLOCK is present. Reject this draft, or fix the
              question by hand after rejecting.
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor={`notes-${candidate.id}`} className="mb-1 block text-xs font-medium text-stone-500">
          Review notes (recorded on the question)
        </label>
        <input
          id={`notes-${candidate.id}`}
          type="text"
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          placeholder="Why this is or isn't acceptable…"
          className="w-full rounded-md border border-stone-200 px-3 py-1.5 text-sm focus:border-stone-400 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm font-medium text-rose-700">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          onClick={() => act('APPROVED')}
          disabled={loading !== null || blocked}
          title={blocked ? 'Blocked by the neutrality check' : undefined}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === 'APPROVED' ? 'Approving…' : 'Approve'}
        </button>
        <button
          onClick={() => act('REJECTED')}
          disabled={loading !== null}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-50"
        >
          {loading === 'REJECTED' ? 'Rejecting…' : 'Reject'}
        </button>
        <span className="text-xs text-stone-400">
          Approved questions are created unpublished — publish them from the chapter.
        </span>
      </div>
    </div>
  )
}
