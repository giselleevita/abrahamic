import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStaffSessionSafe } from '@/lib/api-auth'
import { revalidateEntity } from '@/lib/cache'
import { signoffConflict } from '@/lib/editorial/signoff-api'

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
  if (!/^[1-9]\d*$/.test(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const numericId = Number(id)

  // Staff may read drafts. Everyone else sees a comparison only once it is published, and only
  // the claims in it that are themselves published.
  const staff = Boolean(await getStaffSessionSafe())
  const comparison = await prisma.comparison.findUnique({
    where: { id: numericId },
    include: staff
      ? claimInclude
      : { claims: { ...claimInclude.claims, where: { claim: { isPublished: true } } } },
  })
  if (!comparison || (!staff && !comparison.isPublished)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(comparison)
}

const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  tag: z.enum(['SHARED', 'SIMILAR_DIFFERENT', 'CONTRADICTION']).optional(),
  summary: z.string().optional(),
  sharedGround: z.string().max(3000).nullable().optional(),
  keyDifferences: z.string().max(3000).nullable().optional(),
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
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { claimIds, ...data } = parsed.data

  const outcome = await prisma.comparison.update({
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
  }).catch((error: unknown) => signoffConflict(error) ?? Promise.reject(error))
  // Publishing needs every claim in the comparison to be published (signed off) first.
  if (outcome instanceof NextResponse) return outcome
  const comparison = outcome

  revalidateEntity('comparison', { tags: ['comparisons'] })
  return NextResponse.json(comparison)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await prisma.comparison.delete({ where: { id: parseInt(id) } })
  revalidateEntity('comparison', { tags: ['comparisons'] })
  return NextResponse.json({ ok: true })
}
