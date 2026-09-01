'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  EMPTY_PROGRESS,
  PROGRESS_EVENT,
  PROGRESS_STORAGE_KEY,
  clearProgress,
  readProgress,
  withAttemptRecorded,
  withChapterReset,
  withChapterVisited,
  writeProgress,
  type LearnProgress,
  type QuizAttempt,
} from './progress'

/**
 * `useSyncExternalStore` rather than useState+useEffect: `getServerSnapshot`
 * returns EMPTY_PROGRESS, so the server render and the first client render
 * agree by construction instead of by remembering to guard.
 *
 * IMPORTANT: getSnapshot must return a *stable* reference or React re-renders
 * forever. We cache the parsed object and only re-parse when the underlying
 * string actually changes.
 */
let cachedRaw: string | null = null
let cachedValue: LearnProgress = EMPTY_PROGRESS
let cachePrimed = false

function getSnapshot(): LearnProgress {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
  } catch {
    raw = null
  }
  if (!cachePrimed || raw !== cachedRaw) {
    cachedRaw = raw
    cachedValue = readProgress()
    cachePrimed = true
  }
  return cachedValue
}

function getServerSnapshot(): LearnProgress {
  return EMPTY_PROGRESS
}

function subscribe(onChange: () => void): () => void {
  // `storage` fires in other tabs; PROGRESS_EVENT covers this one.
  window.addEventListener('storage', onChange)
  window.addEventListener(PROGRESS_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(PROGRESS_EVENT, onChange)
  }
}

export function useLearnProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const markVisited = useCallback((slug: string) => {
    writeProgress(withChapterVisited(readProgress(), slug, new Date().toISOString()))
  }, [])

  const recordAttempt = useCallback((slug: string, attempt: QuizAttempt) => {
    writeProgress(withAttemptRecorded(readProgress(), slug, attempt))
  }, [])

  const resetChapter = useCallback((slug: string) => {
    writeProgress(withChapterReset(readProgress(), slug))
  }, [])

  const resetAll = useCallback(() => clearProgress(), [])

  return { progress, markVisited, recordAttempt, resetChapter, resetAll }
}

/**
 * True once the client store has been read. Progress-dependent UI renders a
 * neutral placeholder until then, so the markup matches the server output.
 */
export function useProgressHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
