'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ReportControls({ id, status }: { id: number; status: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function mark(next: string) {
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (res.ok) router.refresh()
      else setError('Update failed. Please try again.')
    } catch {
      setError('Could not connect. No status change was saved; please try again.')
    } finally {
      setBusy(false)
    }
  }

  const button = 'min-h-11 rounded border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 disabled:opacity-50'
  return (
    <div className="flex flex-wrap items-center gap-2" aria-busy={busy}>
      {status === 'NEW' && <button type="button" disabled={busy} onClick={() => mark('SEEN')} className={button}>Move to in review</button>}
      {status !== 'ACTIONED' && <button type="button" disabled={busy} onClick={() => mark('ACTIONED')} className={`${button} border-emerald-300 text-emerald-700`}>Resolve</button>}
      {status !== 'DISMISSED' && <button type="button" disabled={busy} onClick={() => mark('DISMISSED')} className={button}>Dismiss</button>}
      {error && <span role="alert" className="text-xs text-red-600">{error}</span>}
    </div>
  )
}
