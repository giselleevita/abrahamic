import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import type { TimelineEra, TraditionPresence } from '@prisma/client'
import VisualTimeline from '@/components/timeline/VisualTimeline'

export const metadata: Metadata = { title: 'Timeline' }
export const dynamic = 'force-dynamic'

const ERA_ORDER: TimelineEra[] = [
  'PRIMORDIAL', 'PATRIARCHAL', 'EXODUS', 'KINGDOM', 'GOSPEL', 'EARLY_ISLAM',
]

const ERA_CONFIG: Record<TimelineEra, {
  label: string
  gradient: string
  dotColor: string
  textAccent: string
}> = {
  PRIMORDIAL:  { gradient: 'from-indigo-100 to-blue-50',    dotColor: 'bg-indigo-400',   textAccent: 'text-indigo-700',  label: 'Primordial — From Creation to the Flood' },
  PATRIARCHAL: { gradient: 'from-amber-100 to-yellow-50',   dotColor: 'bg-amber-400',    textAccent: 'text-amber-700',   label: 'Patriarchal — Abraham, Isaac & Jacob' },
  EXODUS:      { gradient: 'from-rose-100 to-red-50',       dotColor: 'bg-rose-400',     textAccent: 'text-rose-700',    label: 'Exodus — Moses & the Law' },
  KINGDOM:     { gradient: 'from-violet-100 to-purple-50',  dotColor: 'bg-violet-400',   textAccent: 'text-violet-700',  label: 'Kingdom — David, Solomon & the Prophets' },
  GOSPEL:      { gradient: 'from-sky-100 to-cyan-50',       dotColor: 'bg-sky-400',      textAccent: 'text-sky-700',     label: 'Gospel Era — Jesus / Isa' },
  EARLY_ISLAM: { gradient: 'from-emerald-100 to-teal-50',   dotColor: 'bg-emerald-400',  textAccent: 'text-emerald-700', label: 'Early Islam — Muhammad & the Quran' },
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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Timeline of Humanity
        </h1>
        <p className="mt-3 text-stone-500 leading-relaxed max-w-2xl">
          Key events from the dawn of creation to the founding of Islam — and how each
          tradition records, modifies, or disputes them. Events are drawn from the shared
          scriptures: Torah, Bible, and Quran.
        </p>

        {/* Legend pills */}
        <div className="mt-5 flex flex-wrap gap-3">
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
      </div>

      {/* Visual timeline */}
      <VisualTimeline groups={groups} />

      {/* Editorial note */}
      <div className="mt-14 rounded-lg border border-stone-100 bg-stone-50 p-4">
        <p className="text-xs text-stone-500">
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
