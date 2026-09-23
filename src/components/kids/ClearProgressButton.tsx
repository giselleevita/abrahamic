'use client'

import { useState } from 'react'
import { useKidsProgress } from '@/lib/kids/progress'

/**
 * Erases device-local game progress.
 *
 * This is the only data-deletion control the kids section needs, because
 * localStorage is the only place it stores anything. Showing it makes the
 * "nothing is saved about you" claim in the footer checkable rather than
 * merely stated.
 */
export function ClearProgressButton() {
  const { progress, clear } = useKidsProgress()
  const [cleared, setCleared] = useState(false)

  const played = Object.keys(progress.games).length
  if (played === 0 && !cleared) return null

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => {
          clear()
          setCleared(true)
        }}
        className="rounded-lg border border-primary-300 bg-white px-4 py-2 text-sm font-semibold text-primary-800 transition-colors hover:border-primary-500 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        Clear my progress
      </button>
      <span aria-live="polite" className="text-sm text-primary-600">
        {cleared
          ? 'Your scores have been erased from this device.'
          : `Scores are saved for ${played} game${played === 1 ? '' : 's'} on this device.`}
      </span>
    </div>
  )
}
