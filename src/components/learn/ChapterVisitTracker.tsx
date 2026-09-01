'use client'

import { useEffect } from 'react'
import { readProgress, withChapterVisited, writeProgress } from '@/lib/learn/progress'

/**
 * Records that a chapter was opened. Renders nothing.
 *
 * Writes directly rather than through the hook so this does not subscribe to
 * the store and re-render on every progress change.
 */
export function ChapterVisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    writeProgress(withChapterVisited(readProgress(), slug, new Date().toISOString()))
  }, [slug])

  return null
}
