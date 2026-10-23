import { NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireReviewActor } from '@/lib/api-auth'
import { revalidateEntity } from '@/lib/cache'
import { reviewKindFor, summarizeSignoff, type ReviewRow, type ReviewTradition } from '@/lib/editorial/signoff'
import { reviewTraditionSchema, signoffConflict } from '@/lib/editorial/signoff-api'

const reviewSchema = z.object({
  tradition: reviewTraditionSchema,
  verdict: z.enum(['ACCURATE', 'NEEDS_CHANGES', 'OBJECTS']),
  // A concern without an explanation is not actionable for the editors who must resolve it.
  comment: z.string().trim().max(2000).optional(),
}).refine((value) => value.verdict === 'ACCURATE' || (value.comment && value.comment.length >= 10), {
  message: 'Explain the concern (at least 10 characters)',
  path: ['comment'],
})

/**
 * Record (or change) a review of the claim's CURRENT revision for one tradition.
 * A member reviewer may speak only for their own approved tradition; the administrator may
 * stand in for any, always recorded as the project editor and never as a member of it.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireReviewActor()
  if (!guard.ok) return guard.response

  const parsed = reviewSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { tradition, verdict, comment } = parsed.data

  // Authority is decided from the session before the database is consulted.
  const kind = reviewKindFor(guard.value.actor, tradition)
  if (!kind) return NextResponse.json({ error: 'You are not an approved reviewer for this tradition' }, { status: 403 })

  const claimId = Number((await params).id)
  if (!Number.isInteger(claimId)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    select: { id: true, revision: true, requiredTraditions: true, isContested: true, editorialStatus: true },
  })
  if (!claim) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (claim.editorialStatus === 'DRAFT' || claim.editorialStatus === 'ARCHIVED') {
    return NextResponse.json({ error: 'Only claims that are in review or published can be reviewed' }, { status: 409 })
  }
  if (!claim.requiredTraditions.includes(tradition)) {
    return NextResponse.json({ error: 'This claim does not describe that tradition' }, { status: 400 })
  }

  const outcome = await prisma.$transaction(async (tx) => {
    const data = { kind, verdict, comment: comment ?? null }
    await tx.claimReview.upsert({
      where: {
        claimId_revision_tradition_reviewerId: {
          claimId, revision: claim.revision, tradition, reviewerId: guard.value.id,
        },
      },
      create: { claimId, revision: claim.revision, tradition, reviewerId: guard.value.id, ...data },
      update: data,
    })
    const rows = await tx.claimReview.findMany({
      where: { claimId, revision: claim.revision },
      select: { tradition: true, kind: true, verdict: true },
    })
    const required = claim.requiredTraditions.filter((t): t is ReviewTradition => t !== 'SHARED')
    const summary = summarizeSignoff(
      required,
      rows.filter((row): row is ReviewRow => row.tradition !== 'SHARED'),
      claim.isContested,
      claim.revision,
    )
    await tx.claim.update({ where: { id: claimId }, data: { signoffSummary: summary } })
    await tx.editorialAuditEvent.create({
      data: {
        entityType: 'Claim', entityId: String(claimId), action: 'REVIEW',
        actorId: guard.value.id, actorRole: guard.value.role,
        after: { tradition, verdict, kind, revision: claim.revision },
      },
    })
    return summary
  }).catch((error: unknown) => signoffConflict(error) ?? Promise.reject(error))
  if (outcome instanceof NextResponse) return outcome

  revalidatePath('/comparisons', 'layout')
  revalidateEntity('claim', { tags: ['claims'] })
  return NextResponse.json({ summary: outcome }, { status: 201 })
}
