import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Tabs } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { ClaimCard } from '@/components/claims/ClaimCard'
import { ComparisonTagFilter } from '@/components/claims/ComparisonTagFilter'
import { FigureTimeline } from '@/components/claims/FigureTimeline'
import { TRADITION_BG, SOURCE_ORDER } from '@/lib/constants'
import type { ComparisonWithClaims, ClaimWithRelations } from '@/types'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const figures = await prisma.figure.findMany({ select: { slug: true } })
    return figures.map((f) => ({ slug: f.slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const figure = await prisma.figure.findUnique({ where: { slug }, select: { canonicalName: true } })
  if (!figure) return {}
  return { title: figure.canonicalName }
}

export default async function FigurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const figure = await prisma.figure.findUnique({
    where: { slug },
    include: {
      aliases: { orderBy: { tradition: 'asc' } },
      claims: {
        include: {
          claim: {
            include: {
              source: true,
              verses: {
                include: {
                  verse: { include: { translations: { where: { isDefault: true } } } },
                },
              },
              figures: { include: { figure: true } },
              themes: { include: { theme: true } },
              comparisons: {
                include: {
                  comparison: {
                    include: {
                      claims: {
                        orderBy: { position: 'asc' },
                        include: {
                          claim: {
                            include: {
                              source: true,
                              verses: {
                                where: { isPrimary: true },
                                include: {
                                  verse: {
                                    include: { translations: { where: { isDefault: true } } },
                                  },
                                },
                              },
                              figures: { include: { figure: true } },
                              themes: { include: { theme: true } },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!figure) notFound()

  // Timeline events featuring this figure
  const figureTimelineEvents = await prisma.timelineEvent.findMany({
    where: { isPublished: true, figures: { some: { figure: { slug } } } },
    select: { slug: true, name: true, era: true, summary: true },
    orderBy: [{ era: 'asc' }, { position: 'asc' }],
  })

  // Figures who appear alongside this figure in the same claims
  const coFigures = await prisma.figure.findMany({
    where: {
      slug: { not: slug },
      claims: {
        some: {
          claim: {
            figures: { some: { figure: { slug } } },
            isPublished: true,
          },
        },
      },
    },
    select: { slug: true, canonicalName: true, aliases: { select: { tradition: true, name: true } } },
    take: 6,
  })

  const publishedClaims = figure.claims
    .map((cf) => cf.claim)
    .filter((c) => c.isPublished)

  // Group claims by source key (in canonical order)
  const claimsBySource = SOURCE_ORDER.reduce<Record<string, typeof publishedClaims>>((acc, key) => {
    acc[key] = publishedClaims.filter((c) => c.source.key === key)
    return acc
  }, {})

  // Collect unique comparisons involving this figure's claims
  const comparisonsMap = new Map<number, ComparisonWithClaims>()
  for (const claim of publishedClaims) {
    for (const cc of claim.comparisons) {
      comparisonsMap.set(cc.comparison.id, cc.comparison as unknown as ComparisonWithClaims)
    }
  }
  const comparisons = Array.from(comparisonsMap.values())

  // Sort: CONTRADICTION first, then SIMILAR_DIFFERENT, then SHARED
  const tagOrder = { CONTRADICTION: 0, SIMILAR_DIFFERENT: 1, SHARED: 2 }
  comparisons.sort((a, b) => tagOrder[a.tag] - tagOrder[b.tag])

  const overviewContent = (
    <div className="space-y-8">
      {figure.description && (
        <p className="text-stone-700 leading-relaxed">{figure.description}</p>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-stone-600 uppercase tracking-wider">
          Name across traditions
        </h3>
        <div className="flex flex-wrap gap-2">
          {figure.aliases.map((alias) => (
            <div key={alias.id} className="rounded-lg border border-stone-200 bg-white p-3">
              <Badge className={TRADITION_BG[alias.tradition]}>{alias.tradition}</Badge>
              <p className="mt-2 text-base font-semibold text-stone-900">{alias.name}</p>
              {alias.language && (
                <p className="text-xs text-stone-400">{alias.language}</p>
              )}
              {alias.notes && (
                <p className="mt-1 text-xs text-stone-500 leading-relaxed">{alias.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-stone-600 uppercase tracking-wider">
          Claims by source
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          {SOURCE_ORDER.map((key) => {
            const claims = claimsBySource[key]
            if (!claims || claims.length === 0) return null
            return (
              <div key={key}>
                <p className="mb-2 text-xs font-semibold text-stone-500">
                  {claims[0].source.title}
                </p>
                <div className="space-y-3">
                  {claims.map((claim) => (
                    <ClaimCard
                      key={claim.id}
                      claim={claim as unknown as ClaimWithRelations}
                      showSource={false}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const comparisonsContent = comparisons.length === 0 ? (
    <p className="text-stone-500">No comparisons yet.</p>
  ) : (
    <ComparisonTagFilter comparisons={comparisons} basePath="/comparisons" />
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/figures" className="hover:text-stone-700">Figures</Link>
        <span>/</span>
        <span className="text-stone-900">{figure.canonicalName}</span>
      </nav>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            {figure.canonicalName}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {figure.aliases.map((a) => (
              <Badge key={a.id} className={TRADITION_BG[a.tradition]}>
                {a.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { label: 'Overview', content: overviewContent },
          { label: 'Timeline', content: <FigureTimeline claims={publishedClaims as unknown as ClaimWithRelations[]} /> },
          { label: `Comparisons (${comparisons.length})`, content: comparisonsContent },
        ]}
      />

      {figureTimelineEvents.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
            On the timeline
          </h2>
          <div className="space-y-2">
            {figureTimelineEvents.map((event) => (
              <Link
                key={event.slug}
                href={`/timeline#${event.slug}`}
                className="flex items-start gap-3 rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900">{event.name}</p>
                  {event.summary && (
                    <p className="mt-0.5 text-xs text-stone-500 line-clamp-2">{event.summary}</p>
                  )}
                </div>
                <span className="flex-shrink-0 text-xs text-stone-400">Timeline →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {coFigures.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Figures mentioned alongside
          </h2>
          <div className="flex flex-wrap gap-3">
            {coFigures.map((f) => (
              <Link
                key={f.slug}
                href={`/figures/${f.slug}`}
                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm hover:border-stone-400 transition-colors"
              >
                <span className="font-medium text-stone-900">{f.canonicalName}</span>
                <span className="flex gap-1">
                  {f.aliases.slice(0, 2).map((a) => (
                    <Badge key={a.tradition} className={`${TRADITION_BG[a.tradition as keyof typeof TRADITION_BG]} text-[10px]`}>
                      {a.name}
                    </Badge>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
