import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { proposeVerseLinkCandidates } from '@/lib/ai'

const createSchema = z.object({
  verseAId: z.number(),
  verseBId: z.number(),
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = req.nextUrl.searchParams.get('status') ?? 'PENDING'

  const candidates = await prisma.verseLinkCandidate.findMany({
    where: { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' },
    include: {
      verseA: { include: { source: true, translations: { where: { isDefault: true } } } },
      verseB: { include: { source: true, translations: { where: { isDefault: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(candidates)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { verseAId, verseBId } = parsed.data
  if (verseAId === verseBId) {
    return NextResponse.json({ error: 'Cannot link a verse to itself' }, { status: 400 })
  }

  const [verseA, verseB] = await Promise.all([
    prisma.verse.findUnique({
      where: { id: verseAId },
      include: { source: true, translations: { where: { isDefault: true } } },
    }),
    prisma.verse.findUnique({
      where: { id: verseBId },
      include: { source: true, translations: { where: { isDefault: true } } },
    }),
  ])

  if (!verseA || !verseB) {
    return NextResponse.json({ error: 'Verse not found' }, { status: 404 })
  }

  const vA = {
    id: verseA.id,
    referenceKey: verseA.referenceKey,
    sourceTitle: verseA.source.title,
    text: verseA.translations[0]?.text ?? '',
  }
  const vB = {
    id: verseB.id,
    referenceKey: verseB.referenceKey,
    sourceTitle: verseB.source.title,
    text: verseB.translations[0]?.text ?? '',
  }

  const proposals = await proposeVerseLinkCandidates(vA, vB)

  const created = await Promise.all(
    proposals.map((p) =>
      prisma.verseLinkCandidate.upsert({
        where: { verseAId_verseBId_linkType: { verseAId, verseBId, linkType: p.linkType } },
        update: { aiRationale: p.rationale, status: 'PENDING', reviewedAt: null },
        create: {
          verseAId,
          verseBId,
          linkType: p.linkType,
          aiRationale: p.rationale,
        },
      })
    )
  )

  return NextResponse.json({ candidatesCreated: created.length, candidates: created })
}
