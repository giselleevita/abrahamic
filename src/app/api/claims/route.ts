import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { claimHash } from '@/lib/hash'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasSession } from '@/lib/api-auth'
import { sourceKeySchema, type SourceKeyInput } from '@/lib/schemas/enums'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const rawSourceKey = searchParams.get('sourceKey')
  const figureSlug = searchParams.get('figure')
  const themeSlug = searchParams.get('theme')
  const published = searchParams.get('published')

  let sourceKey: SourceKeyInput | null = null
  if (rawSourceKey) {
    const parsed = sourceKeySchema.safeParse(rawSourceKey)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid sourceKey', issues: parsed.error.flatten() },
        { status: 400 },
      )
    }
    sourceKey = parsed.data
  }

  // Unpublished claims are editorial drafts. Only an authenticated admin may
  // widen the filter; for anyone else the param is ignored rather than
  // rejected, so the public contract stays stable.
  const publishedFilter =
    published !== null && (await hasSession())
      ? published === 'all'
        ? {}
        : { isPublished: published === 'true' }
      : { isPublished: true }

  const claims = await prisma.claim.findMany({
    where: {
      ...publishedFilter,
      ...(sourceKey ? { source: { key: sourceKey } } : {}),
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
  interpretationScope: z.enum(['LITERAL', 'MAJORITY_SCHOLARLY', 'SPECIFIC_TRADITION']).optional(),
  specificTradition: z.string().max(100).optional(),
}).refine(
  (d) => d.interpretationScope !== 'SPECIFIC_TRADITION' || !!d.specificTradition,
  { message: 'specificTradition is required when interpretationScope is SPECIFIC_TRADITION', path: ['specificTradition'] }
)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { verseIds, figureIds, themeIds, ...data } = parsed.data
  const hash = claimHash(data.sourceId, data.statement)

  // Check for duplicate
  const existing = await prisma.claim.findUnique({ where: { contentHash: hash } })
  if (existing) return NextResponse.json({ error: 'Duplicate claim detected' }, { status: 409 })

  const claim = await prisma.claim.create({
    data: {
      ...data,
      contentHash: hash,
      isPublished: data.isPublished ?? false,
      verses: {
        create: verseIds.map((verseId, i) => ({ verseId, isPrimary: i === 0 })),
      },
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

  revalidatePath('/comparisons', 'layout')
  return NextResponse.json(claim, { status: 201 })
}
