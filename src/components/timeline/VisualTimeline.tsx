'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Tradition, TraditionPresence, TimelineEra } from '@prisma/client'

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
  dotColor: string
  textAccent: string
  isLeft: boolean
}

function EventCard({ event, dotColor, textAccent, isLeft }: EventCardProps) {
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
        className="w-full text-left rounded-xl border border-stone-200 bg-white shadow-sm hover:shadow-md hover:border-stone-300 transition-all p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
        aria-expanded={expanded}
      >
        {/* Card header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`text-sm font-semibold ${textAccent} leading-snug`}>
            {event.name}
          </h3>
          <span className="shrink-0 text-xs text-stone-400 mt-0.5">
            {expanded ? '▲' : '▼'}
          </span>
        </div>

        {/* Summary */}
        {event.summary && (
          <p className={`text-xs text-stone-600 leading-relaxed ${expanded ? '' : 'line-clamp-2'} mb-3`}>
            {event.summary}
          </p>
        )}

        {/* Tradition dots row */}
        <div className="flex items-center gap-2">
          {traditionDots.map(({ trad, presence, cfg }) => (
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
        <div className="mt-2 rounded-xl border border-stone-100 bg-stone-50 p-4">
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
                  <p className="text-xs text-stone-600 leading-relaxed">{entry.notes}</p>
                ) : (
                  <p className="text-xs text-stone-400 italic">
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
  textAccent: string
}

function EraBanner({ era, label, gradient, textAccent }: EraBannerProps) {
  return (
    <div className={`relative flex items-center gap-3 w-full py-2 bg-gradient-to-r ${gradient} rounded-xl px-4`}>
      <hr className="flex-1 border-stone-300" />
      <div className="shrink-0 flex items-center gap-2 rounded-full bg-white border border-stone-200 shadow-sm px-4 py-1.5">
        <span aria-hidden>{ERA_EMOJI[era]}</span>
        <span className={`text-xs font-bold tracking-wide uppercase ${textAccent}`}>
          {label}
        </span>
      </div>
      <hr className="flex-1 border-stone-300" />
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
            <section key={group.era} className="space-y-6">
              {/* Era banner */}
              <EraBanner
                era={group.era}
                label={group.label}
                gradient={group.gradient}
                textAccent={group.textAccent}
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
                              dotColor={group.dotColor}
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
                              dotColor={group.dotColor}
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
                          dotColor={group.dotColor}
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
