import prisma from '@/lib/prisma'
import { ContestedControl, ReviewForm } from '@/components/admin/SignoffControls'
import {
  REVIEW_TRADITIONS,
  TRADITION_LABEL,
  describeState,
  summarizeSignoff,
  unmetSignoffs,
  type ReviewRow,
  type ReviewTradition,
} from '@/lib/editorial/signoff'

const VERDICT_LABEL = { ACCURATE: 'Accurate', NEEDS_CHANGES: 'Needs changes', OBJECTS: 'Objects' } as const

/** Sign-off status for one claim: who must review, what has been said, and what still blocks publishing. */
export async function SignoffPanel({ claimId, role }: { claimId: number; role: 'ADMIN' | 'EDITOR' | 'VIEWER' }) {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    select: { revision: true, requiredTraditions: true, isContested: true, editorialStatus: true },
  })
  if (!claim) return null

  const reviews = await prisma.claimReview.findMany({
    where: { claimId, revision: claim.revision },
    orderBy: { createdAt: 'asc' },
  })
  const required = REVIEW_TRADITIONS.filter((t) => claim.requiredTraditions.includes(t))
  const rows = reviews.filter((r): r is typeof r & { tradition: ReviewTradition } => r.tradition !== 'SHARED') as (ReviewRow & { tradition: ReviewTradition })[]
  const summary = summarizeSignoff(required, rows, claim.isContested, claim.revision)
  const gate = unmetSignoffs(required, rows, claim.isContested)
  const hasConcern = rows.some((r) => r.verdict !== 'ACCURATE')
  const canReview = role === 'ADMIN' && (claim.editorialStatus === 'IN_REVIEW' || claim.editorialStatus === 'PUBLISHED')

  return (
    <section className="mt-10 rounded-xl border border-stone-200 bg-white p-6" aria-labelledby="signoff-heading">
      <h2 id="signoff-heading" className="text-lg font-bold text-stone-900">Tradition sign-off</h2>
      <p className="mt-1 text-sm text-stone-600">
        Revision {claim.revision}. To publish, a member of each tradition below must confirm it is fairly described.
        Changing the wording or the cited verses starts a new revision and clears these.
      </p>

      {required.length === 0 ? (
        <p className="mt-4 text-sm text-amber-800">This claim has no required traditions, so it cannot be published.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {required.map((tradition) => (
            <li key={tradition} className="flex items-center justify-between rounded-lg border border-stone-100 px-3 py-2 text-sm">
              <span className="font-medium text-stone-800">{TRADITION_LABEL[tradition]}</span>
              <span className="text-stone-600">{describeState(tradition, summary.states[tradition] ?? 'AWAITING')}</span>
            </li>
          ))}
        </ul>
      )}

      <p className={`mt-4 text-sm font-medium ${gate.allowed ? 'text-emerald-700' : 'text-stone-700'}`}>
        {gate.allowed
          ? 'Ready to publish.'
          : gate.missing.length > 0
            ? `Still needed: ${gate.missing.map((t) => TRADITION_LABEL[t]).join(', ')}.`
            : gate.blockedByConcern
              ? 'Blocked by an unresolved concern.'
              : 'Not ready to publish.'}
      </p>

      {rows.length > 0 && (
        <ul className="mt-4 divide-y divide-stone-100 rounded-lg border border-stone-100">
          {reviews.map((review) => (
            <li key={review.id} className="px-3 py-3 text-sm">
              <p className="font-medium text-stone-800">
                {review.tradition === 'SHARED' ? '' : TRADITION_LABEL[review.tradition]} · {VERDICT_LABEL[review.verdict]}
                <span className="ml-2 text-xs font-normal text-stone-500">
                  {review.kind === 'PROJECT_EDITOR' ? 'project editor' : 'tradition member'} · {review.createdAt.toISOString().slice(0, 10)}
                </span>
              </p>
              {review.comment && <p className="mt-1 whitespace-pre-wrap text-stone-600">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}

      {canReview && (
        <>
          <ReviewForm claimId={claimId} standingIn traditions={required.map((t) => ({ value: t, label: TRADITION_LABEL[t] }))} />
          <ContestedControl claimId={claimId} isContested={claim.isContested} hasConcern={hasConcern} />
        </>
      )}
    </section>
  )
}
