import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const schema = z.object({ status: z.enum(['SEEN', 'ACTIONED', 'DISMISSED']) })

/** Staff: mark a public report as seen, acted on, or dismissed. The handler is recorded. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const id = Number((await params).id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const before = await prisma.correctionReport.findUnique({ where: { id }, select: { status: true } })
  if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.$transaction(async (tx) => {
    const report = await tx.correctionReport.update({
      where: { id },
      data: { status: parsed.data.status, handledBy: session.user.id, handledAt: new Date() },
      select: { id: true, status: true },
    })
    await tx.editorialAuditEvent.create({
      data: {
        entityType: 'CorrectionReport', entityId: String(id), action: parsed.data.status,
        actorId: session.user.id, actorRole: session.user.role,
        before: { status: before.status }, after: { status: report.status },
      },
    })
    return report
  })
  return NextResponse.json(updated)
}
