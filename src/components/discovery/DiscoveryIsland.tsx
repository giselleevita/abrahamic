'use client'

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import type { PerspectiveTopic } from './PerspectiveExplorer'
import type { EraPreview } from './EraDiscovery'

type JourneyData = Parameters<typeof import('./JourneyDiscovery').JourneyDiscovery>[0]
const loadPerspectives = () => import('./PerspectiveExplorer').then((module) => ({ default: module.PerspectiveExplorer }))
const loadJourney = () => import('./JourneyDiscovery').then((module) => ({ default: module.JourneyDiscovery }))
const loadEras = () => import('./EraDiscovery').then((module) => ({ default: module.EraDiscovery }))

/** Keep real server-rendered links available while loading interaction only near the viewport. */
function DiscoveryIsland<T extends object>({ data, load, fallback }: { data: T; load: () => Promise<{ default: ComponentType<T> }>; fallback: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [Interactive, setInteractive] = useState<ComponentType<T> | null>(null)
  useEffect(() => {
    const container = ref.current
    if (!container) return
    let cancelled = false
    let requested = false
    let ready: ComponentType<T> | null = null
    let timer: ReturnType<typeof setTimeout> | undefined
    const reveal = () => {
      // Do not replace a link while a keyboard reader is using it.
      if (!cancelled && ready && !container.contains(document.activeElement)) setInteractive(() => ready)
    }
    const start = () => {
      if (requested) return
      requested = true
      load().then((module) => { ready = module.default; reveal() }).catch(() => { /* Keep the usable server-rendered content. */ })
    }
    const blur = () => { timer = setTimeout(reveal, 0) }
    container.addEventListener('focusout', blur)
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { start(); observer?.disconnect() }
    }, { rootMargin: '80px' })
    if (observer) observer.observe(container)
    else start()
    return () => { cancelled = true; clearTimeout(timer); observer?.disconnect(); container.removeEventListener('focusout', blur) }
  }, [load])
  return <div ref={ref}>{Interactive ? <Interactive {...data} /> : fallback}</div>
}

export function DeferredPerspectives({ topics, fallback }: { topics: PerspectiveTopic[]; fallback: ReactNode }) {
  return <DiscoveryIsland data={{ topics }} load={loadPerspectives} fallback={fallback} />
}
export function DeferredJourney({ fallback, ...data }: JourneyData & { fallback: ReactNode }) {
  return <DiscoveryIsland data={data} load={loadJourney} fallback={fallback} />
}
export function DeferredEras({ events, fallback }: { events: EraPreview[]; fallback: ReactNode }) {
  return <DiscoveryIsland data={{ events }} load={loadEras} fallback={fallback} />
}
