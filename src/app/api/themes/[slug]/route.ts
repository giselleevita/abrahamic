import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const theme = await prisma.theme.findUnique({ where: { slug } })
  if (!theme) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const claims = await prisma.claim.findMany({
    where: { isPublished: true, themes: { some: { theme: { slug } } } },
    include: {
      source: true,
      verses: {
        where: { isPrimary: true },
        include: {
          verse: { include: { translations: { where: { isDefault: true } } } },
        },
      },
      figures: { include: { figure: true } },
      themes: { include: { theme: true } },
    },
  })

  return NextResponse.json({ ...theme, claimList: claims })
}

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().nullish(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullish(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const theme = await prisma.theme.update({
    where: { slug },
    data: parsed.data,
    include: { _count: { select: { claims: true } } },
  })

  return NextResponse.json(theme)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  await prisma.theme.delete({ where: { slug } })
  return NextResponse.json({ ok: true })
}
