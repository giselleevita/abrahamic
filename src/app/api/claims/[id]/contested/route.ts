import { NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { revalidateEntity } from '@/lib/cache'
import { summarizeSignoff, type ReviewRow, type ReviewTradition } from '@/lib/editorial/signoff'

const schema = z.object({
  isContested: z.boolean(),
  // The reason is the accountability for overriding a reviewer's objection.
  reason: z.string().trim().min(10).max(1000),
})

/**
 * Administrator only. Marks a claim as contested: a tradition's reviewer disagrees with the
 * wording, and we publish it anyway while saying so. This is the only way past an objection.
 * It requires that an objection actually exists, and it is reset by any change of wording.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const claimId = Number((await params).id)
  if (!Number.isInteger(claimId)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    select: { revision: true, requiredTraditions: true, isContested: true },
  })
  if (!claim) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const rows = await prisma.claimReview.findMany({
    where: { claimId, revision: claim.revision },
    select: { tradition: true, kind: true, verdict: true },
  })
  const reviews = rows.filter((row): row is ReviewRow => row.tradition !== 'SHARED')
  if (parsed.data.isContested && !reviews.some((review) => review.verdict !== 'ACCURATE')) {
    return NextResponse.json({ error: 'Nothing is contested: no reviewer has raised a concern about this wording' }, { status: 409 })
  }

  const required = claim.requiredTraditions.filter((t): t is ReviewTradition => t !== 'SHARED')
  const summary = summarizeSignoff(required, reviews, parsed.data.isContested, claim.revision)
  await prisma.$transaction(async (tx) => {
    await tx.claim.update({ where: { id: claimId }, data: { isContested: parsed.data.isContested, signoffSummary: summary } })
    await tx.editorialAuditEvent.create({
      data: {
        entityType: 'Claim', entityId: String(claimId), action: parsed.data.isContested ? 'MARK_CONTESTED' : 'CLEAR_CONTESTED',
        actorId: guard.value.id, actorRole: 'ADMIN',
        before: { isContested: claim.isContested }, after: { isContested: parsed.data.isContested, reason: parsed.data.reason },
      },
    })
  })

  revalidatePath('/comparisons', 'layout')
  revalidateEntity('claim', { tags: ['claims'] })
  return NextResponse.json({ isContested: parsed.data.isContested, summary })
}
