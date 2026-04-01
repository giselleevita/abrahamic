import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

const schema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reviewNotes: z.string().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const candidate = await prisma.verseLinkCandidate.findUnique({ where: { id: parseInt(id) } })
  if (!candidate) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.verseLinkCandidate.update({
    where: { id: parseInt(id) },
    data: {
      status: parsed.data.status,
      reviewNotes: parsed.data.reviewNotes,
      reviewedAt: new Date(),
    },
  })

  // On approval: create the real VerseLink record
  if (parsed.data.status === 'APPROVED') {
    await prisma.verseLink.upsert({
      where: {
        verseAId_verseBId_linkType: {
          verseAId: candidate.verseAId,
          verseBId: candidate.verseBId,
          linkType: candidate.linkType,
        },
      },
      update: {},
      create: {
        verseAId: candidate.verseAId,
        verseBId: candidate.verseBId,
        linkType: candidate.linkType,
        notes: `Approved from AI proposal. Rationale: ${candidate.aiRationale}`,
      },
    })
  }

  return NextResponse.json(updated)
}
