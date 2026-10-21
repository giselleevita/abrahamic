'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { TRADITION_LABEL } from '@/lib/constants'
import type { TimelineEra, Tradition, TraditionPresence } from '@/generated/prisma/client'

export type PlayerEvent = {
  slug: string
  name: string
  summary: string | null
  era: TimelineEra
  eraLabel: string
  imageSrc: string
  imageAlt: string
  traditions: { tradition: Tradition; presence: TraditionPresence }[]
}

const PRESENCE: Record<TraditionPresence, { icon: string; label: string }> = {
  AFFIRMED: { icon: '✓', label: 'tells it' },
  MODIFIED: { icon: '~', label: 'tells it differently' },
  SILENT: { icon: '·', label: 'does not mention it' },
  REJECTED: { icon: '✕', label: 'says otherwise' },
}
const STEP_MS = 7000

/** Plays the whole story, one event at a time. Pause, step or jump at any point. */
export function StoryPlayer({ events }: { events: PlayerEvent[] }) {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const last = events.length - 1
  const ev = events[i]
  const eraStarts = useMemo(() => events.map((e, k) => (k === 0 || events[k - 1].era !== e.era ? k : -1)).filter((k) => k >= 0), [events])

  useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => {
      if (i >= last) setPlaying(false)
      else setI(i + 1)
    }, STEP_MS)
    return () => window.clearTimeout(t)
  }, [playing, i, last])

  if (!ev) return null
  const go = (n: number) => setI(Math.max(0, Math.min(last, n)))

  return (
    <section aria-labelledby="player-title" className="mb-10 overflow-hidden rounded-3xl border border-[#d7c5ad] bg-[#172b38] text-[#fff7e7]">
      <div className="relative min-h-[360px]">
        <Image key={ev.imageSrc} src={ev.imageSrc} alt={ev.imageAlt} fill sizes="(min-width:1024px) 1100px, 100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101e29] via-[#101e29]/70 to-transparent" aria-hidden="true" />
        <div className="relative flex min-h-[360px] flex-col justify-end p-6 sm:p-9">
          <p id="player-title" className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2c69e]">▶ Play the story · {ev.eraLabel}</p>
          <div aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
            <h2 key={ev.slug} className="mt-2 font-serif text-3xl sm:text-4xl">{ev.name}</h2>
            {ev.summary && <p className="mt-3 max-w-3xl text-base leading-7 text-[#e8e3d6] sm:text-lg">{ev.summary}</p>}
          </div>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="How each tradition treats this event">
            {ev.traditions.map((t) => (
              <li key={t.tradition} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                {TRADITION_LABEL[t.tradition]} {PRESENCE[t.presence].icon} {PRESENCE[t.presence].label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-[#101e29] px-5 py-4 sm:px-8">
        <div
          role="progressbar"
          aria-label="Story progress"
          aria-valuemin={1}
          aria-valuemax={events.length}
          aria-valuenow={i + 1}
          className="h-2 overflow-hidden rounded-full bg-white/15"
        >
          <div className="h-full rounded-full bg-[#e2c69e] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${((i + 1) / events.length) * 100}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => go(i - 1)} disabled={i === 0} className="rounded-full border border-white/30 px-4 py-2 text-sm font-bold enabled:hover:bg-white/10 disabled:opacity-40" aria-label="Previous event">← Back</button>
          <button
            type="button"
            onClick={() => { if (!playing && i >= last) setI(0); setPlaying((p) => !p) }}
            aria-pressed={playing}
            className="rounded-full bg-[#e2c69e] px-6 py-2 text-sm font-extrabold text-[#101e29] hover:bg-[#f0d9b3]"
          >
            {playing ? '⏸ Pause' : i >= last ? '↺ Replay' : '▶ Play'}
          </button>
          <button type="button" onClick={() => go(i + 1)} disabled={i === last} className="rounded-full border border-white/30 px-4 py-2 text-sm font-bold enabled:hover:bg-white/10 disabled:opacity-40" aria-label="Next event">Next →</button>
          <span className="text-sm text-[#cfc7b4]">{i + 1} of {events.length}</span>
          <a href={`#${ev.slug}`} className="ml-auto text-sm font-bold text-[#e2c69e] underline hover:text-white">Open this event below ↓</a>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Jump to a period">
          {eraStarts.map((k) => (
            <button key={k} type="button" onClick={() => go(k)} aria-pressed={events[k].era === ev.era} className={`rounded-full border px-3 py-1 text-xs font-semibold ${events[k].era === ev.era ? 'border-[#e2c69e] bg-white/10' : 'border-white/25 hover:bg-white/10'}`}>{events[k].eraLabel.split('—')[0].trim()}</button>
          ))}
        </div>
      </div>
    </section>
  )
}
