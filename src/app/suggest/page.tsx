import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { ReportForm } from '@/components/contribute/ReportForm'
import { validCorrectionPath } from '@/lib/schemas/corrections'

export const metadata: Metadata = {
  title: 'Suggest a correction',
  description: 'Tell the editors if something is wrong or unfair. No account needed.',
}
export const dynamic = 'force-dynamic'

export default async function SuggestPage({ searchParams }: { searchParams: Promise<{ claim?: string; page?: string }> }) {
  const { claim: claimParam, page: pageParam } = await searchParams
  const pagePath = pageParam && pageParam.length <= 300 && validCorrectionPath(pageParam) ? pageParam : undefined
  const claimId = /^\d{1,9}$/.test(claimParam ?? '') ? Number(claimParam) : undefined
  const claim = claimId
    ? await prisma.claim.findFirst({ where: { id: claimId, isPublished: true }, select: { id: true, statement: true, source: { select: { title: true } } } })
    : null

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Help us get it right</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Suggest a correction</h1>
      <p className="mt-5 text-lg leading-8 text-slate-700">
        If something here is wrong, or describes your tradition in a way you would not recognise, please tell us. You do not need an account.
        A person on the editorial team reads every report. Reports are not votes: they help the editors and the reviewers from each tradition decide what to change.
      </p>

      {claim && (
        <blockquote className="mt-6 rounded-lg border-l-4 border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="text-xs font-semibold text-slate-500">About this claim ({claim.source.title})</p>
          <p className="mt-1">{claim.statement}</p>
        </blockquote>
      )}

      {pagePath && !claim && (
        <p className="mt-6 rounded-lg border-l-4 border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">About the page <code>{pagePath}</code></p>
      )}

      <ReportForm claimId={claim?.id} pagePath={pagePath} />
      <p className="mt-6 text-xs text-slate-500">
        We store your message, your email if you give one, and a scrambled form of your IP address used only to limit spam. The scrambled address is erased after 30 days. See the privacy page.
      </p>
    </div>
  )
}
