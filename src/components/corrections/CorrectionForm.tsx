'use client'
import { useId, useRef, useState } from 'react'

export function CorrectionForm({ pagePath, reference }: { pagePath: string; reference?: string }) {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setState('sending'); setError('')
    try {
      const res = await fetch('/api/corrections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pagePath, reference, category: form.get('category'), description: form.get('description'), website: form.get('website') }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not save your report.')
      setState('done')
      formRef.current?.reset()
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not save your report. Please try again.'); setState('idle') }
  }
  return <details className="editorial-card mt-6 p-5"><summary className="min-h-11 py-2 font-semibold text-[#173b68]">Suggest a correction</summary><p className="mt-3 text-sm leading-6 text-primary-700">Reports are private to the editorial team. No account is needed and we cannot send a personal reply. Please do not include personal information.</p><p className="mt-2 break-words text-xs text-primary-700">Context: {reference || pagePath}</p><form ref={formRef} onSubmit={submit} className="mt-5 space-y-4"><label htmlFor={`${id}-category`} className="block text-sm font-semibold">Category</label><select id={`${id}-category`} name="category" required className="editorial-control min-h-11 w-full p-3"><option value="SOURCE">Source or passage</option><option value="INTERPRETATION">Interpretation</option><option value="LABEL">Label or attribution</option><option value="OTHER">Other</option></select><label htmlFor={`${id}-description`} className="block text-sm font-semibold">What needs correcting?</label><textarea id={`${id}-description`} name="description" required minLength={20} maxLength={3000} rows={5} className="editorial-control w-full p-3" aria-describedby={`${id}-hint`} /><p id={`${id}-hint`} className="text-xs text-primary-700">20–3,000 characters. Include a supporting reference if you can.</p><div className="hidden" aria-hidden="true"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></div><button type="submit" disabled={state === 'sending' || state === 'done'} className="editorial-button">{state === 'sending' ? 'Submitting…' : state === 'done' ? 'Report received' : 'Submit correction'}</button><p role="status" className="text-sm text-primary-700">{state === 'done' ? 'Thank you. The editorial team can now review your report.' : error}</p></form></details>
}
