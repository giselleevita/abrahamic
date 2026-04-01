import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { semanticRankClaims } from '@/lib/ai'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json({ claims: [] })

  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ claims: [] })

  // Fetch all published claims as candidates (practical up to ~500 claims)
  const allClaims = await prisma.claim.findMany({
    where: { isPublished: true },
    select: { id: true, statement: true },
  })

  const rankedIds = await semanticRankClaims(q, allClaims)
  if (rankedIds.length === 0) return NextResponse.json({ claims: [] })

  const claims = await prisma.claim.findMany({
    where: { id: { in: rankedIds }, isPublished: true },
    include: {
      source: true,
      verses: {
        include: {
          verse: { include: { translations: { where: { isDefault: true } } } },
        },
      },
      figures: { include: { figure: true } },
      themes: { include: { theme: true } },
    },
  })

  // Re-sort by AI-ranked order
  const ordered = rankedIds
    .map((id) => claims.find((c) => c.id === id))
    .filter(Boolean)

  return NextResponse.json({ claims: ordered })
}
