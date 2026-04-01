import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const tag = searchParams.get('tag')
  const figureSlug = searchParams.get('figure')
  const themeSlug = searchParams.get('theme')

  const comparisons = await prisma.comparison.findMany({
    where: {
      isPublished: true,
      ...(tag ? { tag: tag as 'SHARED' | 'SIMILAR_DIFFERENT' | 'CONTRADICTION' } : {}),
      ...(figureSlug || themeSlug
        ? {
            claims: {
              some: {
                claim: {
                  ...(figureSlug
                    ? { figures: { some: { figure: { slug: figureSlug } } } }
                    : {}),
                  ...(themeSlug
                    ? { themes: { some: { theme: { slug: themeSlug } } } }
                    : {}),
                },
              },
            },
          }
        : {}),
    },
    include: {
      claims: {
        orderBy: { position: 'asc' },
        include: {
          claim: {
            include: {
              source: true,
              verses: {
                where: { isPrimary: true },
                include: {
                  verse: {
                    include: { translations: { where: { isDefault: true } } },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(comparisons)
}

const createSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  tag: z.enum(['SHARED', 'SIMILAR_DIFFERENT', 'CONTRADICTION']),
  summary: z.string().optional(),
  isControversial: z.boolean().optional(),
  claimIds: z.array(z.number()).min(2),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { claimIds, ...data } = parsed.data

  const comparison = await prisma.comparison.create({
    data: {
      ...data,
      createdById: session.user?.email ?? undefined,
      claims: {
        create: claimIds.map((claimId, i) => ({ claimId, position: i })),
      },
    },
    include: { claims: { include: { claim: { include: { source: true } } } } },
  })

  revalidatePath('/comparisons', 'layout')
  return NextResponse.json(comparison, { status: 201 })
}
