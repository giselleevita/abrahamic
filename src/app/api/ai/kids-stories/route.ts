import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireSession } from '@/lib/api-auth'
import { generateKidsStorySchema } from '@/lib/schemas/kids'
import { proposeKidsStory, KIDS_STORY_MODEL, type ClaimForSummary } from '@/lib/ai'
import { guardKidsStory } from '@/lib/kids/content-guard'
import { candidateStatusSchema } from '@/lib/schemas/enums'

/** Review queue. Admin-only: these drafts are unreviewed by definition. */
export async function GET(req: NextRequest) {
  const denied = await requireSession()
  if (denied) return denied

  const statusParam = req.nextUrl.searchParams.get('status')
  const status = statusParam ? candidateStatusSchema.safeParse(statusParam) : null
  if (status && !status.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const stories = await prisma.kidsStory.findMany({
    where: status?.success ? { status: status.data } : undefined,
    include: {
      claims: { include: { claim: { include: { source: true } } }, orderBy: { position: 'asc' } },
      figures: { include: { figure: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(stories)
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export async function POST(req: NextRequest) {
  const denied = await requireSession()
  if (denied) return denied

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI is not configured' }, { status: 503 })
  }

  const parsed = generateKidsStorySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { ageBand, claimIds, figureIds } = parsed.data

  // Only published claims may seed a kids story, and the select deliberately
  // pulls no `translations` — the model receives statements and verse
  // references only, so licensed translation text cannot reach a child.
  const claims = await prisma.claim.findMany({
    where: { id: { in: claimIds }, isPublished: true },
    select: {
      id: true,
      statement: true,
      source: { select: { title: true } },
      verses: { select: { verse: { select: { referenceKey: true } } } },
    },
  })

  if (claims.length === 0) {
    return NextResponse.json(
      { error: 'No published claims matched those ids' },
      { status: 400 },
    )
  }

  const input: ClaimForSummary[] = claims.map((c) => ({
    statement: c.statement,
    sourceTitle: c.source.title,
    verseRefs: c.verses.map((v) => v.verse.referenceKey),
  }))

  const proposal = await proposeKidsStory(ageBand, input)

  if ('insufficient' in proposal) {
    // The model declined. That is a correct outcome, not an error — surface the
    // reason so the editor can pick different claims.
    return NextResponse.json({ declined: true, reason: proposal.reason }, { status: 200 })
  }

  // The prompt states the rules; this check enforces them. A draft that fails
  // is never stored, so the review queue holds only plausible candidates.
  const guard = guardKidsStory({
    title: proposal.title,
    body: proposal.body,
    ageBand,
  })

  if (!guard.ok) {
    return NextResponse.json(
      { blocked: true, reasons: guard.reasons, draft: proposal },
      { status: 200 },
    )
  }

  const baseSlug = slugify(proposal.title) || 'kids-story'
  const existing = await prisma.kidsStory.count({ where: { slug: { startsWith: baseSlug } } })
  const slug = existing === 0 ? baseSlug : `${baseSlug}-${existing + 1}`

  const story = await prisma.kidsStory.create({
    data: {
      slug,
      title: proposal.title,
      ageBand,
      body: proposal.body,
      glossary: proposal.glossary,
      aiModel: KIDS_STORY_MODEL,
      aiRationale: proposal.rationale,
      status: 'PENDING',
      isPublished: false,
      claims: {
        create: claims.map((c, i) => ({ claimId: c.id, position: i })),
      },
      ...(figureIds?.length
        ? { figures: { create: figureIds.map((figureId) => ({ figureId })) } }
        : {}),
    },
    include: { claims: { include: { claim: true } }, figures: { include: { figure: true } } },
  })

  return NextResponse.json({ story, warnings: guard.warnings }, { status: 201 })
}
