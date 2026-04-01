import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const TRANSLATION_LABELS = ['ORIGINAL', 'CLASSIC', 'MODERN', 'SCHOLARLY'] as const

const updateSchema = z.object({
  label: z.enum(TRANSLATION_LABELS).optional(),
  name: z.string().min(1).max(200).optional(),
  text: z.string().min(1).optional(),
  isDefault: z.boolean().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { isDefault, ...data } = parsed.data

  if (isDefault) {
    const existing = await prisma.verseTranslation.findUnique({ where: { id: parseInt(id) } })
    if (existing) {
      await prisma.verseTranslation.updateMany({
        where: { verseId: existing.verseId, isDefault: true },
        data: { isDefault: false },
      })
    }
  }

  const translation = await prisma.verseTranslation.update({
    where: { id: parseInt(id) },
    data: { ...data, ...(isDefault !== undefined ? { isDefault } : {}) },
  })

  return NextResponse.json(translation)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.verseTranslation.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ ok: true })
}
