import { NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { claimHash } from '@/lib/hash'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStaffSessionSafe } from '@/lib/api-auth'
import { canDelete, canEdit, canTransition, roleFromSession } from '@/lib/editorial-policy'
import { requiredTraditionsFor, unmetSignoffs } from '@/lib/editorial/signoff'
import { missingMessage, reviewTraditionSchema, signoffConflict } from '@/lib/editorial/signoff-api'
import { revalidateEntity } from '@/lib/cache'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getStaffSessionSafe()
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
  extraTraditions: z.array(reviewTraditionSchema).optional(),
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

  const { verseIds, figureIds, themeIds, statement, isPublished, editorialStatus, extraTraditions, ...rest } = parsed.data

  const existing = await prisma.claim.findUniqueOrThrow({ where: { id: parseInt(id) }, include: { source: { select: { tradition: true } } } })
  if (!canEdit(role, existing.editorialStatus)) {
    return NextResponse.json({ error: 'Role cannot edit content in this state' }, { status: 403 })
  }
  const targetStatus = editorialStatus ?? (isPublished === undefined ? existing.editorialStatus : isPublished ? 'PUBLISHED' : 'DRAFT')
  if (!canTransition(role, existing.editorialStatus, targetStatus)) {
    return NextResponse.json({ error: 'Editorial state transition is not allowed' }, { status: 403 })
  }

  const newHash = statement ? claimHash(existing.sourceId, statement) : undefined

  // Changing the wording or the cited verses starts a new revision, which voids earlier sign-offs.
  const changesMeaning = Boolean(verseIds) || (statement !== undefined && statement !== existing.statement)
  const required = extraTraditions
    ? requiredTraditionsFor(existing.source.tradition, extraTraditions)
    : existing.requiredTraditions.filter((t): t is 'JEWISH' | 'CHRISTIAN' | 'ISLAMIC' => t !== 'SHARED')

  if (targetStatus === 'PUBLISHED' && existing.editorialStatus !== 'PUBLISHED') {
    const reviews = changesMeaning
      ? []
      : await prisma.claimReview.findMany({
          where: { claimId: existing.id, revision: existing.revision },
          select: { tradition: true, kind: true, verdict: true },
        })
    const reviewRows = reviews.filter(
      (r): r is typeof r & { tradition: 'JEWISH' | 'CHRISTIAN' | 'ISLAMIC' } => r.tradition !== 'SHARED',
    )
    const gate = unmetSignoffs(required, reviewRows, changesMeaning ? false : existing.isContested)
    if (!gate.allowed) {
      return NextResponse.json(
        { error: missingMessage(gate.missing, gate.blockedByConcern), missing: gate.missing },
        { status: 409 },
      )
    }
  }

  const outcome = await prisma.$transaction(async (tx) => {
    const updated = await tx.claim.update({
      where: { id: parseInt(id) },
      data: {
      ...(statement ? { statement, contentHash: newHash } : {}),
      ...rest,
      ...(extraTraditions ? { requiredTraditions: required } : {}),
      ...(verseIds ? { revision: { increment: 1 } } : {}),
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
  }).catch((error: unknown) => signoffConflict(error) ?? Promise.reject(error))
  // A database sign-off error (for example a race with a new objection) becomes a 409.
  if (outcome instanceof NextResponse) return outcome
  const claim = outcome

  revalidatePath('/comparisons', 'layout')
  revalidateEntity('claim', { tags: ['claims'] })
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
  revalidateEntity('claim', { tags: ['claims'] })
  return NextResponse.json({ ok: true })
}
