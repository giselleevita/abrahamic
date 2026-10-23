import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaffSessionSafe } from '@/lib/api-auth'
import { getContributorSessionSafe } from '@/lib/contributor-session'
import prisma from '@/lib/prisma'
import { ReviewForm } from '@/components/admin/SignoffControls'
import { REVIEW_TRADITIONS, TRADITION_LABEL, type ReviewTradition } from '@/lib/editorial/signoff'
import { traditionsAwaiting } from '@/lib/editorial/queue'
import { formatVerseRef } from '@/lib/verse-links'

export const metadata: Metadata = {
  title: 'Review queue',
  description: 'Claims waiting for a member of the tradition they describe to confirm they are fairly worded.',
  robots: { index: false },
}
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 25

export default async function ReviewQueuePage() {
  // The administrator stands in as the project editor for every tradition until real reviewers join.
  const staff = await getStaffSessionSafe()
  const isAdmin = staff?.user.role === 'ADMIN'
  const session = isAdmin ? null : await getContributorSessionSafe()
  const mine: ReviewTradition[] = isAdmin
    ? [...REVIEW_TRADITIONS]
    : (session?.user.reviewerTraditions ?? []).filter((t): t is ReviewTradition => REVIEW_TRADITIONS.includes(t as ReviewTradition))
  const actorId = isAdmin ? staff!.user.id : session?.user.id

  if (!actorId || mine.length === 0) {
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
    take: 400,
    include: {
      source: { select: { title: true } },
      verses: { take: 1, orderBy: { isPrimary: 'desc' }, include: { verse: true } },
      reviews: { where: { reviewerId: actorId }, select: { revision: true, tradition: true } },
    },
  })
  const waiting = candidates
    .map((claim) => ({ claim, options: traditionsAwaiting(claim.requiredTraditions, claim.revision, claim.reviews, mine) }))
    .filter((entry) => entry.options.length > 0)
  const shown = waiting.slice(0, PAGE_SIZE)

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">{isAdmin ? 'Project editor' : 'Reviewer'}</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">Review queue</h1>
      {isAdmin ? (
        <p className="mt-4 leading-7 text-slate-700">
          You are checking as the <strong>project editor</strong>, standing in until members of each tradition can review. For each
          claim, ask one question: is it a fair description of the tradition it names? Your check is shown publicly as &ldquo;checked
          by the project editor, awaiting a reviewer from that tradition&rdquo;. It is never presented as a review by the tradition itself.
          If something is wrong, choose &ldquo;needs changes&rdquo; and say what.
        </p>
      ) : (
        <p className="mt-4 leading-7 text-slate-700">
          You review for {mine.map((t) => TRADITION_LABEL[t]).join(' and ')}. For each claim, ask one question: would a thoughtful
          member of your tradition recognise this as a fair description of it? You are not asked whether it is true.
          If you object, say what is wrong. Your comment is read by the editors and is not published.
        </p>
      )}

      {shown.length === 0 ? (
        <p className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-slate-600">Nothing is waiting for you. Thank you.</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-slate-500">{waiting.length} waiting{waiting.length > shown.length ? `, showing the first ${shown.length}. Reload after saving to see more.` : '.'}</p>
          <ul className="mt-4 space-y-6">
            {shown.map(({ claim, options }) => {
              const verse = claim.verses[0]?.verse
              return (
                <li key={claim.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold text-slate-500">
                    {claim.source.title}{verse ? ` · ${formatVerseRef(verse)}` : ''} · {claim.editorialStatus === 'IN_REVIEW' ? 'awaiting publication' : 'already published, not yet reviewed'}
                  </p>
                  <p className="mt-2 leading-7 text-slate-900">{claim.statement}</p>
                  <ReviewForm claimId={claim.id} traditions={options.map((t) => ({ value: t, label: TRADITION_LABEL[t] }))} standingIn={isAdmin} />
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
