'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BookOpen, GitCompareArrows } from 'lucide-react'
import { Tabs } from '@/components/ui/Tabs'
import { Citation } from '@/components/ui/Citation'
import { TRADITION_LABEL } from '@/lib/constants'
import type { Tradition } from '@/generated/prisma/client'
import type { VerseRef } from '@/lib/verse-links'

export type PerspectiveTopic = {
  id: number
  title: string
  perspectives: {
    id: number
    statement: string
    tradition: Tradition
    sourceTitle: string
    sourceSlug: string
    citations: VerseRef[]
  }[]
}

export function PerspectiveExplorer({ topics }: { topics: PerspectiveTopic[] }) {
  const [selected, setSelected] = useState(topics[0]?.id)
  const topic = topics.find((item) => item.id === selected) ?? topics[0]
  if (!topic) return null
  const traditions = (['JEWISH', 'CHRISTIAN', 'ISLAMIC', 'SHARED'] as const)
    .filter((tradition) => topic.perspectives.some((view) => view.tradition === tradition))

  return <section className="premium-section" aria-labelledby="perspective-title" id="perspectives">
    <div className="premium-section-heading">
      <div><p className="editorial-eyebrow">01 / An exchange of perspectives</p><h2 id="perspective-title">One question.<br /><em>More than one perspective.</em></h2></div>
      <p>Choose a question. Switch between traditions. Follow each perspective back to its sources.</p>
    </div>
    <div className="perspective-workbench">
      <div className="perspective-topics" role="group" aria-label="Choose a comparison topic">
        <p className="workbench-caption"><GitCompareArrows size={15} aria-hidden /> Choose your question</p>
        {topics.map((item, index) => <button key={item.id} type="button" aria-pressed={topic.id === item.id} onClick={() => setSelected(item.id)}>
          <span className="topic-number">{String(index + 1).padStart(2, '0')}</span><span>{item.title}</span><ArrowUpRight size={17} aria-hidden />
        </button>)}
        <Link href="/comparisons" className="workbench-all">Browse every comparison <ArrowRight size={15} aria-hidden /></Link>
      </div>
      <div className="perspective-stage">
        <div className="workbench-caption"><span className="live-dot" /> Interactive source explorer</div>
        <h3 className="perspective-heading">{topic.title}</h3>
        <Tabs key={topic.id} label="Explore tradition perspectives" tabs={traditions.map((tradition) => ({
          label: TRADITION_LABEL[tradition],
          content: <div className="perspective-content" data-tradition={tradition}>
            <p className="perspective-attribution">{TRADITION_LABEL[tradition]} · Project-authored explanation</p>
            {topic.perspectives.filter((view) => view.tradition === tradition).map((view) => <article key={view.id} className="perspective-view">
              <p className="perspective-statement">{view.statement}</p>
              <div className="perspective-evidence"><BookOpen size={17} aria-hidden /><div><span className="workbench-caption">Read the evidence · {view.sourceTitle}</span><ul>{view.citations.map((verse) => <li key={`${verse.book}:${verse.chapter}:${verse.verse}:${verse.versification}`}><Citation sourceSlug={view.sourceSlug} verse={verse} /></li>)}</ul>{view.citations.length === 0 && <p className="text-sm text-primary-700">No passage is attached to this explanation.</p>}</div></div>
            </article>)}
          </div>,
        }))} />
        <Link href={`/comparisons/${topic.id}`} className="premium-text-link">Open the complete comparison <ArrowUpRight size={17} aria-hidden /></Link>
      </div>
    </div>
  </section>
}
