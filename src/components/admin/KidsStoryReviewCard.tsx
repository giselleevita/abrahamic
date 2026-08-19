'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyseReadability, AGE_BAND_RULES, type AgeBand } from '@/lib/kids/readability'
import { guardKidsStory } from '@/lib/kids/content-guard'

export interface ReviewStory {
  id: number
  slug: string
  title: string
  ageBand: AgeBand
  body: string
  aiModel: string
  aiRationale: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  isPublished: boolean
  reviewNotes: string | null
  sourceClaims: { id: number; statement: string; sourceTitle: string; refs: string[] }[]
}

/**
 * One story in the review queue.
 *
 * The reviewer sees the full body — never a truncated preview — plus the
 * computed reading level, the guard's verdict, and the claims the story was
 * drafted from. Approving and publishing are separate buttons on purpose:
 * approving judges the text, publishing releases it.
 */
export function KidsStoryReviewCard({ story }: { story: ReviewStory }) {
  const router = useRouter()
  const [notes, setNotes] = useState(story.reviewNotes ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stats = analyseReadability(story.body)
  const rules = AGE_BAND_RULES[story.ageBand]
  const guard = guardKidsStory({ title: story.title, body: story.body, ageBand: story.ageBand })

  async function submit(patch: Record<string, unknown>) {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/ai/kids-stories/${story.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...patch, reviewNotes: notes || undefined }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(
          data.reasons?.join('; ') ??
            (typeof data.error === 'string' ? data.error : 'Update failed'),
        )
        return
      }
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  const gradeOk = stats.grade <= rules.maxGrade

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-stone-900">{story.title}</h3>
          <p className="mt-0.5 text-xs text-stone-500">
            {rules.label} · drafted by {story.aiModel} · <code>{story.slug}</code>
          </p>
        </div>
        <div className="flex gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              story.status === 'APPROVED'
                ? 'bg-green-100 text-green-800'
                : story.status === 'REJECTED'
                  ? 'bg-christian-100 text-christian-800'
                  : 'bg-amber-100 text-amber-800'
            }`}
          >
            {story.status}
          </span>
          {story.isPublished && (
            <span className="rounded-full bg-jewish-100 px-3 py-1 text-xs font-semibold text-jewish-800">
              PUBLISHED
            </span>
          )}
        </div>
      </header>

      <div className="mt-4 whitespace-pre-wrap rounded-lg border border-stone-100 bg-stone-50 p-4 text-[15px] leading-relaxed text-stone-800">
        {story.body}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-stone-500">Reading grade</dt>
          <dd className={`font-semibold ${gradeOk ? 'text-green-700' : 'text-christian-700'}`}>
            {stats.grade} <span className="font-normal text-stone-400">/ max {rules.maxGrade}</span>
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">Words</dt>
          <dd className="font-semibold text-stone-800">
            {stats.words} <span className="font-normal text-stone-400">/ {rules.maxWords}</span>
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">Longest sentence</dt>
          <dd className="font-semibold text-stone-800">
            {stats.longestSentenceWords}{' '}
            <span className="font-normal text-stone-400">/ {rules.maxWordsPerSentence}</span>
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">Content checks</dt>
          <dd className={`font-semibold ${guard.ok ? 'text-green-700' : 'text-christian-700'}`}>
            {guard.ok ? 'Pass' : `${guard.reasons.length} issue(s)`}
          </dd>
        </div>
      </dl>

      {!guard.ok && (
        <ul className="mt-3 list-inside list-disc rounded-lg border border-christian-200 bg-christian-50 p-3 text-xs text-christian-900">
          {guard.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      {guard.warnings.length > 0 && (
        <ul className="mt-3 list-inside list-disc rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          {guard.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-semibold text-stone-600">
          Drafted from {story.sourceClaims.length} published claim(s)
        </summary>
        <ul className="mt-2 space-y-2 text-xs text-stone-600">
          {story.sourceClaims.map((c) => (
            <li key={c.id}>
              <p>{c.statement}</p>
              <p className="font-mono text-[11px] text-stone-400">
                {c.sourceTitle}
                {c.refs.length > 0 && ` · ${c.refs.join(', ')}`}
              </p>
            </li>
          ))}
        </ul>
      </details>

      <label className="mt-4 block">
        <span className="text-xs font-semibold text-stone-600">Review notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Why you approved, rejected, or held this."
          className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-sm"
        />
      </label>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-christian-50 p-2 text-sm text-christian-800">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {story.status !== 'APPROVED' && (
          <button
            type="button"
            disabled={busy || !guard.ok}
            title={guard.ok ? undefined : 'Resolve the content issues above first'}
            onClick={() => submit({ status: 'APPROVED' })}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-40"
          >
            Approve
          </button>
        )}
        {story.status !== 'REJECTED' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => submit({ status: 'REJECTED', isPublished: false })}
            className="rounded-lg border border-christian-300 px-4 py-2 text-sm font-semibold text-christian-800 hover:bg-christian-50 disabled:opacity-40"
          >
            Reject
          </button>
        )}
        {story.status === 'APPROVED' && !story.isPublished && (
          <button
            type="button"
            disabled={busy}
            onClick={() => submit({ isPublished: true })}
            className="rounded-lg bg-gold-600 px-4 py-2 text-sm font-semibold text-primary-950 hover:bg-gold-500 disabled:opacity-40"
          >
            Publish to /kids
          </button>
        )}
        {story.isPublished && (
          <button
            type="button"
            disabled={busy}
            onClick={() => submit({ isPublished: false })}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-40"
          >
            Unpublish
          </button>
        )}
      </div>
    </article>
  )
}
