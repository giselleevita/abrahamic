'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MAP_HEIGHT, MAP_LAND, MAP_WIDTH, project } from '@/lib/map-land'
import { MAP_ERAS, MAP_PLACES, type MapEra } from '@/lib/map-places'

export function StoryMap() {
  const [selectedId, setSelectedId] = useState('jerusalem')
  const [era, setEra] = useState<MapEra | null>(null)
  const inEra = (p: (typeof MAP_PLACES)[number]) => !era || p.eras.includes(era)
  const selected = MAP_PLACES.find((p) => p.id === selectedId) ?? MAP_PLACES[0]

  return (
    <div>
    <fieldset className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-[#d7c5ad] bg-white px-4 py-3">
      <legend className="px-1 text-sm font-semibold text-slate-900">Show places from</legend>
      <button type="button" aria-pressed={era === null} onClick={() => setEra(null)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${era === null ? 'border-[#b7791f] bg-[#fbf6ec]' : 'border-[#d7c5ad] bg-white hover:border-[#b7791f]'}`}>All eras</button>
      {MAP_ERAS.map((e) => (
        <button key={e.id} type="button" aria-pressed={era === e.id} onClick={() => setEra(e.id)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${era === e.id ? 'border-[#b7791f] bg-[#fbf6ec]' : 'border-[#d7c5ad] bg-white hover:border-[#b7791f]'}`}>{e.label}</button>
      ))}
    </fieldset>
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <figure className="rounded-3xl border border-[#d7c5ad] bg-[#cfe3ea] p-2 sm:p-3">
        <svg
          role="group"
          aria-label="Map of the Middle East with ten places from the stories. Each place is a button; the same places are listed beside the map."
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="block h-auto w-full rounded-2xl"
        >
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#cfe3ea" />
          <path d={MAP_LAND} fill="#f1e6cf" stroke="#f1e6cf" strokeWidth="1.2" strokeLinejoin="round" />
          {MAP_PLACES.map((p) => {
            const { x, y } = project(p.lat, p.lon)
            const on = p.id === selected.id
            return (
              <g key={p.id} opacity={inEra(p) ? 1 : 0.22}>
                <circle cx={x} cy={y} r={on ? 11 : 8} fill={on ? '#b7791f' : '#173b68'} stroke="#fff9ed" strokeWidth="2.5" />
                <text
                  x={x + (p.dx ?? 14)}
                  y={y + (p.dy ?? 4)}
                  fontSize="15"
                  fontWeight="700"
                  fill="#1a1613"
                  stroke="#f1e6cf"
                  strokeWidth="4"
                  paintOrder="stroke"
                  textAnchor={(p.dx ?? 1) < 0 ? 'end' : 'start'}
                >
                  {p.name}
                </text>
                <circle
                  cx={x}
                  cy={y}
                  r={20}
                  fill="transparent"
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.name}: show the story`}
                  aria-pressed={on}
                  onClick={() => setSelectedId(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedId(p.id)
                    }
                  }}
                />
              </g>
            )
          })}
        </svg>
        <figcaption className="px-2 pb-1 pt-2 text-xs text-slate-600">
          Land outlines: Natural Earth, public domain. Locations are approximate, and some are traditional sites.
        </figcaption>
      </figure>

      <div>
        <article aria-live="polite" className="rounded-3xl border border-[#d7c5ad] bg-white p-6">
          <p className="editorial-eyebrow">{selected.name}</p>
          <p className="mt-3 text-lg leading-8 text-slate-800">{selected.story}</p>
          {selected.caution && (
            <p className="mt-3 rounded-xl bg-[#fbf6ec] px-4 py-3 text-sm leading-6 text-[#3d3326]">
              <strong>A note on the place:</strong> {selected.caution}
            </p>
          )}
          {selected.events.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-bold text-slate-900">Events here on the timeline</p>
              <ul className="mt-2 space-y-1 text-sm">
                {selected.events.map((ev) => (
                  <li key={ev.slug}><Link href={`/timeline#${ev.slug}`} className="font-semibold text-[#173b68] hover:underline">{ev.name} →</Link></li>
                ))}
              </ul>
            </div>
          )}
          <ul className="mt-4 flex flex-wrap gap-2">
            {selected.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block rounded-full border border-[#d7c5ad] px-4 py-2 text-sm font-semibold text-[#173b68] hover:border-[#b7791f]">
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </article>

        <ul className="mt-4 grid grid-cols-2 gap-2">
          {MAP_PLACES.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelectedId(p.id)}
                aria-pressed={p.id === selected.id}
                className={`${inEra(p) ? '' : 'opacity-40 '}w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f] ${
                  p.id === selected.id ? 'border-[#b7791f] bg-[#fbf6ec] text-slate-950' : 'border-[#d7c5ad] bg-white text-slate-800 hover:border-[#b7791f]'
                }`}
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  )
}
