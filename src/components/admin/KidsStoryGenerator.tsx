'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AGE_BAND_RULES, type AgeBand } from '@/lib/kids/readability'

interface ClaimOption {
  id: number
  statement: string
  sourceTitle: string
}

/**
 * Drafts a kids story from selected published claims.
 *
 * Three outcomes are possible and all three are normal: a draft is created, the
 * model declines because the claims are unsuitable, or the draft is blocked by
 * the content guard. The last two are shown with their reasons rather than as
 * errors — they are the safety mechanism working.
 */
export function KidsStoryGenerator({ claims }: { claims: ClaimOption[] }) {
  const router = useRouter()
  const [ageBand, setAgeBand] = useState<AgeBand>('AGE_6_8')
  const [selected, setSelected] = useState<number[]>([])
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<
    | { kind: 'created'; title: string; warnings: string[] }
    | { kind: 'declined'; reason: string }
    | { kind: 'blocked'; reasons: string[] }
    | { kind: 'error'; message: string }
    | null
  >(null)

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 6 ? [...prev, id] : prev,
    )
  }

  async function generate() {
    setBusy(true)
    setResult(null)
    try {
      const res = await fetch('/api/ai/kids-stories', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ageBand, claimIds: selected }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setResult({
          kind: 'error',
          message:
            res.status === 503
              ? 'ANTHROPIC_API_KEY is not configured on this deployment.'
              : (typeof data.error === 'string' ? data.error : 'Generation failed'),
        })
        return
      }

      if (data.declined) {
        setResult({ kind: 'declined', reason: data.reason })
      } else if (data.blocked) {
        setResult({ kind: 'blocked', reasons: data.reasons ?? [] })
      } else {
        setResult({
          kind: 'created',
          title: data.story?.title ?? 'Draft',
          warnings: data.warnings ?? [],
        })
        setSelected([])
        router.refresh()
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rounded-xl border border-islamic-200 bg-islamic-50 p-6">
      <h2 className="text-lg font-semibold text-islamic-900">Draft a new story</h2>
      <p className="mt-1 text-sm text-islamic-800">
        Pick up to six published claims. The draft is checked automatically and lands
        unreviewed for you to read in full.
      </p>

      <fieldset className="mt-4">
        <legend className="text-xs font-semibold text-islamic-900">Age band</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {(Object.keys(AGE_BAND_RULES) as AgeBand[]).map((band) => (
            <label
              key={band}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
                ageBand === band
                  ? 'border-islamic-600 bg-white font-semibold text-islamic-900'
                  : 'border-islamic-200 bg-white/60 text-islamic-700'
              }`}
            >
              <input
                type="radio"
                name="ageBand"
                value={band}
                checked={ageBand === band}
                onChange={() => setAgeBand(band)}
                className="sr-only"
              />
              {AGE_BAND_RULES[band].label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-xs font-semibold text-islamic-900">
          Source claims ({selected.length}/6)
        </legend>
        <div className="mt-1 max-h-60 space-y-1 overflow-y-auto rounded-lg border border-islamic-200 bg-white p-2">
          {claims.map((claim) => (
            <label
              key={claim.id}
              className="flex cursor-pointer items-start gap-2 rounded p-1.5 text-sm hover:bg-islamic-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(claim.id)}
                onChange={() => toggle(claim.id)}
                className="mt-1"
              />
              <span>
                <span className="text-stone-800">{claim.statement}</span>{' '}
                <span className="text-xs text-stone-400">({claim.sourceTitle})</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        disabled={busy || selected.length === 0}
        onClick={generate}
        className="mt-4 rounded-lg bg-islamic-600 px-5 py-2 text-sm font-semibold text-white hover:bg-islamic-700 disabled:opacity-40"
      >
        {busy ? 'Drafting…' : 'Draft story'}
      </button>

      {result?.kind === 'created' && (
        <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-900">
          Draft “{result.title}” created and added to the queue below.
          {result.warnings.length > 0 && ` Notes: ${result.warnings.join('; ')}`}
        </p>
      )}
      {result?.kind === 'declined' && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          The model declined these claims: {result.reason} Try a different selection.
        </p>
      )}
      {result?.kind === 'blocked' && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">The draft failed its content checks and was not saved:</p>
          <ul className="mt-1 list-inside list-disc">
            {result.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}
      {result?.kind === 'error' && (
        <p role="alert" className="mt-3 rounded-lg bg-christian-50 p-3 text-sm text-christian-900">
          {result.message}
        </p>
      )}
    </section>
  )
}
