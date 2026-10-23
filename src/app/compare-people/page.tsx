import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'
import { ComparePeople } from '@/components/people/ComparePeople'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'Compare two people',
  description: 'Pick any two people and see the names, events, themes and comparisons they share.',
}

export default async function ComparePeoplePage() {
  const [figures, events, claims, comparisons] = await Promise.all([
    prisma.figure.findMany({ select: { id: true, slug: true, canonicalName: true, aliases: { select: { tradition: true, name: true } } }, orderBy: { canonicalName: 'asc' } }),
    prisma.timelineEvent.findMany({ where: { isPublished: true }, select: { slug: true, name: true, figures: { select: { figureId: true } } } }),
    prisma.claim.findMany({
      where: { isPublished: true },
      select: {
        figures: { select: { figureId: true } },
        themes: { select: { theme: { select: { name: true } } } },
        comparisons: { select: { comparisonId: true, comparison: { select: { isPublished: true } } } },
      },
    }),
    prisma.comparison.findMany({ where: { isPublished: true }, select: { id: true, title: true } }),
  ])
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Explore"
        title="Compare two people"
        description="Choose any two people and see how they connect, using only the links recorded on this site."
        plainWords="Curious how Moses and Muhammad, or Mary and Eve, are connected? Pick two and see their names, shared stories and shared themes side by side."
      />
      <ComparePeople
        figures={figures.map((f) => ({ id: f.id, slug: f.slug, name: f.canonicalName, aliases: f.aliases }))}
        events={events.map((e) => ({ slug: e.slug, name: e.name, figureIds: e.figures.map((x) => x.figureId) }))}
        claims={claims.map((c) => ({
          figureIds: c.figures.map((x) => x.figureId),
          themes: c.themes.map((t) => t.theme.name),
          comparisonIds: c.comparisons.filter((x) => x.comparison.isPublished).map((x) => x.comparisonId),
        }))}
        comparisons={comparisons}
      />
    </div>
  )
}
