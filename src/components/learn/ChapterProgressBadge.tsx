'use client'

import { chapterProgress } from '@/lib/learn/progress'
import { useLearnProgress, useProgressHydrated } from '@/lib/learn/use-progress'

/**
 * Progress lives in localStorage, which the server cannot see. Until the store
 * is read, render a fixed-size neutral placeholder so the first client render
 * matches the server output exactly.
 */
export function ChapterProgressBadge({ slug }: { slug: string }) {
  const hydrated = useProgressHydrated()
  const { progress } = useLearnProgress()

  if (!hydrated) {
    return <span className="inline-block h-5 w-16 rounded-full bg-slate-100" aria-hidden="true" />
  }

  const state = chapterProgress(progress, slug)

  if (state.completedAt) {
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
        Completed
      </span>
    )
  }
  if (state.attempts.length > 0) {
    const best = state.bestScore === null ? 0 : Math.round(state.bestScore * 100)
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
        Best {best}%
      </span>
    )
  }
  if (state.visitedAt) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
        Started
      </span>
    )
  }
  return null
}
