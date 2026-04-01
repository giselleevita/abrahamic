import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { generateComparisonSummary } from '@/lib/ai'

const schema = z.object({ comparisonId: z.number() })

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const comparison = await prisma.comparison.findUnique({
    where: { id: parsed.data.comparisonId },
    include: {
      claims: {
        orderBy: { position: 'asc' },
        include: {
          claim: {
            include: {
              source: true,
              verses: {
                include: { verse: true },
              },
            },
          },
        },
      },
    },
  })

  if (!comparison) return NextResponse.json({ error: 'Comparison not found' }, { status: 404 })

  const claimsForSummary = comparison.claims.map(({ claim }) => ({
    statement: claim.statement,
    sourceTitle: claim.source.title,
    verseRefs: claim.verses.map((cv) => cv.verse.referenceKey),
  }))

  try {
    const summary = await generateComparisonSummary(comparison.title, comparison.tag, claimsForSummary)
    return NextResponse.json({ summary })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
