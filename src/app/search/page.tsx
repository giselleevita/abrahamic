import type { Metadata } from 'next'
import Link from 'next/link'
import { search } from '@/lib/search'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Surface } from '@/components/ui/Surface'
import { Callout } from '@/components/ui/Callout'
import { CONCEPT_CATEGORY_LABEL, ERA_LABEL, SOURCE_TRADITION, TRADITION_BG } from '@/lib/constants'

// Results depend on the query string, so this route is inherently per-request.
// The cost now sits in indexed lookups rather than six sequential scans.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Search' }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  if (query.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <SectionHeader title="Search" />
        <p className="text-primary-300">Enter at least two characters to search.</p>
      </div>
    )
  }

  const results = await search(query)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <SectionHeader
        title="Search"
        description={`${results.total} result${results.total !== 1 ? 's' : ''} for “${query}”, ranked by relevance.`}
      />

      {results.total === 0 && (
        <Callout tone="note">
          Nothing matched “{query}”. Try a different word, or browse{' '}
          <Link href="/concepts" className="underline">concepts</Link> and{' '}
          <Link href="/figures" className="underline">figures</Link>.
        </Callout>
      )}

      {results.figures.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-400">
            Figures
          </h2>
          <div className="space-y-2">
            {results.figures.map((figure) => (
              <Surface key={figure.slug} href={`/figures/${figure.slug}`} className="p-4">
                <p className="font-medium text-stone-900">{figure.canonicalName}</p>
              </Surface>
            ))}
          </div>
        </section>
      )}

      {results.verses.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-400">
            Verses
          </h2>
          <div className="space-y-2">
            {results.verses.map((verse) => (
              <Surface
                key={verse.id}
                href={`/sources/${verse.sourceKey.toLowerCase()}/read?book=${encodeURIComponent(verse.book)}&chapter=${verse.chapter}`}
                className="p-4"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold ${TRADITION_BG[SOURCE_TRADITION[verse.sourceKey]]}`}
                  >
                    {verse.sourceTitle}
                  </span>
                  <span className="font-mono text-xs text-stone-500">
                    {verse.book} {verse.chapter}:{verse.verse}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-700">
                  {verse.text}
                </p>
              </Surface>
            ))}
          </div>
        </section>
      )}

      {results.claims.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-400">
            Claims
          </h2>
          <div className="space-y-2">
            {results.claims.map((claim) => (
              <Surface key={claim.id} className="p-4" interactive>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold ${TRADITION_BG[SOURCE_TRADITION[claim.sourceKey]]}`}
                >
                  {claim.sourceTitle}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-stone-800">{claim.statement}</p>
              </Surface>
            ))}
          </div>
        </section>
      )}

      {results.concepts.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-400">
            Concepts
          </h2>
          <div className="space-y-2">
            {results.concepts.map((concept) => (
              <Surface key={concept.slug} href={`/concepts/${concept.slug}`} className="p-4">
                <p className="text-[10px] uppercase tracking-wide text-stone-400">
                  {CONCEPT_CATEGORY_LABEL[concept.category]}
                </p>
                <p className="font-medium text-stone-900">{concept.name}</p>
                {concept.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-stone-500">{concept.summary}</p>
                )}
              </Surface>
            ))}
          </div>
        </section>
      )}

      {results.timelineEvents.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-400">
            Timeline
          </h2>
          <div className="space-y-2">
            {results.timelineEvents.map((event) => (
              <Surface key={event.slug} href={`/timeline#${event.slug}`} className="p-4">
                <p className="text-[10px] uppercase tracking-wide text-stone-400">
                  {ERA_LABEL[event.era]}
                </p>
                <p className="font-medium text-stone-900">{event.name}</p>
                {event.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-stone-500">{event.summary}</p>
                )}
              </Surface>
            ))}
          </div>
        </section>
      )}

      {results.themes.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-400">
            Themes
          </h2>
          <div className="flex flex-wrap gap-2">
            {results.themes.map((theme) => (
              <Link
                key={theme.slug}
                href={`/themes/${theme.slug}`}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition-colors hover:border-stone-400"
              >
                {theme.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
