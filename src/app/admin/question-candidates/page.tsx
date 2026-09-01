import prisma from '@/lib/prisma'
import { QuestionCandidateCard } from '@/components/admin/QuestionCandidateCard'
import { QuestionProposalGenerator } from '@/components/admin/QuestionProposalGenerator'

export const dynamic = 'force-dynamic'

export default async function QuestionCandidatesPage() {
  const [pending, reviewed, chapters, concepts, comparisons] = await Promise.all([
    prisma.questionCandidate.findMany({
      where: { status: 'PENDING' },
      include: {
        chapter: { select: { title: true } },
        concept: { select: { name: true } },
        comparison: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.questionCandidate.findMany({
      where: { status: { not: 'PENDING' } },
      select: { id: true, prompt: true, status: true, reviewedAt: true, reviewNotes: true },
      orderBy: { reviewedAt: 'desc' },
      take: 10,
    }),
    prisma.chapter.findMany({ select: { id: true, title: true }, orderBy: { position: 'asc' } }),
    prisma.concept.findMany({ where: { isPublished: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.comparison.findMany({ where: { isPublished: true }, select: { id: true, title: true }, orderBy: { title: 'asc' } }),
  ])

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-stone-900">Question Candidates ✦</h1>
      <p className="mb-6 max-w-3xl text-sm text-stone-500">
        AI-drafted quiz questions awaiting editorial review. Every question must ask what a
        named tradition teaches or what a named text says — never which tradition is correct.
        Drafts that break that rule are blocked from approval.
      </p>

      <QuestionProposalGenerator
        chapters={chapters.map((c) => ({ id: c.id, label: c.title }))}
        concepts={concepts.map((c) => ({ id: c.id, label: c.name }))}
        comparisons={comparisons.map((c) => ({ id: c.id, label: c.title }))}
      />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-400">
        Pending ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <p className="mb-8 text-sm text-stone-500">Nothing awaiting review.</p>
      ) : (
        <div className="mb-8 space-y-4">
          {pending.map((candidate) => (
            <QuestionCandidateCard
              key={candidate.id}
              candidate={{ ...candidate, createdAt: candidate.createdAt.toISOString() }}
            />
          ))}
        </div>
      )}

      {reviewed.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-400">
            Recently reviewed
          </h2>
          <ul className="space-y-1.5">
            {reviewed.map((c) => (
              <li key={c.id} className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm">
                <span className={`mr-2 font-medium ${c.status === 'APPROVED' ? 'text-emerald-700' : 'text-stone-500'}`}>
                  {c.status}
                </span>
                <span className="text-stone-700">{c.prompt}</span>
                {c.reviewNotes && <span className="ml-2 text-xs text-stone-400">— {c.reviewNotes}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
