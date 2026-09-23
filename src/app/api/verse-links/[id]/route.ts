import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidateEntity } from '@/lib/cache'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.verseLink.delete({ where: { id: parseInt(id) } })
  revalidateEntity('verseLink', { tags: ['verse-links'] })
  return NextResponse.json({ ok: true })
}
