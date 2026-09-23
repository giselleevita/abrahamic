import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidateEntity } from '@/lib/cache'

const claimInclude = {
  claims: {
    orderBy: { position: 'asc' as const },
    include: {
      claim: {
        include: {
          source: true,
          verses: {
            include: {
              verse: {
                include: { translations: true },
              },
            },
          },
          figures: { include: { figure: true } },
          themes: { include: { theme: true } },
        },
      },
    },
  },
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const comparison = await prisma.comparison.findUnique({
    where: { id: parseInt(id) },
    include: claimInclude,
  })
  if (!comparison) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(comparison)
}

const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  tag: z.enum(['SHARED', 'SIMILAR_DIFFERENT', 'CONTRADICTION']).optional(),
  summary: z.string().optional(),
  isPublished: z.boolean().optional(),
  isControversial: z.boolean().optional(),
  claimIds: z.array(z.number()).min(2).optional(),
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

  const { claimIds, ...data } = parsed.data

  const comparison = await prisma.comparison.update({
    where: { id: parseInt(id) },
    data: {
      ...data,
      ...(claimIds
        ? {
            claims: {
              deleteMany: {},
              create: claimIds.map((claimId, i) => ({ claimId, position: i })),
            },
          }
        : {}),
    },
    include: claimInclude,
  })

  revalidateEntity('comparison', { tags: ['comparisons'] })
  return NextResponse.json(comparison)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.comparison.delete({ where: { id: parseInt(id) } })
  revalidateEntity('comparison', { tags: ['comparisons'] })
  return NextResponse.json({ ok: true })
}
