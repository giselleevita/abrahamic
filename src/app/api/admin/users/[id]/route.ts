import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { userUpdateSchema } from '@/lib/schemas/accounts'

/** Administrator: change a user's role (CONTRIBUTOR/EDITOR) or suspend/restore them. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if (!guard.ok) return guard.response

  const parsed = userUpdateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { id } = await params
  const before = await prisma.user.findUnique({ where: { id }, select: { role: true, status: true } })
  if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id },
      data: parsed.data,
      select: { id: true, role: true, status: true },
    })
    await tx.editorialAuditEvent.create({
      data: {
        entityType: 'User', entityId: id, action: 'UPDATE',
        actorId: guard.value.id, actorRole: 'ADMIN',
        before, after: { role: user.role, status: user.status },
      },
    })
    return user
  })
  return NextResponse.json(updated)
}
