'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches
}

/**
 * Tracks the OS "reduce motion" setting, and keeps tracking it — a user who
 * flips the setting mid-session sees the change without a reload.
 *
 * The server snapshot is `false` so markup matches the no-preference case and
 * hydration stays stable; the real value applies on the client's first commit.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
