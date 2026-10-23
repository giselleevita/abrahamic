'use client'

import { useEffect } from 'react'
import { addToTrail, parseTrail, PREFERENCES_EVENT, TRAIL_KEY, type TrailItem } from '@/lib/experience/trail'

/** Remembers, on this device only, that a page was visited. Renders nothing. */
export function TrailRecorder({ item }: { item: TrailItem }) {
  const { href, label, kind } = item
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(TRAIL_KEY)
      const current = raw ? parseTrail(raw) : []
      window.localStorage.setItem(TRAIL_KEY, JSON.stringify(addToTrail(current, { href, label, kind })))
      window.dispatchEvent(new Event(PREFERENCES_EVENT))
    } catch {
      /* storage unavailable: the trail is a convenience, not a requirement */
    }
  }, [href, label, kind])
  return null
}
