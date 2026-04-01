import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import type { ConceptCategory, Tradition } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const concepts = await prisma.concept.findMany({ select: { slug: true } })
    return concepts.map((c) => ({ slug: c.slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const concept = await prisma.concept.findUnique({ where: { slug }, select: { name: true } })
  if (!concept) return {}
  return { title: concept.name }
}

const TRADITION_STYLE: Record<Tradition, { bg: string; border: string; label: string; dot: string }> = {
  JEWISH:    { bg: 'bg-blue-50',  border: 'border-blue-200',  label: 'Judaism',     dot: 'bg-blue-500' },
  CHRISTIAN: { bg: 'bg-red-50',   border: 'border-red-200',   label: 'Christianity', dot: 'bg-red-500' },
  ISLAMIC:   { bg: 'bg-green-50', border: 'border-green-200', label: 'Islam',        dot: 'bg-green-500' },
  SHARED:    { bg: 'bg-violet-50',border: 'border-violet-200',label: 'Shared',       dot: 'bg-violet-500' },
}

const TRADITION_ORDER: Tradition[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC']

const CATEGORY_LABEL: Record<ConceptCategory, string> = {
  THEOLOGY: 'Theology', SOTERIOLOGY: 'Soteriology', ESCHATOLOGY: 'Eschatology',
  PROPHETHOOD: 'Prophethood', PRACTICE: 'Practice', LAW: 'Law & Covenant', COSMOLOGY: 'Cosmology',
}

export default async function ConceptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const concept = await prisma.concept.findUnique({
    where: { slug, isPublished: true },
    include: {
      traditions: { orderBy: { tradition: 'asc' } },
      claims: {
        orderBy: { position: 'asc' },
        include: {
          claim: {
            include: {
              source: true,
              verses: {
                include: {
                  verse: { include: { translations: { where: { isDefault: true } } } },
                },
              },
              themes: { include: { theme: true } },
            },
          },
        },
      },
    },
  })

  if (!concept) notFound()

  const relatedConcepts = await prisma.concept.findMany({
    where: { isPublished: true, category: concept.category, slug: { not: slug } },
    select: { slug: true, name: true, summary: true },
    take: 4,
    orderBy: { name: 'asc' },
  })

  const orderedTraditions = TRADITION_ORDER
    .map((t) => concept.traditions.find((tr) => tr.tradition === t))
    .filter(Boolean) as NonNullable<(typeof concept.traditions)[0]>[]

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/concepts" className="hover:text-stone-700">Concepts</Link>
        <span>/</span>
        <span className="text-stone-900">{concept.name}</span>
      </nav>

      <div className="mb-10">
        <div className="mb-2 inline-block rounded-full border border-stone-200 px-3 py-0.5 text-xs text-stone-500">
          {CATEGORY_LABEL[concept.category]}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">{concept.name}</h1>
        {concept.summary && (
          <p className="mt-3 text-stone-600 leading-relaxed max-w-2xl">{concept.summary}</p>
        )}
      </div>

      {/* Per-tradition definitions */}
      <div className="grid gap-4 sm:grid-cols-3 mb-12">
        {orderedTraditions.map((t) => {
          const style = TRADITION_STYLE[t.tradition]
          return (
            <div key={t.id} className={`rounded-xl border ${style.border} ${style.bg} p-5`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                <span className="text-sm font-semibold text-stone-800">{style.label}</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">{t.definition}</p>
              {t.nuances && (
                <div className="mt-3 pt-3 border-t border-stone-200/60">
                  <p className="text-xs font-medium text-stone-400 mb-1">Nuances</p>
                  <p className="text-xs text-stone-500 leading-relaxed">{t.nuances}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Linked claims */}
      {concept.claims.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
            Source citations
          </h2>
          <div className="space-y-4">
            {concept.claims.map(({ claim }) => {
              const primaryVerse = claim.verses[0]?.verse
              const translation = primaryVerse?.translations[0]
              const style = TRADITION_STYLE[claim.source.tradition as Tradition] ?? TRADITION_STYLE.SHARED
              return (
                <div key={claim.id} className={`rounded-xl border ${style.border} ${style.bg} p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                    <span className="text-xs font-medium text-stone-600">{claim.source.title}</span>
                  </div>
                  <p className="text-sm text-stone-800 leading-relaxed">{claim.statement}</p>
                  {primaryVerse && translation && (
                    <blockquote className="mt-2 border-l-2 border-stone-200 pl-3">
                      <p className="text-xs text-stone-500 italic">"{translation.text}"</p>
                      <cite className="mt-0.5 block text-xs font-medium text-stone-400 not-italic">
                        {primaryVerse.book} {primaryVerse.chapter}:{primaryVerse.verse}
                      </cite>
                    </blockquote>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Related concepts */}
      {relatedConcepts.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
            More in {CATEGORY_LABEL[concept.category]}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedConcepts.map((c) => (
              <Link
                key={c.slug}
                href={`/concepts/${c.slug}`}
                className="rounded-xl border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
              >
                <p className="font-medium text-stone-900">{c.name}</p>
                {c.summary && (
                  <p className="mt-1 text-xs text-stone-500 line-clamp-2">{c.summary}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Editorial note */}
      <div className="mt-10 rounded-lg border border-stone-100 bg-stone-50 p-4">
        <p className="text-xs text-stone-500">
          Each tradition's definition is written from within that tradition's own perspective and vocabulary.
          The editors do not adjudicate between traditions; readers are encouraged to consult primary sources directly.
        </p>
      </div>
    </div>
  )
}
