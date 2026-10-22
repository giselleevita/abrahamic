import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireContributor } from '@/lib/api-auth'
import { reviewerApplicationSchema } from '@/lib/schemas/accounts'

/** A contributor asks to review on behalf of one tradition. An administrator decides. */
export async function POST(req: Request) {
  const guard = await requireContributor()
  if (!guard.ok) return guard.response

  const parsed = reviewerApplicationSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const existing = await prisma.reviewerProfile.findUnique({
    where: { userId_tradition: { userId: guard.value.id, tradition: parsed.data.tradition } },
    select: { status: true },
  })
  if (existing) {
    return NextResponse.json({ error: `You already have a ${existing.status.toLowerCase()} application for this tradition` }, { status: 409 })
  }

  const profile = await prisma.$transaction(async (tx) => {
    const created = await tx.reviewerProfile.create({
      data: { userId: guard.value.id, ...parsed.data },
      select: { id: true, tradition: true, status: true, createdAt: true },
    })
    await tx.editorialAuditEvent.create({
      data: {
        entityType: 'ReviewerProfile', entityId: String(created.id), action: 'APPLY',
        actorId: guard.value.id, actorRole: guard.value.role, after: { tradition: created.tradition, status: created.status },
      },
    })
    return created
  })
  return NextResponse.json(profile, { status: 201 })
}
