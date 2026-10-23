'use client'

import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const PROVIDER_LABEL = { github: 'GitHub', google: 'Google' } as const
const TRADITIONS = [
  { value: 'JEWISH', label: 'Judaism' },
  { value: 'CHRISTIAN', label: 'Christianity' },
  { value: 'ISLAMIC', label: 'Islam' },
] as const

export function SignInButtons({ providers }: { providers: ('github' | 'google')[] }) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      {providers.map((provider) => (
        <button
          key={provider}
          type="button"
          onClick={() => signIn(provider, { callbackUrl: '/account' })}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700"
        >
          Continue with {PROVIDER_LABEL[provider]}
        </button>
      ))}
    </div>
  )
}

export function ReviewerApplicationForm({ available }: { available: string[] }) {
  const router = useRouter()
  const [tradition, setTradition] = useState(available[0] ?? '')
  const [affiliation, setAffiliation] = useState('')
  const [statement, setStatement] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  if (available.length === 0) return null

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const res = await fetch('/api/account/reviewer-applications', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tradition, affiliation, statement }),
    })
    setBusy(false)
    if (res.ok) {
      setAffiliation('')
      setStatement('')
      router.refresh()
    } else {
      const body = await res.json().catch(() => ({}))
      setMessage(typeof body.error === 'string' ? body.error : 'Please check the form: affiliation 3+ characters and a statement of 20+ characters.')
    }
  }

  const field = 'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
  return (
    <form onSubmit={submit} className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <div>
        <label htmlFor="tradition" className="block text-sm font-medium text-slate-700">Tradition you belong to</label>
        <select id="tradition" value={tradition} onChange={(e) => setTradition(e.target.value)} className={field}>
          {TRADITIONS.filter((t) => available.includes(t.value)).map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="affiliation" className="block text-sm font-medium text-slate-700">Community, congregation, school or institution</label>
        <input id="affiliation" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} maxLength={200} required className={field} />
      </div>
      <div>
        <label htmlFor="statement" className="block text-sm font-medium text-slate-700">Why you can speak to how this tradition is described</label>
        <textarea id="statement" value={statement} onChange={(e) => setStatement(e.target.value)} maxLength={2000} rows={5} required className={field} />
        <p className="mt-1 text-xs text-slate-500">An administrator reads this. It is not published.</p>
      </div>
      {message && <p role="alert" className="text-sm text-red-600">{message}</p>}
      <button type="submit" disabled={busy} className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50">
        {busy ? 'Sending…' : 'Apply to review'}
      </button>
    </form>
  )
}

export function AccountActions() {
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  async function deleteAccount() {
    setBusy(true)
    const res = await fetch('/api/account', { method: 'DELETE' })
    if (res.ok) await signOut({ callbackUrl: '/' })
    setBusy(false)
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
      <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        Sign out
      </button>
      {!confirming ? (
        <button type="button" onClick={() => setConfirming(true)} className="text-sm font-semibold text-red-700 underline">
          Delete my account
        </button>
      ) : (
        <span className="flex items-center gap-3 text-sm">
          <span className="text-slate-700">This removes your account and applications permanently.</span>
          <button type="button" disabled={busy} onClick={deleteAccount} className="rounded-xl bg-red-700 px-4 py-2 font-bold text-white hover:bg-red-800 disabled:opacity-50">
            {busy ? 'Deleting…' : 'Yes, delete'}
          </button>
          <button type="button" onClick={() => setConfirming(false)} className="font-semibold text-slate-600 underline">Cancel</button>
        </span>
      )}
    </div>
  )
}
