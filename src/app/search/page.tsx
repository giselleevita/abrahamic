import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { ClaimCard } from '@/components/claims/ClaimCard'
import type { ClaimWithRelations, FigureWithAliases } from '@/types'
import type { ConceptCategory, TimelineEra } from '@prisma/client'

export const metadata: Metadata = { title: 'Search' }
export const dynamic = 'force-dynamic'

const CATEGORY_LABEL: Record<ConceptCategory, string> = {
  THEOLOGY: 'Theology', SOTERIOLOGY: 'Soteriology', ESCHATOLOGY: 'Eschatology',
  PROPHETHOOD: 'Prophethood', PRACTICE: 'Practice', LAW: 'Law & Covenant', COSMOLOGY: 'Cosmology',
}

const ERA_LABEL: Record<TimelineEra, string> = {
  PRIMORDIAL: 'Primordial', PATRIARCHAL: 'Patriarchal', EXODUS: 'Exodus',
  KINGDOM: 'Kingdom', GOSPEL: 'Gospel', EARLY_ISLAM: 'Early Islam',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim()

  if (!query || query.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-stone-900">Search</h1>
        <p className="text-stone-500">Enter at least 2 characters to search.</p>
      </div>
    )
  }

  const search = { contains: query, mode: 'insensitive' as const }

  const [figures, themes, claims, verses, concepts, timelineEvents] = await Promise.all([
    prisma.figure.findMany({
      where: {
        OR: [{ canonicalName: search }, { aliases: { some: { name: search } } }, { description: search }],
      },
      include: { aliases: true, _count: { select: { claims: true } } },
      take: 5,
    }),
    prisma.theme.findMany({
      where: { OR: [{ name: search }, { description: search }] },
      include: { _count: { select: { claims: true } } },
      take: 5,
    }),
    prisma.claim.findMany({
      where: { isPublished: true, OR: [{ statement: search }, { notes: search }] },
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
      take: 10,
    }),
    prisma.verse.findMany({
      where: { translations: { some: { text: search } } },
      include: { source: true, translations: { where: { isDefault: true } } },
      take: 5,
    }),
    prisma.concept.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: search },
          { summary: search },
          { traditions: { some: { definition: search } } },
        ],
      },
      select: { slug: true, name: true, category: true, summary: true },
      take: 5,
    }),
    prisma.timelineEvent.findMany({
      where: {
        isPublished: true,
        OR: [{ name: search }, { summary: search }],
      },
      select: { slug: true, name: true, era: true, summary: true },
      take: 5,
    }),
  ])

  const totalResults =
    figures.length + themes.length + claims.length + verses.length +
    concepts.length + timelineEvents.length

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900">Search</h1>
      <p className="mb-8 text-stone-500">
        {totalResults} result{totalResults !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
      </p>

      {figures.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">Figures</h2>
          <div className="space-y-2">
            {(figures as FigureWithAliases[]).map((figure) => (
              <Link
                key={figure.slug}
                href={`/figures/${figure.slug}`}
                className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
              >
                <div>
                  <p className="font-medium text-stone-900">{figure.canonicalName}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {figure.aliases.map((a) => (
                      <Badge key={a.id} className={`${TRADITION_BG[a.tradition]} text-[10px]`}>
                        {a.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-xs text-stone-400">{figure._count.claims} claims</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {concepts.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">Concepts</h2>
          <div className="space-y-2">
            {concepts.map((concept) => (
              <Link
                key={concept.slug}
                href={`/concepts/${concept.slug}`}
                className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900">{concept.name}</p>
                  {concept.summary && (
                    <p className="mt-0.5 text-xs text-stone-500 truncate">{concept.summary}</p>
                  )}
                </div>
                <span className="flex-shrink-0 rounded-full border border-stone-200 px-2 py-0.5 text-xs text-stone-500">
                  {CATEGORY_LABEL[concept.category]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {timelineEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">Timeline Events</h2>
          <div className="space-y-2">
            {timelineEvents.map((event) => (
              <Link
                key={event.slug}
                href={`/timeline#${event.slug}`}
                className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900">{event.name}</p>
                  {event.summary && (
                    <p className="mt-0.5 text-xs text-stone-500 truncate">{event.summary}</p>
                  )}
                </div>
                <span className="flex-shrink-0 rounded-full border border-stone-200 px-2 py-0.5 text-xs text-stone-500">
                  {ERA_LABEL[event.era]}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {themes.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">Themes</h2>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <Link
                key={theme.slug}
                href={`/themes/${theme.slug}`}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm hover:border-stone-400 transition-colors"
                style={{ borderLeftColor: theme.color ?? undefined, borderLeftWidth: 3 }}
              >
                {theme.name}
                <span className="ml-2 text-xs text-stone-400">{theme._count.claims}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {claims.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">Claims</h2>
          <div className="space-y-3">
            {(claims as unknown as ClaimWithRelations[]).map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        </section>
      )}

      {verses.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">Verses</h2>
          <div className="space-y-2">
            {verses.map((verse) => {
              const t = verse.translations[0]
              return (
                <div key={verse.id} className="rounded-lg border border-stone-200 bg-white p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={TRADITION_BG[verse.source.tradition]}>{verse.source.title}</Badge>
                    <span className="text-xs text-stone-400">
                      {verse.book} {verse.chapter}:{verse.verse}
                    </span>
                  </div>
                  {t && <p className="text-sm text-stone-700 italic">"{t.text}"</p>}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {totalResults === 0 && (
        <div className="rounded-lg border border-stone-200 bg-white p-8 text-center">
          <p className="text-stone-500">No results found for &ldquo;{query}&rdquo;.</p>
          <p className="mt-2 text-sm text-stone-400">Try a broader search term.</p>
        </div>
      )}
    </div>
  )
}
