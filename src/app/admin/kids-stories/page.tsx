import prisma from '@/lib/prisma'
import { KidsStoryReviewCard, type ReviewStory } from '@/components/admin/KidsStoryReviewCard'
import { KidsStoryGenerator } from '@/components/admin/KidsStoryGenerator'
import type { AgeBand } from '@/lib/kids/readability'

export const dynamic = 'force-dynamic'

export default async function AdminKidsStoriesPage() {
  const [stories, claims] = await Promise.all([
    prisma.kidsStory.findMany({
      include: {
        claims: {
          orderBy: { position: 'asc' },
          include: {
            claim: {
              select: {
                id: true,
                statement: true,
                source: { select: { title: true } },
                verses: { select: { verse: { select: { referenceKey: true } } } },
              },
            },
          },
        },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    }),
    // Only published claims may seed a story, so only those are offered.
    prisma.claim.findMany({
      where: { isPublished: true },
      select: { id: true, statement: true, source: { select: { title: true } } },
      orderBy: { statement: 'asc' },
      take: 200,
    }),
  ])

  const shaped: ReviewStory[] = stories.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    ageBand: s.ageBand as AgeBand,
    body: s.body,
    aiModel: s.aiModel,
    aiRationale: s.aiRationale,
    status: s.status,
    isPublished: s.isPublished,
    reviewNotes: s.reviewNotes,
    sourceClaims: s.claims.map(({ claim }) => ({
      id: claim.id,
      statement: claim.statement,
      sourceTitle: claim.source.title,
      refs: claim.verses.map((v) => v.verse.referenceKey),
    })),
  }))

  const pending = shaped.filter((s) => s.status === 'PENDING')
  const reviewed = shaped.filter((s) => s.status !== 'PENDING')

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-stone-900">Kids stories</h1>
        <p className="mt-1 max-w-3xl text-sm text-stone-600">
          Drafts are generated from published claims and land here unreviewed. Approving a
          story judges the text; publishing releases it to <code>/kids</code>. Both steps are
          required, and the database rejects publishing anything not approved.
        </p>
      </header>

      <KidsStoryGenerator
        claims={claims.map((c) => ({
          id: c.id,
          statement: c.statement,
          sourceTitle: c.source.title,
        }))}
      />

      <section>
        <h2 className="mb-3 text-lg font-semibold text-stone-900">
          Awaiting review ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-500">
            Nothing waiting. Generate a draft above.
          </p>
        ) : (
          <div className="space-y-4">
            {pending.map((story) => (
              <KidsStoryReviewCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </section>

      {reviewed.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-stone-900">
            Reviewed ({reviewed.length})
          </h2>
          <div className="space-y-4">
            {reviewed.map((story) => (
              <KidsStoryReviewCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
