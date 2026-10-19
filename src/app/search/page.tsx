import { ScriptText } from '@/components/ui/ScriptText'
import { SearchForm } from '@/components/search/SearchForm'
import { SearchFilters } from '@/components/search/SearchFilters'
import { searchOptions } from '@/lib/search-options'
import { exactPassages } from '@/lib/search-references'
import { verseReaderHref } from '@/lib/verse-links'
import { Citation } from '@/components/ui/Citation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { search } from '@/lib/search'
import { PageIntro } from '@/components/layout/PageIntro'
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
  searchParams: Promise<{ q?: string; tradition?: string; type?: string; source?: string }>
}) {
  const params = await searchParams
  const { q } = params
  const filters = searchOptions(params)
  const query = typeof q === 'string' ? q.trim().slice(0, 300) : ''

  const form = <><SearchForm key={JSON.stringify(params)} query={query} filters={filters} /><SearchFilters /></>
  if (query.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <PageIntro eyebrow="Explore" title="Search" />
        {form}<p className="text-primary-700">Enter at least two characters to search.</p><div className="mt-5 flex flex-wrap gap-3">{['Abraham', 'prayer', 'creation'].map((term) => <Link key={term} href={`/search?q=${term}`} className="reading-action">{term}</Link>)}</div>
      </div>
    )
  }

  const [results, passages] = await Promise.all([search(query, 10, filters), exactPassages(query, filters)])

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageIntro eyebrow="Explore"
        title="Search"
        description={`${results.total + passages.length} displayed result${results.total + passages.length !== 1 ? 's' : ''} for “${query}”, ranked by relevance.`}
      />

      {form}
      {passages.length > 0 && <section className="mb-10" aria-label="Exact passages"><h2 className="mb-3 font-serif text-2xl text-primary-950">Exact passages</h2><p className="mb-4 text-sm text-primary-700">Choose a source and inspect its available editions. Numbering is preserved from each source.</p><div className="space-y-3">{passages.map((passage) => <Surface key={passage.href} className="p-5"><Link href={passage.href} className="underline underline-offset-4"><p className="font-semibold">{passage.label}</p></Link><p className="mt-1 text-sm text-primary-700">{passage.numbering}</p><div className="mt-3 flex flex-wrap gap-2">{passage.editions.length ? passage.editions.map((edition) => <Link key={edition} className="reading-action" href={passage.href.replace('#', `&edition=${encodeURIComponent(edition)}#`)}>{edition === 'Reader note (original)' ? 'Project explanation: ' : 'Edition: '}{edition}</Link>) : <p>Reference only; no permitted excerpt is available.</p>}</div></Surface>)}</div></section>}
      {results.total === 0 && passages.length === 0 && (
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
                key={`${verse.id}-${verse.translationName}`}
                href={verseReaderHref(verse.sourceSlug ?? verse.sourceKey.toLowerCase(), verse)}
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
                <ScriptText text={verse.text} className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-700" /><p className="mt-2 text-xs text-primary-700">Edition: {verse.translationName}</p>
              </Surface>
            ))}
          </div>
        </section>
      )}

      {results.claims.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-400">
            Teachings &amp; interpretations
          </h2>
          <div className="space-y-2">
            {results.claims.map((claim) => (
              <Surface key={claim.id} className="p-4">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-semibold ${TRADITION_BG[SOURCE_TRADITION[claim.sourceKey]]}`}
                >
                  {claim.sourceTitle}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-stone-800">{claim.statement}</p>
                {claim.citation && <div className="mt-3"><Citation sourceSlug={claim.citation.sourceSlug} verse={claim.citation} /></div>}
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
