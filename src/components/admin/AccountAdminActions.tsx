'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

async function patch(url: string, body: unknown): Promise<boolean> {
  const res = await fetch(url, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  return res.ok
}

export function UserControls({ id, role, status }: { id: string; role: 'CONTRIBUTOR' | 'EDITOR'; status: 'ACTIVE' | 'SUSPENDED' }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function update(change: { role?: string; status?: string }) {
    setBusy(true)
    setError('')
    const ok = await patch(`/api/admin/users/${id}`, change)
    setBusy(false)
    if (ok) router.refresh()
    else setError('Update failed')
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <select
        aria-label="Role"
        value={role}
        disabled={busy}
        onChange={(e) => update({ role: e.target.value })}
        className="rounded border border-stone-300 px-2 py-1"
      >
        <option value="CONTRIBUTOR">Contributor</option>
        <option value="EDITOR">Editor (CMS access)</option>
      </select>
      <button
        type="button"
        disabled={busy}
        onClick={() => update({ status: status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
        className={`rounded px-2 py-1 font-semibold ${status === 'ACTIVE' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}
      >
        {status === 'ACTIVE' ? 'Suspend' : 'Restore'}
      </button>
      {error && <span role="alert" className="text-red-600">{error}</span>}
    </div>
  )
}

export function ReviewerControls({ id, status }: { id: number; status: 'PENDING' | 'APPROVED' | 'REVOKED' }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function decide(next: 'APPROVED' | 'REVOKED') {
    setBusy(true)
    setError('')
    const ok = await patch(`/api/admin/reviewers/${id}`, { status: next })
    setBusy(false)
    if (ok) router.refresh()
    else setError('Update failed')
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      {status !== 'APPROVED' && (
        <button type="button" disabled={busy} onClick={() => decide('APPROVED')} className="rounded bg-emerald-600 px-3 py-1.5 font-semibold text-white disabled:opacity-50">
          Approve
        </button>
      )}
      {status !== 'REVOKED' && (
        <button type="button" disabled={busy} onClick={() => decide('REVOKED')} className="rounded border border-red-300 px-3 py-1.5 font-semibold text-red-700 disabled:opacity-50">
          {status === 'PENDING' ? 'Decline' : 'Revoke'}
        </button>
      )}
      {error && <span role="alert" className="text-red-600">{error}</span>}
    </div>
  )
}
