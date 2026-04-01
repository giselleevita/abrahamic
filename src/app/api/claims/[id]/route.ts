import { NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { claimHash } from '@/lib/hash'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
  return NextResponse.json(claim)
}

const updateSchema = z.object({
  statement: z.string().min(10).max(2000).optional(),
  notes: z.string().optional(),
  isPublished: z.boolean().optional(),
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

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { verseIds, figureIds, themeIds, statement, ...rest } = parsed.data

  const existing = await prisma.claim.findUniqueOrThrow({ where: { id: parseInt(id) } })

  const newHash = statement ? claimHash(existing.sourceId, statement) : undefined

  const claim = await prisma.claim.update({
    where: { id: parseInt(id) },
    data: {
      ...(statement ? { statement, contentHash: newHash } : {}),
      ...rest,
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

  revalidatePath('/comparisons', 'layout')
  return NextResponse.json(claim)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.claim.delete({ where: { id: parseInt(id) } })
  revalidatePath('/comparisons', 'layout')
  return NextResponse.json({ ok: true })
}
