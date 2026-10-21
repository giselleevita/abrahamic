'use client'

import Link from 'next/link'
import { useDeviceStore } from '@/lib/experience/storage'
import { parseTrail, TRAIL_KEY, type TrailItem } from '@/lib/experience/trail'

const EMPTY: TrailItem[] = []
const ICON: Record<TrailItem['kind'], string> = { figure: '👤', concept: '💭', comparison: '⚖️' }

/** "Pick up where you left off", drawn from pages visited on this device. */
export function TrailStrip() {
  const { value, save } = useDeviceStore(TRAIL_KEY, EMPTY, parseTrail)
  if (value.length === 0) return null
  return (
    <section aria-labelledby="trail-title" className="mx-auto max-w-[1376px] px-6 pb-8 sm:px-12">
      <div className="rounded-3xl border border-[#d7c5ad] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="trail-title" className="font-serif text-2xl text-slate-950">Pick up where you left off</h2>
          <button type="button" onClick={() => save([])} className="text-sm font-semibold text-slate-700 underline hover:text-slate-950">Clear</button>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {value.slice(0, 6).map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="inline-flex items-center gap-2 rounded-full border border-[#d7c5ad] bg-[#fbf6ec] px-4 py-2 text-sm font-semibold text-[#173b68] hover:border-[#b7791f]">
                <span aria-hidden="true">{ICON[t.kind]}</span>{t.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-600">Kept only on this device. Nothing is sent anywhere.</p>
      </div>
    </section>
  )
}
