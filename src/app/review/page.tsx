import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { contributorSessionOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ReviewForm } from '@/components/admin/SignoffControls'
import { REVIEW_TRADITIONS, TRADITION_LABEL, type ReviewTradition } from '@/lib/editorial/signoff'
import { formatVerseRef } from '@/lib/verse-links'

export const metadata: Metadata = {
  title: 'Review queue',
  description: 'Claims waiting for a member of the tradition they describe to confirm they are fairly worded.',
  robots: { index: false },
}
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 25

export default async function ReviewQueuePage() {
  const session = await getServerSession(contributorSessionOptions)
  const mine = (session?.user.reviewerTraditions ?? []).filter((t): t is ReviewTradition => REVIEW_TRADITIONS.includes(t as ReviewTradition))

  if (!session || mine.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
        <h1 className="text-3xl font-bold text-slate-950">Review queue</h1>
        <p className="mt-4 leading-7 text-slate-700">
          This page is for approved reviewers. A reviewer confirms whether their <em>own</em> tradition is fairly described.
          {session ? ' You can apply from your account page.' : ' Sign in to apply.'}
        </p>
        <Link href="/account" className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">Go to your account</Link>
      </div>
    )
  }

  const candidates = await prisma.claim.findMany({
    where: { editorialStatus: { in: ['IN_REVIEW', 'PUBLISHED'] }, requiredTraditions: { hasSome: mine } },
    orderBy: [{ editorialStatus: 'asc' }, { updatedAt: 'desc' }],
    take: 200,
    include: {
      source: { select: { title: true } },
      verses: { take: 1, orderBy: { isPrimary: 'desc' }, include: { verse: true } },
      reviews: { where: { reviewerId: session.user.id } },
    },
  })
  // Waiting = nothing yet from this reviewer on the CURRENT wording, for a tradition they cover.
  const waiting = candidates.filter((claim) => {
    const mineHere = mine.filter((t) => claim.requiredTraditions.includes(t))
    return mineHere.some((t) => !claim.reviews.some((r) => r.revision === claim.revision && r.tradition === t))
  })
  const shown = waiting.slice(0, PAGE_SIZE)

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Reviewer</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Review queue</h1>
      <p className="mt-4 leading-7 text-slate-700">
        You review for {mine.map((t) => TRADITION_LABEL[t]).join(' and ')}. For each claim, ask one question: would a thoughtful
        member of your tradition recognise this as a fair description of it? You are not asked whether it is true.
        If you object, say what is wrong. Your comment is read by the editors and is not published.
      </p>

      {shown.length === 0 ? (
        <p className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-slate-600">Nothing is waiting for you. Thank you.</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-slate-500">{waiting.length} waiting{waiting.length > shown.length ? `, showing the first ${shown.length}` : ''}.</p>
          <ul className="mt-4 space-y-6">
            {shown.map((claim) => {
              const options = mine
                .filter((t) => claim.requiredTraditions.includes(t) && !claim.reviews.some((r) => r.revision === claim.revision && r.tradition === t))
                .map((t) => ({ value: t, label: TRADITION_LABEL[t] }))
              const verse = claim.verses[0]?.verse
              return (
                <li key={claim.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold text-slate-500">
                    {claim.source.title}{verse ? ` · ${formatVerseRef(verse)}` : ''} · {claim.editorialStatus === 'IN_REVIEW' ? 'awaiting publication' : 'already published, not yet reviewed'}
                  </p>
                  <p className="mt-2 leading-7 text-slate-900">{claim.statement}</p>
                  <ReviewForm claimId={claim.id} traditions={options} standingIn={false} />
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
