import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  const verseId = req.nextUrl.searchParams.get('verseId')
  if (!verseId) return NextResponse.json({ error: 'verseId required' }, { status: 400 })

  const id = parseInt(verseId)
  const links = await prisma.verseLink.findMany({
    where: { OR: [{ verseAId: id }, { verseBId: id }] },
    include: {
      verseA: { include: { source: true, translations: { where: { isDefault: true } } } },
      verseB: { include: { source: true, translations: { where: { isDefault: true } } } },
    },
  })

  return NextResponse.json(links)
}

const createSchema = z.object({
  verseAId: z.number(),
  verseBId: z.number(),
  linkType: z.enum(['PARALLEL', 'CONTRAST', 'ELABORATION', 'FULFILLMENT_CLAIM']),
  notes: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const link = await prisma.verseLink.create({
    data: parsed.data,
    include: {
      verseA: { include: { source: true, translations: { where: { isDefault: true } } } },
      verseB: { include: { source: true, translations: { where: { isDefault: true } } } },
    },
  })

  return NextResponse.json(link, { status: 201 })
}
