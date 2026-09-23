import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import type { TimelineEra, TraditionPresence } from '@/generated/prisma/client'
import VisualTimeline from '@/components/timeline/VisualTimeline'
import { PageIntro } from '@/components/layout/PageIntro'

export const metadata: Metadata = { title: 'Timeline' }
// Cached content. Editors' changes appear immediately: mutating routes
// invalidate the matching tag via revalidateContent().
export const revalidate = 3600

const ERA_ORDER: TimelineEra[] = [
  'PRIMORDIAL', 'PATRIARCHAL', 'EXODUS', 'KINGDOM', 'GOSPEL', 'EARLY_ISLAM',
]

const ERA_CONFIG: Record<TimelineEra, {
  label: string
  gradient: string
  dotColor: string
  textAccent: string
  imageSrc: string
  imageAlt: string
}> = {
  PRIMORDIAL:  { gradient: 'from-indigo-100 to-blue-50', dotColor: 'bg-indigo-500', textAccent: 'text-indigo-700', label: 'Primordial — From Creation to the Flood', imageSrc: '/timeline/primordial.jpg', imageAlt: 'Illustrated cosmic dawn over mountains, water, and a flourishing landscape' },
  PATRIARCHAL: { gradient: 'from-amber-100 to-yellow-50', dotColor: 'bg-amber-500', textAccent: 'text-amber-800', label: 'Patriarchal — Abraham, Isaac & Jacob', imageSrc: '/timeline/patriarchal.jpg', imageAlt: 'Illustrated ancient desert encampment beneath a field of stars' },
  EXODUS:      { gradient: 'from-rose-100 to-red-50', dotColor: 'bg-rose-500', textAccent: 'text-rose-700', label: 'Exodus — Moses & the Law', imageSrc: '/timeline/exodus.jpg', imageAlt: 'Illustrated journey through the rocky Sinai landscape at sunrise' },
  KINGDOM:     { gradient: 'from-violet-100 to-purple-50', dotColor: 'bg-violet-500', textAccent: 'text-violet-700', label: 'Kingdom — David, Solomon & the Prophets', imageSrc: '/timeline/kingdom.jpg', imageAlt: 'Illustrated ancient hill city with scrolls and olive trees' },
  GOSPEL:      { gradient: 'from-sky-100 to-cyan-50', dotColor: 'bg-sky-500', textAccent: 'text-sky-700', label: 'Gospel Era — Jesus / Isa', imageSrc: '/timeline/gospel.jpg', imageAlt: 'Illustrated first-century lakeshore with boats, paths, and stone villages' },
  EARLY_ISLAM: { gradient: 'from-emerald-100 to-teal-50', dotColor: 'bg-emerald-500', textAccent: 'text-emerald-700', label: 'Early Islam — Muhammad & the Quran', imageSrc: '/timeline/early-islam.jpg', imageAlt: 'Illustrated historic Arabian oasis city at dawn with a caravan trail' },
}

const PRESENCE_CONFIG: Record<TraditionPresence, { icon: string; label: string; bg: string; text: string; border: string }> = {
  AFFIRMED: { icon: '✓', label: 'Affirmed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  MODIFIED: { icon: '~', label: 'Modified', bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  SILENT:   { icon: '·', label: 'Silent',   bg: 'bg-stone-50',   text: 'text-stone-400',   border: 'border-stone-200' },
  REJECTED: { icon: '✕', label: 'Rejected', bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
}

export default async function TimelinePage() {
  const events = await prisma.timelineEvent.findMany({
    where: { isPublished: true },
    include: {
      traditions: true,
      figures: { include: { figure: true } },
    },
    orderBy: [{ era: 'asc' }, { position: 'asc' }],
  })

  const groups = ERA_ORDER.map((era) => {
    const cfg = ERA_CONFIG[era]
    return {
      era,
      label: cfg.label,
      gradient: cfg.gradient,
      dotColor: cfg.dotColor,
      textAccent: cfg.textAccent,
      imageSrc: cfg.imageSrc,
      imageAlt: cfg.imageAlt,
      events: events
        .filter((e) => e.era === era)
        .map((e) => ({
          id: e.id,
          slug: e.slug,
          name: e.name,
          summary: e.summary,
          figures: e.figures.map(({ figure }) => ({
            figure: {
              id: figure.id,
              slug: figure.slug,
              canonicalName: figure.canonicalName,
            },
          })),
          traditions: e.traditions.map((t) => ({
            tradition: t.tradition,
            presence: t.presence,
            notes: t.notes,
          })),
        })),
    }
  })

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <PageIntro eyebrow="Follow the story" title="Interactive timeline" description="Travel from creation narratives to early Islam. Choose an era, open any event, and compare how each tradition records it." />

      <details className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer font-bold text-slate-900">How to read the comparison labels</summary>
        <div className="mt-4 flex flex-wrap gap-3">
          {(Object.keys(PRESENCE_CONFIG) as TraditionPresence[]).map((p) => {
            const c = PRESENCE_CONFIG[p]
            return (
              <span
                key={p}
                className={`flex items-center gap-1.5 rounded-full border ${c.border} ${c.bg} px-3 py-1 text-xs font-medium ${c.text}`}
              >
                <span className="font-bold">{c.icon}</span> {c.label}
              </span>
            )
          })}
          <span className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> Judaism
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Christianity
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Islam
          </span>
        </div>
      </details>

      {/* Visual timeline */}
      <VisualTimeline groups={groups} />

      {/* Editorial note */}
      <div className="mt-14 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm leading-6 text-amber-950">
          Chronology is presented in canonical narrative order rather than by disputed historical dating.
          &ldquo;Modified&rdquo; means the tradition records the event but with significant differences.
          &ldquo;Silent&rdquo; means the tradition&apos;s canon does not address this event.
          &ldquo;Rejected&rdquo; means the tradition explicitly contradicts the event as described.
          All tradition notes are written from within that tradition&apos;s own perspective.
        </p>
      </div>
    </div>
  )
}
