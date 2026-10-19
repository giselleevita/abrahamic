'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Compass } from 'lucide-react'
import { StoryScene } from '@/components/experience/Motion'
import type { TimelineEra } from '@/generated/prisma/client'

const ERAS: Record<TimelineEra, { label: string; image: string; alt: string }> = {
  PRIMORDIAL: { label: 'Beginnings', image: 'primordial', alt: 'Illustrated cosmic dawn over mountains and water' },
  PATRIARCHAL: { label: 'Patriarchs', image: 'patriarchal', alt: 'Illustrated desert encampment beneath a field of stars' },
  EXODUS: { label: 'Exodus', image: 'exodus', alt: 'Illustrated rocky Sinai landscape at sunrise' },
  KINGDOM: { label: 'Kingdoms', image: 'kingdom', alt: 'Illustrated ancient hill city with scrolls and olive trees' },
  GOSPEL: { label: 'Gospel era', image: 'gospel', alt: 'Illustrated first-century lakeshore and stone villages' },
  EARLY_ISLAM: { label: 'Early Islam', image: 'early-islam', alt: 'Illustrated Arabian oasis city and a caravan trail' },
}
export type EraPreview = { era: TimelineEra; slug: string; name: string; summary: string | null }
export function EraDiscovery({ events }: { events: EraPreview[] }) {
  const [index, setIndex] = useState(0)
  const event = events[index] ?? events[0]
  if (!event) return null
  const era = ERAS[event.era]
  return <section className="premium-section era-discovery" aria-labelledby="era-title">
    <div className="premium-section-heading"><div><p className="editorial-eyebrow">03 / A world of stories</p><h2 id="era-title">Travel through<br /><em>the stories that connect us.</em></h2></div><p>Move between narrative eras to discover the people, places, and sources behind the traditions.</p></div>
    <div className="era-cinema">
      <StoryScene key={era.image} className="era-cinema-image"><Image src={`/timeline/${era.image}.jpg`} alt={era.alt} fill sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" /></StoryScene>
      <div className="era-cinema-shade" aria-hidden />
      <div className="era-cinema-label"><Compass size={19} aria-hidden /><span>A narrative atlas</span><span>{String(index + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}</span></div>
      <div className="era-cinema-copy" key={event.slug} aria-live="polite" aria-atomic="true"><p>{era.label}</p><h3>{event.name}</h3>{event.summary && <p className="era-summary">{event.summary}</p>}<Link href={`/timeline#${event.slug}`}>Explore this era <ArrowUpRight size={18} aria-hidden /></Link></div>
      <div className="era-selector" role="group" aria-label="Choose a narrative era">{events.map((item, i) => <button key={item.era} type="button" aria-pressed={index === i} onClick={() => setIndex(i)}><span>{String(i + 1).padStart(2, '0')}</span>{ERAS[item.era].label}</button>)}</div>
    </div>
    <p className="artwork-note">Illustrative project artwork · Narrative order, not a historical dating claim · <Link href="/licensing">Source and licence</Link></p>
  </section>
}
