import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const TRANSLATION_LABELS = ['ORIGINAL', 'CLASSIC', 'MODERN', 'SCHOLARLY'] as const

const createSchema = z.object({
  verseId: z.number(),
  label: z.enum(TRANSLATION_LABELS),
  name: z.string().min(1).max(200),
  text: z.string().min(1),
  isDefault: z.boolean().optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { verseId, isDefault, ...data } = parsed.data

  if (isDefault) {
    await prisma.verseTranslation.updateMany({
      where: { verseId, isDefault: true },
      data: { isDefault: false },
    })
  }

  const translation = await prisma.verseTranslation.create({
    data: { verseId, isDefault: isDefault ?? false, ...data },
  })

  return NextResponse.json(translation, { status: 201 })
}
