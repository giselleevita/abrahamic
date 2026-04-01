'use client'

import { useState } from 'react'
import type { ComparisonTag } from '@prisma/client'
import { COMPARISON_TAG_LABEL, COMPARISON_TAG_STYLE } from '@/lib/constants'
import { ComparisonBlock } from './ComparisonBlock'
import type { ComparisonWithClaims } from '@/types'
import Link from 'next/link'

interface Props {
  comparisons: ComparisonWithClaims[]
  basePath: string
}

const ALL_TAGS: ComparisonTag[] = ['SHARED', 'SIMILAR_DIFFERENT', 'CONTRADICTION']

export function ComparisonTagFilter({ comparisons, basePath }: Props) {
  const [activeTag, setActiveTag] = useState<ComparisonTag | null>(
    comparisons.some((c) => c.tag === 'SHARED') ? 'SHARED' : null
  )

  const filtered = activeTag ? comparisons.filter((c) => c.tag === activeTag) : comparisons

  const counts = ALL_TAGS.reduce<Record<ComparisonTag, number>>(
    (acc, t) => { acc[t] = comparisons.filter((c) => c.tag === t).length; return acc },
    {} as Record<ComparisonTag, number>
  )

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTag(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeTag === null
              ? 'bg-stone-800 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          All ({comparisons.length})
        </button>
        {ALL_TAGS.filter((t) => counts[t] > 0).map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTag === tag
                ? COMPARISON_TAG_STYLE[tag]
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {COMPARISON_TAG_LABEL[tag]} ({counts[tag]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-stone-500">No comparisons for this filter.</p>
      ) : (
        <div className="space-y-10">
          {filtered.map((comp) => (
            <div key={comp.id} className="rounded-xl border border-stone-200 bg-white p-6">
              <ComparisonBlock comparison={comp} />
              <div className="mt-4">
                <Link
                  href={`${basePath}/${comp.id}`}
                  className="text-xs text-stone-400 hover:text-stone-600"
                >
                  Full comparison →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
