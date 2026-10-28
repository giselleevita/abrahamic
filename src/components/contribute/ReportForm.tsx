'use client'

import { useState } from 'react'

const KINDS = [
  { value: 'CORRECTION', label: 'Something is factually wrong' },
  { value: 'UNFAIR_TO_TRADITION', label: 'A tradition is described unfairly' },
  { value: 'SOURCE_ERROR', label: 'The citation or text is wrong' },
  { value: 'OTHER', label: 'Something else' },
] as const

export function ReportForm({ claimId, pagePath }: { claimId?: number; pagePath?: string }) {
  const [kind, setKind] = useState<string>('CORRECTION')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind, message, claimId, pagePath, contactEmail: email || undefined, website }),
      })
      if (res.ok) {
        setState('sent')
        return
      }
      const data = await res.json().catch(() => ({}))
      const fields = data.error?.fieldErrors
      const retryAfter = Number(res.headers.get('Retry-After'))
      setError(
        res.status === 429 && Number.isFinite(retryAfter) && retryAfter > 0
          ? `Please try again in about ${Math.ceil(retryAfter / 60)} minute${Math.ceil(retryAfter / 60) === 1 ? '' : 's'}. Your report is still here.`
          : typeof data.error === 'string'
            ? data.error
            : fields
              ? (Object.values(fields).flat() as string[]).join(' ')
              : 'Something went wrong. Your report is still here; please try again.'
      )
    } catch {
      setError('We could not connect. Your report is still here; check your connection and try again.')
    } finally {
      setState((current) => current === 'sent' ? 'sent' : 'idle')
    }
  }

  if (state === 'sent') {
    return (
      <div role="status" className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
        <p className="font-semibold">Thank you. Your report has been sent to the editors.</p>
        <p className="mt-1 text-sm">A person will read it. We may not be able to reply to everyone, but every report is looked at.</p>
      </div>
    )
  }

  const field = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
  return (
    <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <label htmlFor="kind" className="block text-sm font-medium text-slate-700">What kind of problem is it?</label>
        <select id="kind" value={kind} onChange={(e) => setKind(e.target.value)} className={field}>
          {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">What is wrong, and what should it say?</label>
        <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} maxLength={3000} required className={field} />
        <p className="mt-1 text-xs text-slate-500">Please be specific. If you can, name your tradition and a source we could check.</p>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Your email (optional)</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} className={field} />
        <p className="mt-1 text-xs text-slate-500">Only if you would like a reply. It is read by the editors and never published.</p>
      </div>
      {/* Honeypot: invisible to people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={state === 'sending'} className="min-h-11 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50">
        {state === 'sending' ? 'Sending…' : 'Send report'}
      </button>
    </form>
  )
}
