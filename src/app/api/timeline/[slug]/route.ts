import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const ERAS = ['PRIMORDIAL','PATRIARCHAL','EXODUS','KINGDOM','GOSPEL','EARLY_ISLAM'] as const
const TRADITIONS = ['JEWISH','CHRISTIAN','ISLAMIC','SHARED'] as const
const PRESENCES = ['AFFIRMED','MODIFIED','SILENT','REJECTED'] as const

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await prisma.timelineEvent.findUnique({
    where: { slug },
    include: { traditions: true },
  })
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(event)
}

const updateSchema = z.object({
  name: z.string().min(1).max(300).optional(),
  era: z.enum(ERAS).optional(),
  position: z.number().int().optional(),
  summary: z.string().nullish(),
  isPublished: z.boolean().optional(),
  traditions: z.array(z.object({
    tradition: z.enum(TRADITIONS),
    presence: z.enum(PRESENCES),
    notes: z.string().nullish(),
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

  const event = await prisma.timelineEvent.update({
    where: { slug },
    data: {
      ...data,
      ...(traditions !== undefined ? {
        traditions: { deleteMany: {}, create: traditions },
      } : {}),
    },
    include: { traditions: true },
  })

  return NextResponse.json(event)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  await prisma.timelineEvent.delete({ where: { slug } })
  return NextResponse.json({ ok: true })
}
