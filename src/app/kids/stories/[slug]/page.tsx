import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { AGE_BAND_RULES } from '@/lib/kids/readability'

export const dynamic = 'force-dynamic'

interface GlossaryEntry {
  term: string
  plainDefinition: string
}

function readGlossary(value: unknown): GlossaryEntry[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((raw) => {
    const entry = raw as Record<string, unknown>
    return typeof entry?.term === 'string' && typeof entry?.plainDefinition === 'string'
      ? [{ term: entry.term, plainDefinition: entry.plainDefinition }]
      : []
  })
}

export default async function KidsStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // An unapproved or unpublished story is a 404 here, not a redirect: it must
  // be indistinguishable from a story that does not exist.
  const story = await prisma.kidsStory.findFirst({
    where: { slug, isPublished: true, status: 'APPROVED' },
    include: {
      claims: {
        orderBy: { position: 'asc' },
        include: {
          claim: {
            select: {
              id: true,
              statement: true,
              source: { select: { title: true, slug: true } },
              verses: {
                select: { verse: { select: { referenceKey: true } } },
              },
            },
          },
        },
      },
      figures: { include: { figure: { select: { slug: true, canonicalName: true } } } },
    },
  })

  if (!story) notFound()

  const glossary = readGlossary(story.glossary)
  const paragraphs = story.body.split(/\n{2,}/).filter(Boolean)

  return (
    <article>
      <Link
        href="/kids/stories"
        className="mb-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        <span aria-hidden="true">←</span> All stories
      </Link>

      <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
        {AGE_BAND_RULES[story.ageBand].label}
      </p>
      <h1 className="mt-1 font-serif text-4xl font-bold leading-tight text-primary-950">
        {story.title}
      </h1>

      <div className="mt-6 space-y-4 text-xl leading-relaxed text-primary-900">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {glossary.length > 0 && (
        <section className="mt-8 rounded-xl border-2 border-primary-200 bg-white p-6">
          <h2 className="font-serif text-xl font-bold text-primary-950">Words in this story</h2>
          <dl className="mt-3 space-y-3">
            {glossary.map((entry) => (
              <div key={entry.term}>
                <dt className="font-bold text-primary-900">{entry.term}</dt>
                <dd className="text-primary-700">{entry.plainDefinition}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {story.figures.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 font-serif text-lg font-bold text-primary-950">
            People in this story
          </h2>
          <div className="flex flex-wrap gap-2">
            {story.figures.map(({ figure }) => (
              <Link
                key={figure.slug}
                href={`/figures/${figure.slug}`}
                className="rounded-full border border-primary-300 bg-white px-4 py-2 font-semibold text-primary-800 transition-colors hover:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                {figure.canonicalName}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* The provenance chain. Showing it keeps the kids section inside the
          site's "every claim is sourced" principle rather than making it a
          parallel, unsourced retelling. */}
      {story.claims.length > 0 && (
        <section className="mt-8 rounded-xl border border-primary-200 bg-primary-100 p-6">
          <h2 className="font-serif text-lg font-bold text-primary-950">
            Where this story comes from
          </h2>
          <p className="mt-1 text-sm text-primary-700">
            This story was written from these entries on the main site.
          </p>
          <ul className="mt-3 space-y-3">
            {story.claims.map(({ claim }) => (
              <li key={claim.id} className="text-sm">
                <p className="text-primary-800">{claim.statement}</p>
                <p className="mt-1 font-mono text-xs text-primary-600">
                  {claim.source.title}
                  {claim.verses.length > 0 &&
                    ` · ${claim.verses.map((v) => v.verse.referenceKey).join(', ')}`}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
