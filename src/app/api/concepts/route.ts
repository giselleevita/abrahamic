import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const concepts = await prisma.concept.findMany({
    where: { isPublished: true },
    include: { traditions: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(concepts)
}

const CATEGORIES = ['THEOLOGY','SOTERIOLOGY','ESCHATOLOGY','PROPHETHOOD','PRACTICE','LAW','COSMOLOGY'] as const
const TRADITIONS = ['JEWISH','CHRISTIAN','ISLAMIC','SHARED'] as const

const traditionSchema = z.object({
  tradition: z.enum(TRADITIONS),
  definition: z.string().min(1),
  nuances: z.string().optional(),
})

const createSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  category: z.enum(CATEGORIES),
  summary: z.string().optional(),
  isPublished: z.boolean().optional(),
  traditions: z.array(traditionSchema).optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { traditions, ...data } = parsed.data

  const concept = await prisma.concept.create({
    data: {
      ...data,
      traditions: traditions ? { create: traditions } : undefined,
    },
    include: { traditions: true },
  })

  return NextResponse.json(concept, { status: 201 })
}
