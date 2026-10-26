import { NoteButton } from '@/components/experience/NoteButton'
import { TrailRecorder } from '@/components/experience/TrailRecorder'
import { PerspectiveSwap } from '@/components/claims/PerspectiveSwap'
import { NamedText } from '@/components/figures/NamedText'
import { NextUp } from '@/components/layout/NextUp'
import Link from 'next/link'
import { SaveButton } from '@/components/experience/SavedItems'
import type { Metadata } from 'next'
import { PageIntro } from '@/components/layout/PageIntro'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ComparisonBlock } from '@/components/claims/ComparisonBlock'
import { ControversialBanner } from '@/components/claims/ControversialBanner'
import type { ComparisonWithClaims } from '@/types'
import { rankRelatedComparisons } from '@/lib/related-comparisons'

// Cached content. Editors' changes appear immediately: mutating routes
// invalidate the matching tag via revalidateContent().
export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  if (!/^[1-9]\d*$/.test(id)) return {}
  const comp = await prisma.comparison.findUnique({ where: { id: parseInt(id), isPublished: true }, select: { title: true } })
  if (!comp) return {}
  return { title: comp.title }
}

export default async function ComparisonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!/^[1-9]\d*$/.test(id)) notFound()
  const comparison = await prisma.comparison.findUnique({
    where: { id: parseInt(id), isPublished: true },
    include: {
      claims: {
        // A claim that is unpublished or archived must not keep appearing through a published page.
        where: { claim: { isPublished: true } },
        orderBy: { position: 'asc' },
        include: {
          claim: {
            include: {
              source: true,
              verses: {
                include: {
                  verse: { include: { translations: true } },
                },
              },
              figures: { include: { figure: true } },
              themes: { include: { theme: true } },
            },
          },
        },
      },
    },
  })

  if (!comparison) notFound()

  const figureIds = comparison.claims.flatMap(({ claim }) => claim.figures.map(({ figure }) => figure.id))
  const themeIds = comparison.claims.flatMap(({ claim }) => claim.themes.map(({ theme }) => theme.id))
  const candidates = figureIds.length || themeIds.length ? await prisma.comparison.findMany({
    where: { isPublished: true, id: { not: comparison.id }, claims: { some: { claim: { isPublished: true, OR: [
      ...(figureIds.length ? [{ figures: { some: { figureId: { in: figureIds } } } }] : []),
      ...(themeIds.length ? [{ themes: { some: { themeId: { in: themeIds } } } }] : []),
    ] } } } },
    select: { id: true, title: true, claims: { where: { claim: { isPublished: true } }, select: { claim: { select: { figures: { select: { figureId: true } }, themes: { select: { themeId: true } } } } } } },
    take: 50,
  }) : []
  const related = rankRelatedComparisons(
    figureIds,
    themeIds,
    candidates.map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      figureIds: candidate.claims.flatMap(({ claim }) => claim.figures.map(({ figureId }) => figureId)),
      themeIds: candidate.claims.flatMap(({ claim }) => claim.themes.map(({ themeId }) => themeId)),
    })),
  )
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Comparison"
        title={comparison.title}
        description={comparison.summary ?? undefined}
        trail={[{ href: '/comparisons', label: 'Comparisons' }]}
      />

      {comparison.isControversial && (
        <div className="mb-6">
          <ControversialBanner />
        </div>
      )}

      <div className="mb-6"><SaveButton item={{ id: `comparison:${comparison.id}`, kind: 'comparison', href: `/comparisons/${comparison.id}`, label: comparison.title }} /></div>
      <ComparisonBlock comparison={comparison as unknown as ComparisonWithClaims} showSummary={false} renderStatement={(text) => <NamedText text={text} />} />

      <aside className="editorial-card mt-8 p-5 space-y-3">
        <h2 className="text-xl">Editorial context</h2>
        <p className="text-sm leading-6 text-primary-700">Authored by the Abrahamic Texts project editorial team. Comparison labels are editorial judgments. <Link href="/editorial-method" className="editorial-link">How we review and attribute content</Link></p>
        <p className="text-sm text-primary-700">Last updated {comparison.updatedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </aside>
      <Link href={`/suggest?page=${encodeURIComponent(`/comparisons/${comparison.id}`)}`} className="editorial-button mt-5 min-h-11">Suggest a correction for this page</Link>
      {related.length > 0 && <section className="mt-10"><h2 className="text-2xl">Keep exploring</h2><ul className="mt-4 grid gap-3">{related.map((item) => <li key={item.id}><Link href={`/comparisons/${item.id}`} className="editorial-card block p-5 font-semibold text-[#173b68] hover:border-gold-700">{item.title} →</Link></li>)}</ul></section>}

      {new Set(comparison.claims.map(({ claim }) => claim.source.tradition)).size >= 2 && <p className="mt-8 rounded-2xl border border-[#d7c5ad] bg-[#fbf6ec] p-4 text-sm leading-6 text-primary-800">The side-by-side activity compares project explanations, not scripture translations. A wording difference does not mean the traditions disagree.</p>}
      <details className="mt-10 rounded-2xl border border-[#d7c5ad] bg-[#fbf6ec] p-5">
        <summary className="min-h-11 cursor-pointer py-2 font-semibold text-[#173b68]">Optional tools for exploring further</summary>
        {new Set(comparison.claims.map(({ claim }) => claim.source.tradition)).size >= 2 && (
          <div className="mt-4"><PerspectiveSwap views={comparison.claims.map(({ claim }) => ({ tradition: claim.source.tradition, statement: claim.statement, source: claim.source.title }))} /></div>
        )}
        <NoteButton href={`/comparisons/${comparison.id}`} label={comparison.title} />
        <TrailRecorder item={{ href: `/comparisons/${comparison.id}`, label: comparison.title, kind: 'comparison' }} />
        <NextUp current={{ kind: 'comparison', id: comparison.id }} />
      </details>
    </div>
  )
}
