'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Option = { value: string; label: string }

async function send(url: string, method: string, body: unknown): Promise<string | null> {
  const res = await fetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  if (res.ok) return null
  const data = await res.json().catch(() => ({}))
  if (typeof data.error === 'string') return data.error
  const fields = data.error?.fieldErrors
  return fields ? Object.values(fields).flat().join(' ') : 'Request failed'
}

export function ReviewForm({ claimId, traditions, standingIn }: { claimId: number; traditions: Option[]; standingIn: boolean }) {
  const router = useRouter()
  const [tradition, setTradition] = useState(traditions[0]?.value ?? '')
  const [verdict, setVerdict] = useState('ACCURATE')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (traditions.length === 0) return null

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const problem = await send(`/api/claims/${claimId}/reviews`, 'POST', { tradition, verdict, comment: comment || undefined })
    setBusy(false)
    if (problem) setError(problem)
    else {
      setComment('')
      router.refresh()
    }
  }

  const field = 'mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm'
  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-4">
      <p className="text-sm font-semibold text-stone-800">Record a review of this wording</p>
      {standingIn && (
        <p className="rounded bg-sky-50 px-3 py-2 text-xs text-sky-900">
          You are acting as the <strong>project editor</strong>. This satisfies the publishing gate but is shown publicly as
          &ldquo;checked by the project editor&rdquo;, never as a review by a member of the tradition.
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-stone-700">Tradition
          <select value={tradition} onChange={(e) => setTradition(e.target.value)} className={field}>
            {traditions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-stone-700">Is it fairly described?
          <select value={verdict} onChange={(e) => setVerdict(e.target.value)} className={field}>
            <option value="ACCURATE">Yes, accurate and fair</option>
            <option value="NEEDS_CHANGES">Needs changes</option>
            <option value="OBJECTS">I object to this wording</option>
          </select>
        </label>
      </div>
      <label className="block text-xs font-medium text-stone-700">
        {verdict === 'ACCURATE' ? 'Comment (optional)' : 'What is wrong? (required)'}
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} maxLength={2000} className={field} />
      </label>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
        {busy ? 'Saving…' : 'Save review'}
      </button>
    </form>
  )
}

export function ContestedControl({ claimId, isContested, hasConcern }: { claimId: number; isContested: boolean; hasConcern: boolean }) {
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!isContested && !hasConcern) return null

  async function toggle() {
    setBusy(true)
    setError('')
    const problem = await send(`/api/claims/${claimId}/contested`, 'PATCH', { isContested: !isContested, reason })
    setBusy(false)
    if (problem) setError(problem)
    else {
      setReason('')
      router.refresh()
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">{isContested ? 'Published as contested' : 'A reviewer has raised a concern'}</p>
      <p className="mt-1 text-xs text-amber-800">
        {isContested
          ? 'The page shows that a tradition’s reviewer disagrees. Clearing this removes that notice.'
          : 'You can publish this wording anyway as contested. The disagreement is shown publicly and your reason is recorded in the audit log. Changing the wording resets this.'}
      </p>
      <input
        aria-label="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (at least 10 characters)"
        className="mt-3 w-full rounded-md border border-amber-300 bg-white px-2 py-1.5 text-sm"
      />
      {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
      <button type="button" disabled={busy || reason.trim().length < 10} onClick={toggle} className="mt-3 rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
        {isContested ? 'Clear contested status' : 'Mark as contested'}
      </button>
    </div>
  )
}
