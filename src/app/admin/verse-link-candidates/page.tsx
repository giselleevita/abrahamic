import prisma from '@/lib/prisma'
import { VerseLinkCandidateCard } from '@/components/admin/VerseLinkCandidateCard'
import { VerseLinkProposalGenerator } from '@/components/admin/VerseLinkProposalGenerator'

export const dynamic = 'force-dynamic'

export default async function VerseLinkCandidatesPage() {
  const [pending, recentlyReviewed, verses] = await Promise.all([
    prisma.verseLinkCandidate.findMany({
      where: { status: 'PENDING' },
      include: {
        verseA: { include: { source: true } },
        verseB: { include: { source: true } },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.verseLinkCandidate.findMany({
      where: { status: { not: 'PENDING' } },
      include: {
        verseA: { include: { source: true } },
        verseB: { include: { source: true } },
      },
      orderBy: { reviewedAt: 'desc' },
      take: 10,
    }),
    prisma.verse.findMany({
      include: { source: true },
      orderBy: [{ source: { id: 'asc' } }, { book: 'asc' }, { chapter: 'asc' }, { verse: 'asc' }],
    }),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Verse Link Candidates</h1>
        <p className="mt-1 text-sm text-stone-500">
          AI-proposed verse links awaiting editorial review. Approve to create a permanent VerseLink record.
        </p>
      </div>

      <VerseLinkProposalGenerator verses={verses as Parameters<typeof VerseLinkProposalGenerator>[0]['verses']} />

      <section className="mb-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 p-8 text-center text-stone-400 text-sm">
            No pending candidates. Use the generator above to propose new links.
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((c) => (
              <VerseLinkCandidateCard
                key={c.id}
                candidate={c as Parameters<typeof VerseLinkCandidateCard>[0]['candidate']}
              />
            ))}
          </div>
        )}
      </section>

      {recentlyReviewed.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Recently reviewed
          </h2>
          <div className="rounded-lg border border-stone-200 divide-y divide-stone-100 bg-white">
            {recentlyReviewed.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {c.status}
                </span>
                <span className="text-stone-600">
                  {c.verseA.book} {c.verseA.chapter}:{c.verseA.verse}
                  {' ↔ '}
                  {c.verseB.book} {c.verseB.chapter}:{c.verseB.verse}
                </span>
                <span className="text-xs text-stone-400 ml-auto">{c.linkType}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
