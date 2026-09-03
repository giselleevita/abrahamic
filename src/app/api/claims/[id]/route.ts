import { NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { claimHash } from '@/lib/hash'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canDelete, canEdit, canTransition, roleFromSession } from '@/lib/editorial-policy'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const claim = await prisma.claim.findUnique({
    where: { id: parseInt(id) },
    include: {
      source: true,
      verses: {
        include: {
          verse: { include: { translations: true } },
        },
      },
      figures: { include: { figure: true } },
      themes: { include: { theme: true } },
    },
  })
  if (!claim) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!claim.isPublished && roleFromSession(session) === 'VIEWER') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(claim)
}

const updateSchema = z.object({
  statement: z.string().min(10).max(2000).optional(),
  notes: z.string().optional(),
  isPublished: z.boolean().optional(),
  editorialStatus: z.enum(['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
  interpretationScope: z.enum(['LITERAL', 'MAJORITY_SCHOLARLY', 'SPECIFIC_TRADITION']).nullish(),
  specificTradition: z.string().max(100).nullish(),
  verseIds: z.array(z.number()).min(1).optional(),
  figureIds: z.array(z.number()).optional(),
  themeIds: z.array(z.number()).optional(),
})

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = roleFromSession(session)

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { verseIds, figureIds, themeIds, statement, isPublished, editorialStatus, ...rest } = parsed.data

  const existing = await prisma.claim.findUniqueOrThrow({ where: { id: parseInt(id) } })
  if (!canEdit(role, existing.editorialStatus)) {
    return NextResponse.json({ error: 'Role cannot edit content in this state' }, { status: 403 })
  }
  const targetStatus = editorialStatus ?? (isPublished === undefined ? existing.editorialStatus : isPublished ? 'PUBLISHED' : 'DRAFT')
  if (!canTransition(role, existing.editorialStatus, targetStatus)) {
    return NextResponse.json({ error: 'Editorial state transition is not allowed' }, { status: 403 })
  }

  const newHash = statement ? claimHash(existing.sourceId, statement) : undefined

  const claim = await prisma.$transaction(async (tx) => {
    const updated = await tx.claim.update({
      where: { id: parseInt(id) },
      data: {
      ...(statement ? { statement, contentHash: newHash } : {}),
      ...rest,
      editorialStatus: targetStatus,
      isPublished: targetStatus === 'PUBLISHED',
      ...(verseIds
        ? {
            verses: {
              deleteMany: {},
              create: verseIds.map((verseId, i) => ({ verseId, isPrimary: i === 0 })),
            },
          }
        : {}),
      ...(figureIds
        ? {
            figures: {
              deleteMany: {},
              create: figureIds.map((figureId) => ({ figureId })),
            },
          }
        : {}),
      ...(themeIds
        ? {
            themes: {
              deleteMany: {},
              create: themeIds.map((themeId) => ({ themeId })),
            },
          }
        : {}),
    },
      include: {
        source: true,
        verses: { include: { verse: true } },
        figures: { include: { figure: true } },
        themes: { include: { theme: true } },
      },
    })
    await tx.editorialAuditEvent.create({
      data: {
        entityType: 'Claim', entityId: id, action: 'UPDATE', actorId: session.user.id,
        actorRole: role,
        before: { editorialStatus: existing.editorialStatus, contentHash: existing.contentHash },
        after: { editorialStatus: updated.editorialStatus, contentHash: updated.contentHash },
      },
    })
    return updated
  })

  revalidatePath('/comparisons', 'layout')
  return NextResponse.json(claim)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = roleFromSession(session)
  if (!canDelete(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await prisma.$transaction(async (tx) => {
    const existing = await tx.claim.findUniqueOrThrow({ where: { id: parseInt(id) } })
    await tx.claim.delete({ where: { id: parseInt(id) } })
    await tx.editorialAuditEvent.create({
      data: {
        entityType: 'Claim', entityId: id, action: 'DELETE', actorId: session.user.id,
        actorRole: role, before: { editorialStatus: existing.editorialStatus, contentHash: existing.contentHash },
      },
    })
  })
  revalidatePath('/comparisons', 'layout')
  return NextResponse.json({ ok: true })
}
