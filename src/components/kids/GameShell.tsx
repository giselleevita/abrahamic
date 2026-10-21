'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { useKidsProgress } from '@/lib/kids/progress'
import { KIDS_GAME_BY_SLUG } from '@/lib/kids/games'

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

function cheer(score: number): { headline: string; stars: number } {
  if (score >= 90) return { headline: 'Amazing! You are a story star!', stars: 3 }
  if (score >= 60) return { headline: 'Great job! Nearly perfect!', stars: 2 }
  return { headline: 'Good try! Every round teaches you something.', stars: 1 }
}

const CONFETTI = ['🎉', '⭐', '✨', '🎈', '⭐', '🎉', '✨', '🎈']

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
  const info = KIDS_GAME_BY_SLUG[gameId]

  return (
    <div>
      <Link
        href="/kids/games"
        className="mb-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        <span aria-hidden="true">←</span> All games
      </Link>

      <header className={`rounded-3xl border-4 bg-gradient-to-br p-5 sm:p-7 ${info?.banner ?? 'from-amber-100 to-amber-50 border-gold-500'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl font-bold text-primary-950 sm:text-4xl">
            <span aria-hidden="true" className="kids-bounce mr-2">{info?.emoji ?? '🎮'}</span>
            {title}
          </h1>
          {info && (
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-primary-900 shadow-sm">
              {info.ages}
            </span>
          )}
        </div>
        <p className="mt-3 rounded-2xl bg-white/80 p-4 text-lg leading-relaxed text-primary-900">
          <span aria-hidden="true">👉 </span>
          {howToPlay}
        </p>
      </header>

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
        <div
          role="progressbar"
          aria-label="Progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={correct}
          className="h-3 w-32 overflow-hidden rounded-full bg-primary-100 sm:w-48"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${total > 0 ? Math.min(100, (correct / total) * 100) : 0}%` }}
          />
        </div>
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
        <div className="relative mt-6 overflow-hidden rounded-2xl border-2 border-gold-500 bg-gradient-to-br from-amber-50 to-emerald-50 p-6 text-center">
          <div aria-hidden="true" className="kids-confetti pointer-events-none absolute inset-x-0 top-0 h-full">
            {CONFETTI.map((piece, i) => (
              <span key={i} className="text-2xl" style={{ left: `${6 + i * 12}%`, animationDelay: `${i * 0.12}s` }}>
                {piece}
              </span>
            ))}
          </div>
          <p aria-hidden="true" className="kids-pop text-4xl">
            {'⭐'.repeat(cheer(score).stars)}
            <span className="opacity-25">{'⭐'.repeat(3 - cheer(score).stars)}</span>
          </p>
          <p className="mt-2 font-serif text-2xl font-bold text-primary-950">{cheer(score).headline}</p>
          <p className="mt-1 font-semibold text-primary-900">All done — {score}%</p>
          <p className="text-primary-800">You got {correct} out of {total} right.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/kids/games"
              className="rounded-xl bg-gold-600 px-5 py-2 font-bold text-primary-950 hover:bg-gold-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700"
            >
              🎮 Try another game
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
