import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const events = await prisma.timelineEvent.findMany({
    where: { isPublished: true },
    include: { traditions: true },
    orderBy: [{ era: 'asc' }, { position: 'asc' }],
  })
  return NextResponse.json(events)
}

const ERAS = ['PRIMORDIAL','PATRIARCHAL','EXODUS','KINGDOM','GOSPEL','EARLY_ISLAM'] as const
const TRADITIONS = ['JEWISH','CHRISTIAN','ISLAMIC','SHARED'] as const
const PRESENCES = ['AFFIRMED','MODIFIED','SILENT','REJECTED'] as const

const createSchema = z.object({
  name: z.string().min(1).max(300),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  era: z.enum(ERAS),
  position: z.number().int(),
  summary: z.string().optional(),
  isPublished: z.boolean().optional(),
  traditions: z.array(z.object({
    tradition: z.enum(TRADITIONS),
    presence: z.enum(PRESENCES),
    notes: z.string().optional(),
  })).optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { traditions, ...data } = parsed.data

  const event = await prisma.timelineEvent.create({
    data: {
      ...data,
      traditions: traditions ? { create: traditions } : undefined,
    },
    include: { traditions: true },
  })

  return NextResponse.json(event, { status: 201 })
}
