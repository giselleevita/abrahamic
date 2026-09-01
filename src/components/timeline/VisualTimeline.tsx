'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Tradition, TraditionPresence, TimelineEra } from '@/generated/prisma/client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EventTradition {
  tradition: Tradition
  presence: TraditionPresence
  notes: string | null
}

export interface EventFigure {
  figure: {
    id: number | string
    slug: string
    canonicalName: string
  }
}

export interface EventData {
  id: number | string
  slug: string
  name: string
  summary: string | null
  figures: EventFigure[]
  traditions: EventTradition[]
}

export interface EraGroup {
  era: TimelineEra
  label: string
  gradient: string
  dotColor: string
  textAccent: string
  imageSrc: string
  imageAlt: string
  events: EventData[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TRADITION_ORDER: Tradition[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC']
const TRADITION_LABEL: Record<Tradition, string> = {
  JEWISH: 'Judaism',
  CHRISTIAN: 'Christianity',
  ISLAMIC: 'Islam',
  SHARED: 'Shared',
}
const TRADITION_DOT: Record<Tradition, string> = {
  JEWISH: 'bg-blue-500',
  CHRISTIAN: 'bg-red-500',
  ISLAMIC: 'bg-green-500',
  SHARED: 'bg-stone-400',
}
const TRADITION_PANEL: Record<Tradition, string> = {
  JEWISH: 'border-blue-200 bg-blue-50',
  CHRISTIAN: 'border-red-200 bg-red-50',
  ISLAMIC: 'border-green-200 bg-green-50',
  SHARED: 'border-stone-200 bg-stone-50',
}
const TRADITION_ACCENT: Record<Tradition, string> = {
  JEWISH: 'text-blue-700',
  CHRISTIAN: 'text-red-700',
  ISLAMIC: 'text-green-700',
  SHARED: 'text-stone-600',
}

const PRESENCE_CONFIG: Record<TraditionPresence, { icon: string; label: string; bg: string; text: string; border: string }> = {
  AFFIRMED: { icon: '✓', label: 'Affirmed',  bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
  MODIFIED: { icon: '~', label: 'Modified',  bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200' },
  SILENT:   { icon: '·', label: 'Silent',    bg: 'bg-stone-50',    text: 'text-stone-400',   border: 'border-stone-200' },
  REJECTED: { icon: '✕', label: 'Rejected',  bg: 'bg-rose-50',     text: 'text-rose-700',    border: 'border-rose-200' },
}

const ERA_EMOJI: Record<TimelineEra, string> = {
  PRIMORDIAL:  '🌌',
  PATRIARCHAL: '🏕️',
  EXODUS:      '🔥',
  KINGDOM:     '👑',
  GOSPEL:      '✨',
  EARLY_ISLAM: '🌙',
}

// ─── EventCard ────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: EventData
  textAccent: string
  isLeft: boolean
}

function EventCard({ event, textAccent, isLeft }: EventCardProps) {
  const [expanded, setExpanded] = useState(false)

  const traditionDots = TRADITION_ORDER.map((trad) => {
    const entry = event.traditions.find((t) => t.tradition === trad)
    const presence: TraditionPresence = entry?.presence ?? 'SILENT'
    const cfg = PRESENCE_CONFIG[presence]
    return { trad, entry, presence, cfg }
  })

  return (
    <div
      id={event.slug}
      className={`scroll-mt-20 ${isLeft ? 'sm:pr-6' : 'sm:pl-6'}`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
        aria-expanded={expanded}
      >
        {/* Card header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`text-lg font-bold ${textAccent} leading-snug`}>
            {event.name}
          </h3>
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            {expanded ? 'Close' : 'Explore'}
          </span>
        </div>

        {/* Summary */}
        {event.summary && (
          <p className={`mb-4 text-sm leading-6 text-slate-600 ${expanded ? '' : 'line-clamp-2'}`}>
            {event.summary}
          </p>
        )}

        {/* Tradition dots row */}
        <div className="flex items-center gap-2">
          {traditionDots.map(({ trad, cfg }) => (
            <span
              key={trad}
              title={`${TRADITION_LABEL[trad]}: ${cfg.label}`}
              className={`inline-flex items-center gap-1 rounded-full border ${cfg.border} ${cfg.bg} px-2 py-0.5 text-[10px] font-semibold ${cfg.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${TRADITION_DOT[trad]}`} />
              {cfg.icon}
            </span>
          ))}
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {/* Per-tradition panels */}
          <div className="grid gap-3 sm:grid-cols-3 mb-3">
            {traditionDots.map(({ trad, entry, cfg }) => (
              <div
                key={trad}
                className={`rounded-lg border ${TRADITION_PANEL[trad]} p-3`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-semibold ${TRADITION_ACCENT[trad]}`}>
                    {TRADITION_LABEL[trad]}
                  </span>
                  <span className={`rounded-full border ${cfg.border} px-1.5 py-0.5 text-[10px] font-bold ${cfg.text}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
                {entry?.notes ? (
                  <p className="text-sm text-slate-700 leading-6">{entry.notes}</p>
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    Not recorded in this tradition&apos;s canon.
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Figure pills */}
          {event.figures.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {event.figures.map(({ figure }) => (
                <Link
                  key={figure.id}
                  href={`/figures/${figure.slug}`}
                  className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-xs text-stone-600 hover:border-stone-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {figure.canonicalName}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── EraBanner ────────────────────────────────────────────────────────────────

interface EraBannerProps {
  era: TimelineEra
  label: string
  gradient: string
  imageSrc: string
  imageAlt: string
  eventCount: number
}

function EraBanner({ era, label, gradient, imageSrc, imageAlt, eventCount }: EraBannerProps) {
  return (
    <div className={`relative h-56 overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-r ${gradient} shadow-lg sm:h-72`}>
      <Image src={imageSrc} alt={imageAlt} fill sizes="(max-width: 768px) 100vw, 1100px" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
        <div><span className="text-2xl" aria-hidden>{ERA_EMOJI[era]}</span><h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{label}</h2></div>
        <span className="shrink-0 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-sm font-bold text-slate-900">{eventCount} events</span>
      </div>
    </div>
  )
}

// ─── VisualTimeline ───────────────────────────────────────────────────────────

interface VisualTimelineProps {
  groups: EraGroup[]
}

export default function VisualTimeline({ groups }: VisualTimelineProps) {
  return (
    <div className="relative">
      <nav aria-label="Jump to an era" className="sticky top-24 z-30 mb-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-md backdrop-blur">
        <div className="flex min-w-max gap-2">
          {groups.filter((group) => group.events.length > 0).map((group) => (
            <a key={group.era} href={`#era-${group.era.toLowerCase()}`} className={`rounded-xl bg-gradient-to-r ${group.gradient} px-4 py-3 text-sm font-bold ${group.textAccent} transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-100`}>
              <span className="mr-2" aria-hidden>{ERA_EMOJI[group.era]}</span>{group.label.split(' — ')[0]}
            </a>
          ))}
        </div>
      </nav>

      {/* Global desktop spine */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2 hidden sm:block"
        aria-hidden
      />

      <div className="space-y-12">
        {groups.map((group) => {
          if (!group.events.length) return null

          let globalIdx = 0

          return (
            <section id={`era-${group.era.toLowerCase()}`} key={group.era} className="scroll-mt-44 space-y-7">
              {/* Era banner */}
              <EraBanner
                era={group.era}
                label={group.label}
                gradient={group.gradient}
                imageSrc={group.imageSrc}
                imageAlt={group.imageAlt}
                eventCount={group.events.length}
              />

              {/* Events */}
              <div className="space-y-4">
                {group.events.map((event) => {
                  const idx = globalIdx++
                  const isLeft = idx % 2 === 0 // even → left on desktop

                  return (
                    <div key={event.id} className="relative">
                      {/* Desktop: 2-column layout */}
                      <div className="hidden sm:grid sm:grid-cols-2 sm:gap-0">
                        {/* Left column */}
                        <div className="pr-8">
                          {isLeft && (
                            <EventCard
                              event={event}
                              textAccent={group.textAccent}
                              isLeft
                            />
                          )}
                        </div>

                        {/* Spine dot */}
                        <div className="absolute left-1/2 top-4 -translate-x-1/2 z-10">
                          <div className={`h-3 w-3 rounded-full border-2 border-white ${group.dotColor} shadow-sm`} />
                        </div>

                        {/* Right column */}
                        <div className="pl-8">
                          {!isLeft && (
                            <EventCard
                              event={event}
                              textAccent={group.textAccent}
                              isLeft={false}
                            />
                          )}
                        </div>
                      </div>

                      {/* Mobile: single column with left spine */}
                      <div className="sm:hidden relative pl-8">
                        {/* Left spine line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-stone-200" aria-hidden />
                        {/* Dot */}
                        <div className={`absolute left-[-5px] top-4 h-3 w-3 rounded-full border-2 border-white ${group.dotColor} shadow-sm`} />
                        <EventCard
                          event={event}
                          textAccent={group.textAccent}
                          isLeft={false}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
