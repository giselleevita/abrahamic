'use client'

import { useState } from 'react'
import { GameShell } from '@/components/kids/GameShell'

/**
 * "Who Came First?" — rebuild a parent-to-child chain.
 *
 * Every link comes from a FigureRelation row of type PARENT, and the seed
 * attaches a source verse to each one. That means a correct placement can cite
 * the passage it rests on — the game is sourced by construction rather than
 * asserting a genealogy of its own.
 */
export interface ChainLink {
  figureId: number
  name: string
  /** Depth in the chain; 0 is the earliest generation. */
  generation: number
  /** e.g. "Genesis 21:2" — shown once the link is placed correctly. */
  reference: string | null
}

const GAME_ID = 'family-chain'

export function FamilyChainGame({ chain }: { chain: ChainLink[] }) {
  const ordered = [...chain].sort((a, b) => a.generation - b.generation)

  const [placed, setPlaced] = useState<(ChainLink | null)[]>(() => ordered.map(() => null))
  const [announcement, setAnnouncement] = useState('')
  const [attempts, setAttempts] = useState(0)

  // Stable presentation order that is not the answer: alphabetical.
  const pool = ordered
    .filter((link) => !placed.some((p) => p?.figureId === link.figureId))
    .sort((a, b) => a.name.localeCompare(b.name))

  const filled = placed.filter(Boolean).length
  const done = filled === ordered.length
  const score = done ? Math.round((ordered.length / Math.max(attempts, ordered.length)) * 100) : null

  function place(link: ChainLink) {
    const slot = placed.findIndex((p) => p === null)
    if (slot === -1) return

    setAttempts((a) => a + 1)

    if (ordered[slot].figureId === link.figureId) {
      const next = [...placed]
      next[slot] = link
      setPlaced(next)
      setAnnouncement(
        `Correct. ${link.name} goes in position ${slot + 1}` +
          (link.reference ? `, recorded in ${link.reference}.` : '.'),
      )
    } else {
      setAnnouncement(
        `Not that one. Position ${slot + 1} is someone else. Remember: earliest generation first.`,
      )
    }
  }

  function restart() {
    setPlaced(ordered.map(() => null))
    setAttempts(0)
    setAnnouncement('New game started.')
  }

  return (
    <GameShell
      gameId={GAME_ID}
      title="Who Came First?"
      howToPlay="These people are from one family, parent to child. Put them in order, starting with the earliest. Pick a name to place it in the next empty spot."
      keyboardHelp="Tab to a name and press Enter or Space to place it in the next empty spot in the chain."
      score={score}
      total={ordered.length}
      correct={filled}
      announcement={announcement}
      onRestart={restart}
    >
      <section aria-label="The family chain">
        <h2 className="mb-3 text-lg font-bold text-primary-900">The family, earliest first</h2>
        <ol className="space-y-2">
          {placed.map((link, i) => (
            <li key={i}>
              <div
                className={`flex items-center gap-4 rounded-xl border-2 px-4 py-3 ${
                  link ? 'border-green-400 bg-green-50' : 'border-dashed border-primary-300 bg-white'
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-200 font-bold text-primary-800">
                  {i + 1}
                </span>
                {link ? (
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-lg font-semibold text-primary-900">{link.name}</span>
                    {link.reference && (
                      <span className="font-mono text-xs text-primary-600">
                        recorded in {link.reference}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-primary-500">Empty — pick a name below</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {pool.length > 0 && (
        <section className="mt-6" aria-label="Names to place">
          <h2 className="mb-3 text-lg font-bold text-primary-900">Names to place</h2>
          <div className="flex flex-wrap gap-2">
            {pool.map((link) => (
              <button
                key={link.figureId}
                type="button"
                onClick={() => place(link)}
                className="rounded-xl border-2 border-primary-300 bg-white px-5 py-3 text-lg font-semibold text-primary-900 transition-colors hover:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                {link.name}
              </button>
            ))}
          </div>
        </section>
      )}
    </GameShell>
  )
}
