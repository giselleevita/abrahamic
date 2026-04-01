import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const concept = await prisma.concept.findUnique({
    where: { slug },
    include: { traditions: true },
  })
  if (!concept) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(concept)
}

const CATEGORIES = ['THEOLOGY','SOTERIOLOGY','ESCHATOLOGY','PROPHETHOOD','PRACTICE','LAW','COSMOLOGY'] as const
const TRADITIONS = ['JEWISH','CHRISTIAN','ISLAMIC','SHARED'] as const

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  category: z.enum(CATEGORIES).optional(),
  summary: z.string().nullish(),
  isPublished: z.boolean().optional(),
  traditions: z.array(z.object({
    tradition: z.enum(TRADITIONS),
    definition: z.string().min(1),
    nuances: z.string().nullish(),
  })).optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { traditions, ...data } = parsed.data

  const concept = await prisma.concept.update({
    where: { slug },
    data: {
      ...data,
      ...(traditions !== undefined ? {
        traditions: {
          deleteMany: {},
          create: traditions,
        },
      } : {}),
    },
    include: { traditions: true },
  })

  return NextResponse.json(concept)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  await prisma.concept.delete({ where: { slug } })
  return NextResponse.json({ ok: true })
}
