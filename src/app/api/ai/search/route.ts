import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { semanticRankClaims } from '@/lib/ai'
import { rateLimit, requestKey } from '@/lib/rate-limit'

// Unauthenticated, LLM-backed endpoint — keep the window tight to bound cost.
const RATE_LIMIT = { limit: 10, windowMs: 60_000 }
const MAX_QUERY_LENGTH = 200
const MAX_CANDIDATES = 500

export async function GET(req: NextRequest) {
  const { ok, retryAfterSeconds } = rateLimit(`ai-search:${requestKey(req)}`, RATE_LIMIT)
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    )
  }

  const q = req.nextUrl.searchParams.get('q')?.trim().slice(0, MAX_QUERY_LENGTH)
  if (!q || q.length < 2) return NextResponse.json({ claims: [] })

  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ claims: [] })

  // Fetch published claims as candidates, capped so a growing dataset can't
  // turn this into an unbounded per-request LLM payload.
  const allClaims = await prisma.claim.findMany({
    where: { isPublished: true },
    select: { id: true, statement: true },
    take: MAX_CANDIDATES,
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
