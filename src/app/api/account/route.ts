import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireContributor } from '@/lib/api-auth'

/** Deletes the caller's own account and applications. The audit entry keeps no personal data. */
export async function DELETE() {
  const guard = await requireContributor()
  if (!guard.ok) return guard.response

  await prisma.$transaction(async (tx) => {
    await tx.user.delete({ where: { id: guard.value.id } })
    await tx.editorialAuditEvent.create({
      data: {
        entityType: 'User', entityId: guard.value.id, action: 'SELF_DELETE',
        actorId: guard.value.id, actorRole: guard.value.role,
      },
    })
  })
  return NextResponse.json({ deleted: true })
}
