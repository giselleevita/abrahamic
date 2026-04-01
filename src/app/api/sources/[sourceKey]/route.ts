import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sourceKey: string }> }
) {
  const { sourceKey } = await params
  const source = await prisma.source.findUnique({
    where: { key: sourceKey.toUpperCase() as never },
    include: { _count: { select: { verses: true, claims: true } } },
  })
  if (!source) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(source)
}

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullish(),
  language: z.string().max(50).optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ sourceKey: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sourceKey } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const source = await prisma.source.update({
    where: { key: sourceKey.toUpperCase() as never },
    data: parsed.data,
    include: { _count: { select: { verses: true, claims: true } } },
  })

  return NextResponse.json(source)
}
