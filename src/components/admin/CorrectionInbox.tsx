'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { correctionStatuses, correctionStatusLabels } from '@/lib/schemas/corrections'
type Report = { id: number; pagePath: string; reference: string | null; category: string; description: string; status: typeof correctionStatuses[number]; createdAt: string }
export function CorrectionInbox() {
  const [status, setStatus] = useState('NEW')
  const [reports, setReports] = useState<Report[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState<number | null>(null)
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/admin/corrections?status=${status}`, { signal: controller.signal }).then(async (res) => {
      if (!res.ok) throw new Error('Could not load reports.')
      return res.json()
    }).then((data) => { setReports(data); setError('') }).catch((e) => { if (e.name !== 'AbortError') setError(e.message) }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [status, revision])
  async function update(id: number, next: string) {
    setPending(id); setError('')
    try {
      const res = await fetch(`/api/admin/corrections/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) })
      if (!res.ok) throw new Error('Could not update this report. Please retry.')
      setRevision((v) => v + 1)
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not update report.') } finally { setPending(null) }
  }
  return <div><label className="block">Report status<select className="editorial-control ml-3 p-3" value={status} onChange={(e) => { setLoading(true); setStatus(e.target.value) }}>{correctionStatuses.map((s) => <option key={s} value={s}>{correctionStatusLabels[s]}</option>)}</select></label><p className="mt-3 text-sm text-stone-600">Most recent 100 reports in this status. Changing a report does not change published content.</p><p role="status" className="mt-3">{error || (loading ? 'Loading reports…' : `${reports.length} reports`)}</p>{error && <button className="reading-action" onClick={() => { setLoading(true); setRevision((v) => v + 1) }}>Retry</button>}<ul className="mt-6 space-y-4">{!loading && reports.map((r) => <li className="editorial-card p-5" key={r.id}><p className="text-xs">{r.category} · {new Date(r.createdAt).toLocaleDateString('en-GB')}</p><Link className="editorial-link break-words" href={r.pagePath}>{r.reference || r.pagePath}</Link><p className="my-4 whitespace-pre-wrap break-words">{r.description}</p><label>Status for report #{r.id}<select className="editorial-control ml-3 p-3" disabled={pending === r.id} value={r.status} onChange={(e) => update(r.id, e.target.value)}>{correctionStatuses.map((s) => <option key={s} value={s}>{correctionStatusLabels[s]}</option>)}</select></label></li>)}</ul></div>
}
