import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { proposeQuestionCandidates, type QuestionSourceContext } from '@/lib/ai'
import { lintQuestion, type DraftOption } from '@/lib/learn/neutrality'
import { claimHash } from '@/lib/hash'

export const dynamic = 'force-dynamic'

const createSchema = z.object({
  chapterId: z.number().int().positive(),
  sourceType: z.enum(['CONCEPT', 'COMPARISON']),
  sourceId: z.number().int().positive(),
  count: z.number().int().min(1).max(3).optional(),
})

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = new URL(req.url).searchParams.get('status') ?? 'PENDING'
  const candidates = await prisma.questionCandidate.findMany({
    where: { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' },
    include: {
      chapter: { select: { slug: true, title: true } },
      concept: { select: { name: true } },
      comparison: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(candidates)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  }

  const parsed = createSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { chapterId, sourceType, sourceId, count = 2 } = parsed.data

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } })
  if (!chapter) return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })

  // Build the source context, and derive isContested from the source itself —
  // never from the caller.
  let context: QuestionSourceContext
  let isContested = false

  if (sourceType === 'CONCEPT') {
    const concept = await prisma.concept.findUnique({
      where: { id: sourceId },
      include: { traditions: true },
    })
    if (!concept) return NextResponse.json({ error: 'Concept not found' }, { status: 404 })
    context = {
      sourceType: 'CONCEPT',
      title: concept.name,
      summary: concept.summary,
      traditions: concept.traditions.map((t) => ({ tradition: t.tradition, text: t.definition })),
      isContested: false,
    }
  } else {
    const comparison = await prisma.comparison.findUnique({ where: { id: sourceId } })
    if (!comparison) return NextResponse.json({ error: 'Comparison not found' }, { status: 404 })
    isContested = comparison.isControversial || comparison.tag === 'CONTRADICTION'
    context = {
      sourceType: 'COMPARISON',
      title: comparison.title,
      summary: comparison.summary,
      traditions: [],
      isContested,
    }
  }

  const proposals = await proposeQuestionCandidates(context, count)
  if (proposals.length === 0) {
    return NextResponse.json({ created: 0, candidates: [], message: 'No usable proposals returned.' })
  }

  const created = []
  for (const proposal of proposals) {
    const options: DraftOption[] = proposal.options.map((o) => ({
      text: o.text,
      isCorrect: o.isCorrect,
      optionTradition: o.optionTradition,
      rationale: o.rationale,
    }))

    // Lint at generation time so the reviewer sees the verdict up front; a
    // BLOCK disables Approve in the UI and is re-checked on promotion.
    const flags = lintQuestion({
      kind: proposal.kind,
      format: proposal.kind === 'DIVERGENCE_MAP' ? 'MULTI_SELECT' : 'SINGLE_CHOICE',
      prompt: proposal.prompt,
      explanation: proposal.explanation,
      subjectTradition: proposal.subjectTradition,
      isContested,
      options,
      hasProvenance: true,
    })

    const candidate = await prisma.questionCandidate.upsert({
      where: { contentHash: claimHash(chapterId, proposal.prompt) },
      update: {},
      create: {
        chapterId,
        kind: proposal.kind,
        format: proposal.kind === 'DIVERGENCE_MAP' ? 'MULTI_SELECT' : 'SINGLE_CHOICE',
        prompt: proposal.prompt,
        subjectTradition: proposal.subjectTradition,
        explanation: proposal.explanation,
        sourceType,
        conceptId: sourceType === 'CONCEPT' ? sourceId : null,
        comparisonId: sourceType === 'COMPARISON' ? sourceId : null,
        proposedOptions: proposal.options,
        aiRationale: proposal.aiRationale,
        aiModel: 'claude-opus-5',
        contentHash: claimHash(chapterId, proposal.prompt),
        neutralityFlags: flags.length > 0 ? flags : undefined,
      },
    })
    created.push(candidate)
  }

  return NextResponse.json({ created: created.length, candidates: created }, { status: 201 })
}
