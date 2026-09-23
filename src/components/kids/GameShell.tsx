'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { useKidsProgress } from '@/lib/kids/progress'

/**
 * Shared chrome for every kids game: title, keyboard instructions, a live
 * region for screen-reader announcements, the score line, and restart.
 *
 * Games call `onFinish` when complete; the shell records the result to
 * device-local storage. Individual games stay focused on their own mechanic.
 */
interface GameShellProps {
  gameId: string
  title: string
  /** One or two plain sentences a child can follow. */
  howToPlay: string
  keyboardHelp: string
  /** Null while in progress; a 0-100 score when finished. */
  score: number | null
  total: number
  correct: number
  /** Most recent feedback, announced politely to assistive tech. */
  announcement: string
  onRestart: () => void
  children: ReactNode
}

export function GameShell({
  gameId,
  title,
  howToPlay,
  keyboardHelp,
  score,
  total,
  correct,
  announcement,
  onRestart,
  children,
}: GameShellProps) {
  const { progress, record } = useKidsProgress()
  // A ref, not state: whether the score has been written to localStorage does
  // not affect what is rendered, and setting state inside the effect would
  // trigger a second render pass on every completed game.
  const recordedRef = useRef(false)

  useEffect(() => {
    if (score !== null && !recordedRef.current) {
      recordedRef.current = true
      record(gameId, score)
    }
  }, [score, record, gameId])

  const best = progress.games[gameId]?.bestScore

  return (
    <div>
      <Link
        href="/kids/games"
        className="mb-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        <span aria-hidden="true">←</span> All games
      </Link>

      <h1 className="font-serif text-3xl font-bold text-primary-950 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-lg leading-relaxed text-primary-800">{howToPlay}</p>

      <details className="mt-4 rounded-xl border border-primary-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold text-primary-800">
          Playing with a keyboard
        </summary>
        <p className="mt-2 text-sm leading-relaxed text-primary-700">{keyboardHelp}</p>
      </details>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-primary-200 bg-white px-4 py-3">
        <p className="text-base font-semibold text-primary-900">
          {correct} of {total} right
        </p>
        {best !== undefined && (
          <p className="text-sm text-primary-600">Your best on this device: {best}%</p>
        )}
        <button
          type="button"
          onClick={() => {
            recordedRef.current = false
            onRestart()
          }}
          className="ml-auto rounded-lg bg-gold-600 px-4 py-2 text-sm font-bold text-primary-950 transition-colors hover:bg-gold-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700"
        >
          Start again
        </button>
      </div>

      {/* Announcements are the only feedback a screen-reader user gets from the
          colour and position changes in the games below. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className="mt-6">{children}</div>

      {score !== null && (
        <div className="mt-6 rounded-xl border-2 border-gold-500 bg-gold-50 p-6 text-center">
          <p className="font-serif text-2xl font-bold text-primary-950">
            All done — {score}%
          </p>
          <p className="mt-1 text-primary-800">You got {correct} out of {total} right.</p>
        </div>
      )}
    </div>
  )
}
