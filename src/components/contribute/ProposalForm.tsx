'use client'

import { useState } from 'react'

type Source = { id: number; title: string }

export function ProposalForm({ sources }: { sources: Source[] }) {
  const [sourceId, setSourceId] = useState(sources[0]?.id ?? 0)
  const [statement, setStatement] = useState('')
  const [references, setReferences] = useState('')
  const [notes, setNotes] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [errors, setErrors] = useState<string[]>([])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setState('sending')
    setErrors([])
    const res = await fetch('/api/contributions/claims', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        sourceId,
        statement,
        references: references.split('\n').map((line) => line.trim()).filter(Boolean),
        notes: notes || undefined,
      }),
    })
    if (res.ok) {
      setState('sent')
      return
    }
    setState('idle')
    const data = await res.json().catch(() => ({}))
    const fields = data.error?.fieldErrors
    setErrors(
      typeof data.error === 'string'
        ? [data.error]
        : data.error?.reasons
          ? data.error.reasons
          : fields
            ? (Object.values(fields).flat() as string[])
            : ['Something went wrong. Please try again.'],
    )
  }

  if (state === 'sent') {
    return (
      <div role="status" className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
        <p className="font-semibold">Thank you. Your proposal is with the editors.</p>
        <p className="mt-1 text-sm">It is a draft only the editors can see. If they take it forward, members of the tradition it describes will review the wording before anything is published.</p>
      </div>
    )
  }

  const field = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
  return (
    <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <label htmlFor="source" className="block text-sm font-medium text-slate-700">Which text does the claim come from?</label>
        <select id="source" value={sourceId} onChange={(e) => setSourceId(Number(e.target.value))} className={field}>
          {sources.map((source) => <option key={source.id} value={source.id}>{source.title}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="statement" className="block text-sm font-medium text-slate-700">The claim</label>
        <textarea id="statement" value={statement} onChange={(e) => setStatement(e.target.value)} rows={4} maxLength={1000} required className={field} />
        <p className="mt-1 text-xs text-slate-500">
          Describe what the text or the tradition says, and say whose view it is. Write &ldquo;Jewish tradition holds that&hellip;&rdquo;, not a
          judgment about who is right.
        </p>
      </div>
      <div>
        <label htmlFor="references" className="block text-sm font-medium text-slate-700">Passages that support it (one per line)</label>
        <textarea id="references" value={references} onChange={(e) => setReferences(e.target.value)} rows={3} required placeholder={'Genesis 12:1-3\nGenesis 17:7'} className={field} />
        <p className="mt-1 text-xs text-slate-500">Use &ldquo;Book chapter:verse&rdquo;, or a range of up to 10 verses. For the Qur&rsquo;an, &ldquo;2:255&rdquo; works.</p>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes for the editors (optional)</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={2000} className={field} />
        <p className="mt-1 text-xs text-slate-500">Other sources, commentary, or why this matters. Not published.</p>
      </div>
      {errors.length > 0 && (
        <ul role="alert" className="list-disc space-y-1 pl-5 text-sm text-red-600">
          {errors.map((message) => <li key={message}>{message}</li>)}
        </ul>
      )}
      <button type="submit" disabled={state === 'sending'} className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50">
        {state === 'sending' ? 'Sending…' : 'Send proposal'}
      </button>
    </form>
  )
}
