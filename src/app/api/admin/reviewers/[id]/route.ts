import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { reviewerDecisionSchema } from '@/lib/schemas/accounts'

/**
 * Administrator: approve or revoke a reviewer for their tradition. This is the only
 * way a reviewer becomes approved. The decision and who made it are recorded, and the
 * database refuses a decided profile without both.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const parsed = reviewerDecisionSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const profileId = Number((await params).id)
  if (!Number.isInteger(profileId)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const before = await prisma.reviewerProfile.findUnique({
    where: { id: profileId },
    select: { status: true, tradition: true },
  })
  if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.$transaction(async (tx) => {
    const profile = await tx.reviewerProfile.update({
      where: { id: profileId },
      data: { status: parsed.data.status, decidedBy: guard.value.id, decidedAt: new Date() },
      select: { id: true, tradition: true, status: true },
    })
    await tx.editorialAuditEvent.create({
      data: {
        entityType: 'ReviewerProfile', entityId: String(profileId), action: parsed.data.status,
        actorId: guard.value.id, actorRole: 'ADMIN',
        before: { status: before.status, tradition: before.tradition }, after: { status: profile.status },
      },
    })
    return profile
  })
  return NextResponse.json(updated)
}
