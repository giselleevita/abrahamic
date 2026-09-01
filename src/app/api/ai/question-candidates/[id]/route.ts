import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { isPublishable, lintQuestion, type DraftOption } from '@/lib/learn/neutrality'

export const dynamic = 'force-dynamic'

const patchSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reviewNotes: z.string().max(2000).optional(),
})

const optionSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean().optional(),
  optionTradition: z.enum(['JEWISH', 'CHRISTIAN', 'ISLAMIC', 'SHARED']).nullable().optional(),
  presence: z.enum(['AFFIRMED', 'MODIFIED', 'SILENT', 'REJECTED']).nullable().optional(),
  rationale: z.string().nullable().optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const candidateId = Number(id)
  if (!Number.isInteger(candidateId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const { status, reviewNotes } = parsed.data

  const candidate = await prisma.questionCandidate.findUnique({
    where: { id: candidateId },
    include: { comparison: { select: { tag: true, isControversial: true } } },
  })
  if (!candidate) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (candidate.status !== 'PENDING') {
    return NextResponse.json({ error: 'Already reviewed' }, { status: 409 })
  }

  if (status === 'REJECTED') {
    const updated = await prisma.questionCandidate.update({
      where: { id: candidateId },
      data: { status, reviewNotes, reviewedAt: new Date() },
    })
    return NextResponse.json(updated)
  }

  // ── Approval promotes the candidate into a real Question. ────────────────
  const optionsParsed = z.array(optionSchema).min(2).safeParse(candidate.proposedOptions)
  if (!optionsParsed.success) {
    return NextResponse.json(
      { error: 'Stored options are malformed', detail: optionsParsed.error.flatten() },
      { status: 422 },
    )
  }

  const isContested = candidate.comparison
    ? candidate.comparison.isControversial || candidate.comparison.tag === 'CONTRADICTION'
    : false

  const options: DraftOption[] = optionsParsed.data.map((o) => ({
    text: o.text,
    isCorrect: o.isCorrect ?? false,
    optionTradition: o.optionTradition ?? null,
    presence: o.presence ?? null,
    rationale: o.rationale ?? null,
  }))

  // Re-lint server-side at promotion. The UI already disables Approve on a
  // BLOCK, but the UI is not the control — this is.
  const flags = lintQuestion({
    kind: candidate.kind,
    format: candidate.format,
    prompt: candidate.prompt,
    explanation: candidate.explanation,
    subjectTradition: candidate.subjectTradition,
    isContested,
    options,
    hasProvenance: Boolean(
      candidate.claimId ?? candidate.conceptId ?? candidate.comparisonId ?? candidate.timelineEventId,
    ),
  })

  if (!isPublishable(flags)) {
    return NextResponse.json(
      { error: 'Question violates the neutrality rules and cannot be approved', flags },
      { status: 422 },
    )
  }

  const question = await prisma.$transaction(async (tx) => {
    const lastPosition = await tx.question.aggregate({
      where: { chapterId: candidate.chapterId },
      _max: { position: true },
    })

    const created = await tx.question.create({
      data: {
        chapterId: candidate.chapterId,
        kind: candidate.kind,
        format: candidate.format,
        position: (lastPosition._max.position ?? -1) + 1,
        prompt: candidate.prompt,
        explanation: candidate.explanation,
        subjectTradition: candidate.subjectTradition,
        // Published deliberately false: approving the wording is not the same
        // as signing off the chapter. An editor publishes explicitly.
        isPublished: false,
        isContested,
        sourceType: candidate.sourceType,
        claimId: candidate.claimId,
        conceptId: candidate.conceptId,
        comparisonId: candidate.comparisonId,
        timelineEventId: candidate.timelineEventId,
        originCandidateId: candidate.id,
        neutralityReviewedAt: new Date(),
        neutralityReviewNote: reviewNotes,
        options: {
          create: options.map((o, index) => ({
            text: o.text,
            isCorrect: o.isCorrect,
            position: index,
            optionTradition: o.optionTradition ?? null,
            presence: o.presence ?? null,
            rationale: o.rationale ?? null,
          })),
        },
      },
      include: { options: true },
    })

    await tx.questionCandidate.update({
      where: { id: candidate.id },
      data: { status: 'APPROVED', reviewNotes, reviewedAt: new Date() },
    })

    return created
  })

  return NextResponse.json({ question, warnings: flags })
}
