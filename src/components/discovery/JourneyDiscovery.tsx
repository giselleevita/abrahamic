'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Clock3 } from 'lucide-react'
import { useLearnProgress, useProgressHydrated } from '@/lib/learn/use-progress'
import { chapterProgress } from '@/lib/learn/progress'

type Step = { slug: string; title: string; summary: string | null; learningObjective: string | null; estimatedMinutes: number | null }
export function JourneyDiscovery({ courseSlug, steps }: { courseSlug: string; steps: Step[] }) {
  const [index, setIndex] = useState(0)
  const { progress } = useLearnProgress()
  const hydrated = useProgressHydrated()
  const step = steps[index] ?? steps[0]
  if (!step) return null
  return <section className="premium-section journey-discovery" aria-labelledby="route-title">
    <div className="premium-section-heading"><div><p className="editorial-eyebrow">02 / Your guided journey</p><h2 id="route-title">Take the scenic route.<br /><em>Find the connections.</em></h2></div><Link href={`/learn/${courseSlug}`} className="premium-text-link">See the journey map <ArrowRight size={18} aria-hidden /></Link></div>
    <div className="journey-workbench">
      <ol className="journey-stations" aria-label="Preview journey steps">{steps.map((item, i) => {
        const done = hydrated && Boolean(chapterProgress(progress, item.slug).completedAt)
        return <li key={item.slug}><button type="button" aria-pressed={i === index} onClick={() => setIndex(i)}><span className="station-number">{done ? <Check size={18} aria-label="Completed" /> : String(i + 1).padStart(2, '0')}</span><span>{item.title}</span><ArrowRight size={16} aria-hidden /></button></li>
      })}</ol>
      <div className="journey-preview" aria-live="polite" aria-atomic="true">
        <span className="journey-watermark" aria-hidden>{String(index + 1).padStart(2, '0')}</span>
        <div className="journey-preview-content" key={step.slug}><p className="editorial-eyebrow">Step {index + 1} of {steps.length}</p><h3>{step.title}</h3><p>{step.learningObjective || step.summary || 'Explore this chapter and its supporting sources.'}</p><span className="journey-duration"><Clock3 size={15} aria-hidden />{step.estimatedMinutes ?? 3} minutes · Sources included</span><Link href={`/learn/${courseSlug}/${step.slug}`} className="editorial-button">Explore this step <ArrowRight size={17} aria-hidden /></Link></div>
      </div>
    </div>
  </section>
}
