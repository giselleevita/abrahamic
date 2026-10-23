'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Compass } from 'lucide-react'
import { StoryScene } from '@/components/experience/Motion'
import type { TimelineEra } from '@/generated/prisma/client'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

const ERAS: Record<TimelineEra, { label: string; image: string; alt: string }> = {
  PRIMORDIAL: { label: 'Beginnings', image: 'primordial', alt: "Painting of storm clouds clearing over a flooded landscape (Thomas Cole, 1829)" },
  PATRIARCHAL: { label: 'Patriarchs', image: 'patriarchal', alt: "Painting of a Bedouin encampment with tents and palms beside a well (Marie-Méloé Lafon, 1841)" },
  EXODUS: { label: 'Exodus', image: 'exodus', alt: "Lithograph of the Convent of St Catherine below the mountains of Sinai (David Roberts, 1839)" },
  KINGDOM: { label: 'Kingdoms', image: 'kingdom', alt: "Lithograph of Jerusalem seen from the south (David Roberts)" },
  GOSPEL: { label: 'Gospel era', image: 'gospel', alt: "Lithograph of Tiberias on the Sea of Galilee (David Roberts, 1839)" },
  EARLY_ISLAM: { label: 'Early Islam', image: 'early-islam', alt: "Gold Kufic script on a ninth-century Qur'an manuscript folio" },
}
export type EraPreview = { era: TimelineEra; slug: string; name: string; summary: string | null }
export function EraDiscovery({ events }: { events: EraPreview[] }) {
  const [index, setIndex] = useState(0)
  const wide = useMediaQuery('(min-width: 768px)')
  const reduced = usePrefersReducedMotion()
  // Scrolling the page walks through the eras; small screens and reduced motion keep the buttons only.
  const scrollMode = wide && !reduced && events.length > 1
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollMode) return
    let frame = 0
    const update = () => {
      frame = 0
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      if (span <= 0) return
      const progress = Math.min(0.9999, Math.max(0, -rect.top / span))
      const next = Math.floor(progress * events.length)
      setIndex((current) => (current === next ? current : next))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [scrollMode, events.length])

  /** In scroll mode a choice scrolls to that era so the page and the buttons stay in step. */
  function choose(i: number) {
    const el = trackRef.current
    if (!scrollMode || !el) { setIndex(i); return }
    const span = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / events.length) * span, behavior: 'smooth' })
  }

  const event = events[index] ?? events[0]
  if (!event) return null
  const era = ERAS[event.era]
  return <section className="premium-section era-discovery" aria-labelledby="era-title">
    <div className="premium-section-heading"><div><p className="editorial-eyebrow">03 / A world of stories</p><h2 id="era-title">Travel through<br /><em>the stories that connect us.</em></h2></div><p>Move between narrative eras to discover the people, places, and sources behind the traditions.</p></div>
    <div ref={trackRef} style={scrollMode ? { height: `${events.length * 60 + 100}vh` } : undefined}>
    <div className={scrollMode ? 'sticky top-20' : undefined}>
    <div className="era-cinema">
      <StoryScene key={era.image} className="era-cinema-image"><Image src={`/timeline/${era.image}.jpg`} alt={era.alt} fill sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" /></StoryScene>
      <div className="era-cinema-shade" aria-hidden />
      <div className="era-cinema-label"><Compass size={19} aria-hidden /><span>A narrative atlas</span><span>{String(index + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}</span></div>
      <div className="era-cinema-copy" key={event.slug} aria-live={scrollMode ? 'off' : 'polite'} aria-atomic="true"><p>{era.label}</p><h3>{event.name}</h3>{event.summary && <p className="era-summary">{event.summary}</p>}<Link href={`/timeline#${event.slug}`}>Explore this era <ArrowUpRight size={18} aria-hidden /></Link></div>
      <div className="era-selector" role="group" aria-label="Choose a narrative era">{events.map((item, i) => <button key={item.era} type="button" aria-pressed={index === i} onClick={() => choose(i)}><span>{String(i + 1).padStart(2, '0')}</span>{ERAS[item.era].label}</button>)}</div>
    </div>
    {scrollMode && index < events.length - 1 && <p className="mt-3 text-center text-sm text-primary-700" aria-hidden="true">Keep scrolling to travel through time ↓</p>}
    </div>
    </div>
    <p className="artwork-note">Historical artwork, public domain · Narrative order, not a historical dating claim · <Link href="/licensing">Source and licence</Link></p>
  </section>
}
