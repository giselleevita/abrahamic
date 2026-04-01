import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const figures = await prisma.figure.findMany({
    include: {
      aliases: { orderBy: { tradition: 'asc' } },
      _count: { select: { claims: true } },
    },
    orderBy: { canonicalName: 'asc' },
  })
  return NextResponse.json(figures)
}

const aliasSchema = z.object({
  tradition: z.enum(['JEWISH', 'CHRISTIAN', 'ISLAMIC', 'SHARED']),
  name: z.string().min(1).max(200),
  language: z.string().max(100).optional(),
  notes: z.string().optional(),
})

const createSchema = z.object({
  canonicalName: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  aliases: z.array(aliasSchema).optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { aliases, ...data } = parsed.data

  const figure = await prisma.figure.create({
    data: {
      ...data,
      aliases: aliases ? { create: aliases } : undefined,
    },
    include: { aliases: true, _count: { select: { claims: true } } },
  })

  return NextResponse.json(figure, { status: 201 })
}
