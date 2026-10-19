'use client'

import { useState, type ReactNode } from 'react'
import type { Tradition } from '@/generated/prisma/client'
import { TRADITION_LABEL } from '@/lib/constants'

export function ComparisonLens({ views }: { views: { id: number; tradition: Tradition; content: ReactNode }[] }) {
  const [focus, setFocus] = useState<Tradition | 'ALL'>('ALL')
  const traditions = [...new Set(views.map((view) => view.tradition))]
  const visible = focus === 'ALL' ? views : views.filter((view) => view.tradition === focus)
  return <div>
    <div className="comparison-lens-controls" role="group" aria-label="Focus comparison perspectives">
      <button type="button" aria-pressed={focus === 'ALL'} onClick={() => setFocus('ALL')}>All perspectives</button>
      {traditions.map((tradition) => <button key={tradition} type="button" aria-pressed={focus === tradition} onClick={() => setFocus(tradition)}>{TRADITION_LABEL[tradition]}</button>)}
    </div>
    <p className="sr-only" role="status">Showing {focus === 'ALL' ? 'all perspectives' : TRADITION_LABEL[focus]}</p>
    <div className={`grid items-start gap-4 ${visible.length === 2 ? 'lg:grid-cols-2' : visible.length >= 3 ? 'lg:grid-cols-3' : 'max-w-2xl'}`}>{visible.map((view) => <div key={view.id}>{view.content}</div>)}</div>
  </div>
}
