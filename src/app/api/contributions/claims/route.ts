import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireContributor } from '@/lib/api-auth'
import { claimHash } from '@/lib/hash'
import { requiredTraditionsFor } from '@/lib/editorial/signoff'
import { lintProposal } from '@/lib/contributions/lint'
import { resolveReferences } from '@/lib/contributions/resolve-refs'
import { PROPOSAL_MAX_OPEN, PROPOSAL_MAX_PER_DAY, proposalSchema } from '@/lib/schemas/contributions'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * A signed-in contributor proposes a new claim. It is created as a DRAFT that only staff can
 * see: contributors cannot publish, cannot request review, and cannot edit it afterwards.
 * An editor moves it to review, tradition reviewers sign it off, and only then can it go live.
 *
 * Every proposal must cite at least one passage in its own source (no claim without a source),
 * and per-user caps are counted in the database so they hold across serverless instances.
 */
export async function POST(req: Request) {
  const guard = await requireContributor()
  if (!guard.ok) return guard.response

  const parsed = proposalSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { sourceId, statement, references, notes, extraTraditions } = parsed.data

  const lint = lintProposal(statement)
  if (!lint.ok) return NextResponse.json({ error: { message: 'Please reword to describe rather than judge', reasons: lint.reasons } }, { status: 400 })

  const userId = guard.value.id
  const [today, open] = await Promise.all([
    prisma.claim.count({ where: { proposedById: userId, createdAt: { gt: new Date(Date.now() - DAY_MS) } } }),
    prisma.claim.count({ where: { proposedById: userId, editorialStatus: { in: ['DRAFT', 'IN_REVIEW'] } } }),
  ])
  if (today >= PROPOSAL_MAX_PER_DAY) {
    return NextResponse.json({ error: `You can propose up to ${PROPOSAL_MAX_PER_DAY} claims a day. Please come back tomorrow.` }, { status: 429 })
  }
  if (open >= PROPOSAL_MAX_OPEN) {
    return NextResponse.json({ error: 'You have many proposals still waiting. Please wait for the editors to work through them.' }, { status: 429 })
  }

  const source = await prisma.source.findUnique({ where: { id: sourceId }, select: { tradition: true } })
  if (!source) return NextResponse.json({ error: 'Unknown source' }, { status: 400 })

  const resolved = await resolveReferences(sourceId, references)
  if (!resolved.ok) return NextResponse.json({ error: resolved.error }, { status: 400 })

  const hash = claimHash(sourceId, statement)
  if (await prisma.claim.findUnique({ where: { contentHash: hash }, select: { id: true } })) {
    return NextResponse.json({ error: 'That claim already exists' }, { status: 409 })
  }

  const claim = await prisma.$transaction(async (tx) => {
    const created = await tx.claim.create({
      data: {
        sourceId, statement, notes, contentHash: hash,
        editorialStatus: 'DRAFT', isPublished: false,
        proposedById: userId,
        requiredTraditions: requiredTraditionsFor(source.tradition, extraTraditions),
        verses: { create: resolved.verseIds.map((verseId, i) => ({ verseId, isPrimary: i === 0 })) },
      },
      select: { id: true },
    })
    await tx.editorialAuditEvent.create({
      data: {
        entityType: 'Claim', entityId: String(created.id), action: 'PROPOSE',
        actorId: userId, actorRole: 'CONTRIBUTOR', after: { editorialStatus: 'DRAFT', references },
      },
    })
    return created
  })
  return NextResponse.json({ id: claim.id }, { status: 201 })
}
