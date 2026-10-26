import Link from 'next/link'
import prisma from '@/lib/prisma'
import { ReportControls } from '@/components/admin/ReportControls'

export const dynamic = 'force-dynamic'

const KIND_LABEL = {
  CORRECTION: 'Factual error',
  UNFAIR_TO_TRADITION: 'Unfair to a tradition',
  SOURCE_ERROR: 'Citation or text error',
  OTHER: 'Other',
} as const
const STATUS_STYLE = {
  NEW: 'bg-amber-100 text-amber-800',
  SEEN: 'bg-sky-100 text-sky-800',
  ACTIONED: 'bg-emerald-100 text-emerald-800',
  DISMISSED: 'bg-slate-200 text-slate-700',
} as const
const STATUS_LABEL = { NEW: 'New', SEEN: 'In review', ACTIONED: 'Resolved', DISMISSED: 'Dismissed' } as const

export default async function SuggestionsPage() {
  const reports = await prisma.correctionReport.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 100,
    include: { claim: { select: { id: true, statement: true } } },
  })

  return (
    <div className="max-w-4xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Public input</p>
      <h1 className="mt-1 text-3xl font-bold text-stone-900">Correction reports</h1>
      <p className="mt-2 max-w-3xl text-sm text-stone-600">
        Anyone can send these without an account. They are input, not votes: a report changes nothing by itself.
        A claim that reads as unfair to a tradition belongs in front of that tradition&rsquo;s reviewers. The sender&rsquo;s email, if given, is for replying only.
      </p>
      <div className="mt-6 space-y-3">
        {reports.length === 0 ? (
          <p className="rounded-xl border border-stone-200 bg-white p-5 text-sm text-stone-500">No reports yet.</p>
        ) : reports.map((report) => (
          <article key={report.id} className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-stone-900">{KIND_LABEL[report.kind]}</p>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_STYLE[report.status]}`}>{STATUS_LABEL[report.status]}</span>
            </div>
            {(report.pagePath || report.reference || report.legacyCategory) && <p className="mt-2 text-xs text-stone-600">{report.pagePath ? `Page: ${report.pagePath}` : ''}{report.reference ? ` · Passage: ${report.reference}` : ''}{report.legacyCategory ? ` · Original category: ${report.legacyCategory}` : ''}</p>}
            <p className="mt-2 whitespace-pre-wrap text-sm text-stone-700">{report.message}</p>
            {report.claim && (
              <p className="mt-3 rounded bg-stone-50 p-3 text-xs text-stone-600">
                About claim <Link href={`/admin/claims/${report.claim.id}`} className="font-semibold underline">#{report.claim.id}</Link>: {report.claim.statement}
              </p>
            )}
            <p className="mt-3 text-xs text-stone-500">
              {report.createdAt.toISOString().slice(0, 16).replace('T', ' ')} · {report.contactEmail ? `reply to ${report.contactEmail}` : 'no email given'}
              {report.handledBy ? ` · handled by ${report.handledBy}` : ''}
            </p>
            <div className="mt-3"><ReportControls id={report.id} status={report.status} /></div>
          </article>
        ))}
      </div>
    </div>
  )
}
