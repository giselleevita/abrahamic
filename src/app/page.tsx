import Link from 'next/link'
import prisma from '@/lib/prisma'
import { ComparisonBlock } from '@/components/claims/ComparisonBlock'
import { TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import type { ComparisonWithClaims } from '@/types'
import type { ConceptCategory } from '@prisma/client'

export const dynamic = 'force-dynamic'

const CATEGORY_LABEL: Record<ConceptCategory, string> = {
  THEOLOGY: 'Theology', SOTERIOLOGY: 'Soteriology', ESCHATOLOGY: 'Eschatology',
  PROPHETHOOD: 'Prophethood', PRACTICE: 'Practice', LAW: 'Law & Covenant', COSMOLOGY: 'Cosmology',
}

const ERA_ORDER = ['PRIMORDIAL', 'PATRIARCHAL', 'EXODUS', 'KINGDOM', 'GOSPEL', 'EARLY_ISLAM'] as const
const ERA_LABEL: Record<typeof ERA_ORDER[number], string> = {
  PRIMORDIAL: 'Primordial', PATRIARCHAL: 'Patriarchal', EXODUS: 'Exodus',
  KINGDOM: 'Kingdom', GOSPEL: 'Gospel', EARLY_ISLAM: 'Early Islam',
}
const ERA_BG: Record<typeof ERA_ORDER[number], string> = {
  PRIMORDIAL:  'from-indigo-100 to-blue-50',
  PATRIARCHAL: 'from-amber-100 to-yellow-50',
  EXODUS:      'from-rose-100 to-red-50',
  KINGDOM:     'from-violet-100 to-purple-50',
  GOSPEL:      'from-sky-100 to-cyan-50',
  EARLY_ISLAM: 'from-emerald-100 to-teal-50',
}
const ERA_ACCENT: Record<typeof ERA_ORDER[number], string> = {
  PRIMORDIAL:  'text-indigo-700',
  PATRIARCHAL: 'text-amber-700',
  EXODUS:      'text-rose-700',
  KINGDOM:     'text-violet-700',
  GOSPEL:      'text-sky-700',
  EARLY_ISLAM: 'text-emerald-700',
}

const HERO_VIDEO_SRC = '/hero-creation-banner.mp4'

export default async function HomePage() {
  const [
    figures, themes, featuredComparisons, featuredConcepts,
    figureCount, compCount, conceptCount, timelineCount,
    timelineEraGroups,
  ] = await Promise.all([
    prisma.figure.findMany({
      include: { aliases: true },
      orderBy: { canonicalName: 'asc' },
    }),
    prisma.theme.findMany({ orderBy: { name: 'asc' } }),
    prisma.comparison.findMany({
      where: { isPublished: true },
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
                    verse: { include: { translations: { where: { isDefault: true } } } },
                  },
                },
                figures: { include: { figure: true } },
                themes: { include: { theme: true } },
              },
            },
          },
        },
      },
      take: 2,
      orderBy: { createdAt: 'asc' },
    }),
    prisma.concept.findMany({
      where: { isPublished: true },
      select: { slug: true, name: true, category: true, summary: true },
      take: 6,
      orderBy: { name: 'asc' },
    }),
    prisma.figure.count(),
    prisma.comparison.count({ where: { isPublished: true } }),
    prisma.concept.count({ where: { isPublished: true } }),
    prisma.timelineEvent.count({ where: { isPublished: true } }),
    prisma.timelineEvent.groupBy({
      by: ['era'],
      where: { isPublished: true },
      _count: { id: true },
    }),
  ])

  const eraCountMap = Object.fromEntries(timelineEraGroups.map((g) => [g.era, g._count.id]))

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative mb-12 min-h-[34rem] overflow-hidden rounded-[2rem] border border-stone-800 bg-stone-950 px-6 py-8 shadow-[0_24px_80px_rgba(12,10,9,0.32)] sm:px-10 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.24),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(34,197,94,0.18),transparent_28%),linear-gradient(135deg,#050505_0%,#16110d_42%,#0b1b16_100%)]" />
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.82)_0%,rgba(5,5,5,0.58)_42%,rgba(5,5,5,0.3)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-950 via-stone-950/55 to-transparent" />

        <div className="relative z-10 flex min-h-[30rem] flex-col justify-between gap-10">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-200">
                In The Beginning
              </span>
            </div>

            <div className="mb-6 flex gap-1.5">
              <div className="h-1.5 w-20 rounded-full bg-blue-400" />
              <div className="h-1.5 w-20 rounded-full bg-red-400" />
              <div className="h-1.5 w-20 rounded-full bg-green-400" />
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-7xl">
              Three traditions. One question. What did they actually say?
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-200 sm:text-lg">
              From Genesis to the Quran, creation opens the story. Explore sourced comparisons across traditions in a clear, neutral reference built for study.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-blue-400/40 bg-blue-500/15 px-3 py-1 font-mono text-xs text-blue-100 backdrop-blur-sm">
                Genesis 1:1
              </span>
              <span className="rounded-full border border-red-400/40 bg-red-500/15 px-3 py-1 font-mono text-xs text-red-100 backdrop-blur-sm">
                John 1:1
              </span>
              <span className="rounded-full border border-green-400/40 bg-green-500/15 px-3 py-1 font-mono text-xs text-green-100 backdrop-blur-sm">
                Quran 21:30
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/comparisons" className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 hover:bg-stone-100 transition-colors">
                Browse Comparisons
              </Link>
              <Link href="/concepts" className="rounded-lg border border-white/20 bg-white/8 px-5 py-2.5 text-sm font-semibold text-stone-100 hover:border-white/35 hover:bg-white/12 transition-colors">
                Explore Concepts
              </Link>
              <Link href="/timeline" className="rounded-lg border border-white/20 bg-white/8 px-5 py-2.5 text-sm font-semibold text-stone-100 hover:border-white/35 hover:bg-white/12 transition-colors">
                View Timeline
              </Link>
              <Link href="/sources" className="rounded-lg border border-white/20 bg-white/8 px-5 py-2.5 text-sm font-semibold text-stone-100 hover:border-white/35 hover:bg-white/12 transition-colors">
                Read Sources
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="flex flex-wrap gap-4 border-t border-white/12 pt-6">
              {[
                { label: 'Judaism', dot: 'bg-blue-400' },
                { label: 'Christianity', dot: 'bg-red-400' },
                { label: 'Islam', dot: 'bg-green-400' },
              ].map(({ label, dot }) => (
                <div key={label} className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 backdrop-blur-sm">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  <span className="text-xs font-medium text-stone-200">{label}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/12 bg-black/30 p-4 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                Editorial Principle
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                Compare what each text says, not what any tradition is expected to say.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-stone-300">
                Every claim is sourced, every comparison is authored, and differences are presented clearly without advocacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Figures', value: figureCount, href: '/figures' },
          { label: 'Comparisons', value: compCount, href: '/comparisons' },
          { label: 'Concepts', value: conceptCount, href: '/concepts' },
          { label: 'Timeline events', value: timelineCount, href: '/timeline' },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-stone-200 bg-white px-5 py-5 hover:border-stone-400 hover:shadow-sm transition-all"
          >
            <p className="text-4xl font-black text-stone-900 group-hover:text-stone-700">{stat.value}</p>
            <p className="text-xs font-medium text-stone-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </section>

      {/* ── Key Figures ──────────────────────────────────────────────────── */}
      <section className="mb-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-900">Key Figures</h2>
          <Link href="/figures" className="text-sm text-stone-500 hover:text-stone-700">View all →</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {figures.map((figure) => (
            <Link
              key={figure.slug}
              href={`/figures/${figure.slug}`}
              className="group flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm hover:border-stone-400 hover:shadow-sm transition-all"
            >
              <span className="font-medium text-stone-900">{figure.canonicalName}</span>
              <span className="flex gap-1">
                {figure.aliases.slice(0, 3).map((a) => (
                  <Badge key={a.id} className={`${TRADITION_BG[a.tradition]} text-[10px]`}>
                    {a.name}
                  </Badge>
                ))}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Themes ───────────────────────────────────────────────────────── */}
      <section className="mb-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-900">Themes</h2>
          <Link href="/themes" className="text-sm text-stone-500 hover:text-stone-700">View all →</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <Link
              key={theme.slug}
              href={`/themes/${theme.slug}`}
              className="rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium hover:border-stone-400 hover:shadow-sm transition-all"
              style={{ borderLeftColor: theme.color ?? undefined, borderLeftWidth: 3 }}
            >
              {theme.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Concepts teaser ───────────────────────────────────────────────── */}
      {featuredConcepts.length > 0 && (
        <section className="mb-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-900">Theological Concepts</h2>
            <Link href="/concepts" className="text-sm text-stone-500 hover:text-stone-700">View all →</Link>
          </div>
          <p className="mb-5 text-sm text-stone-500 max-w-2xl">
            Key theological and philosophical ideas — and how Judaism, Christianity, and Islam each understand them.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredConcepts.map((concept) => (
              <Link
                key={concept.slug}
                href={`/concepts/${concept.slug}`}
                className="overflow-hidden rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:shadow-sm transition-all"
              >
                {/* Gradient top bar with 3 tradition colors */}
                <div className="h-1 flex gap-0">
                  <div className="flex-1 bg-blue-400" />
                  <div className="flex-1 bg-red-400" />
                  <div className="flex-1 bg-green-400" />
                </div>
                <div className="p-4">
                  <div className="mb-2 inline-block rounded-full border border-stone-100 px-2 py-0.5 text-[10px] text-stone-400">
                    {CATEGORY_LABEL[concept.category]}
                  </div>
                  <p className="font-semibold text-stone-900">{concept.name}</p>
                  {concept.summary && (
                    <p className="mt-1 text-xs text-stone-500 leading-relaxed line-clamp-2">
                      {concept.summary}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Timeline teaser ───────────────────────────────────────────────── */}
      {timelineCount > 0 && (
        <section className="mb-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-900">Timeline of Humanity</h2>
            <Link href="/timeline" className="text-sm text-stone-500 hover:text-stone-700">View full timeline →</Link>
          </div>
          <p className="mb-5 text-sm text-stone-500 max-w-2xl">
            Key events from creation to the founding of Islam — and how each tradition records, modifies, or disputes them.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ERA_ORDER.map((era) => {
              const count = eraCountMap[era] ?? 0
              if (count === 0) return null
              return (
                <Link
                  key={era}
                  href="/timeline"
                  className={`rounded-xl bg-gradient-to-r ${ERA_BG[era]} border border-stone-100 p-5 hover:border-stone-300 hover:shadow-sm transition-all`}
                >
                  <p className={`text-base font-bold ${ERA_ACCENT[era]}`}>{ERA_LABEL[era]}</p>
                  <p className="mt-1 text-sm text-stone-500">{count} event{count !== 1 ? 's' : ''}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Featured Comparisons ─────────────────────────────────────────── */}
      {featuredComparisons.length > 0 && (
        <section className="mb-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-900">Featured Comparisons</h2>
            <Link href="/comparisons" className="text-sm text-stone-500 hover:text-stone-700">
              View all →
            </Link>
          </div>
          <div className="space-y-10">
            {featuredComparisons.map((comp) => (
              <div key={comp.id} className="rounded-xl border border-stone-200 bg-white p-6 ring-1 ring-stone-100 hover:ring-stone-200 transition-all">
                <ComparisonBlock comparison={comp as unknown as ComparisonWithClaims} />
                <div className="mt-4">
                  <Link href={`/comparisons/${comp.id}`} className="text-xs text-stone-400 hover:text-stone-600">
                    Full comparison →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Methodology note ─────────────────────────────────────────────── */}
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-sm font-semibold text-amber-900">Editorial approach</h2>
        <p className="mt-2 text-sm text-amber-800 leading-relaxed">
          All comparisons on this platform are authored by editors and peer-reviewed before
          publishing. Tags (Shared / Similar-Different / Contradiction) are editorial judgments,
          never computed automatically. Every claim cites at least one verse. No claim uses
          evaluative language. The platform presents what texts say — not what they mean.
        </p>
      </section>
    </div>
  )
}
