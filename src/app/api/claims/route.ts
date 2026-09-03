import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { claimHash } from '@/lib/hash'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canTransition, roleFromSession } from '@/lib/editorial-policy'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { searchParams } = req.nextUrl
  const sourceKey = searchParams.get('sourceKey')
  const figureSlug = searchParams.get('figure')
  const themeSlug = searchParams.get('theme')
  const requestedPublished = searchParams.get('published')
  const role = roleFromSession(session)
  const published = role === 'VIEWER' ? true : requestedPublished === null ? undefined : requestedPublished === 'true'

  const claims = await prisma.claim.findMany({
    where: {
      ...(published !== undefined ? { isPublished: published } : {}),
      ...(sourceKey ? { source: { key: sourceKey as 'TORAH' | 'HEBREW_BIBLE' | 'NEW_TESTAMENT' | 'QURAN' } } : {}),
      ...(figureSlug ? { figures: { some: { figure: { slug: figureSlug } } } } : {}),
      ...(themeSlug ? { themes: { some: { theme: { slug: themeSlug } } } } : {}),
    },
    include: {
      source: true,
      verses: {
        include: {
          verse: { include: { translations: { where: { isDefault: true } } } },
        },
      },
      figures: { include: { figure: true } },
      themes: { include: { theme: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(claims)
}

const createSchema = z.object({
  sourceId: z.number(),
  statement: z.string().min(10).max(2000),
  notes: z.string().optional(),
  verseIds: z.array(z.number()).min(1, 'At least one verse is required'),
  figureIds: z.array(z.number()).optional(),
  themeIds: z.array(z.number()).optional(),
  isPublished: z.boolean().optional(),
  editorialStatus: z.enum(['DRAFT', 'IN_REVIEW']).optional(),
  interpretationScope: z.enum(['LITERAL', 'MAJORITY_SCHOLARLY', 'SPECIFIC_TRADITION']).optional(),
  specificTradition: z.string().max(100).optional(),
}).refine(
  (d) => d.interpretationScope !== 'SPECIFIC_TRADITION' || !!d.specificTradition,
  { message: 'specificTradition is required when interpretationScope is SPECIFIC_TRADITION', path: ['specificTradition'] }
)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const role = roleFromSession(session)

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { verseIds, figureIds, themeIds, isPublished, editorialStatus, ...data } = parsed.data
  const targetStatus = editorialStatus ?? (isPublished ? 'PUBLISHED' : 'DRAFT')
  if (!canTransition(role, 'DRAFT', targetStatus)) {
    return NextResponse.json({ error: 'Role cannot create content in the requested state' }, { status: 403 })
  }
  const hash = claimHash(data.sourceId, data.statement)

  // Check for duplicate
  const existing = await prisma.claim.findUnique({ where: { contentHash: hash } })
  if (existing) return NextResponse.json({ error: 'Duplicate claim detected' }, { status: 409 })

  const claim = await prisma.$transaction(async (tx) => {
    const created = await tx.claim.create({
      data: {
        ...data,
        contentHash: hash,
        editorialStatus: targetStatus,
        isPublished: targetStatus === 'PUBLISHED',
        verses: { create: verseIds.map((verseId, i) => ({ verseId, isPrimary: i === 0 })) },
        figures: figureIds ? { create: figureIds.map((figureId) => ({ figureId })) } : undefined,
        themes: themeIds ? { create: themeIds.map((themeId) => ({ themeId })) } : undefined,
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
        entityType: 'Claim', entityId: String(created.id), action: 'CREATE',
        actorId: session.user.id, actorRole: role, after: { editorialStatus: targetStatus },
      },
    })
    return created
  })

  revalidatePath('/comparisons', 'layout')
  return NextResponse.json(claim, { status: 201 })
}
