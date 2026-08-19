'use client'

import { useMemo, useState } from 'react'
import { GameShell } from '@/components/kids/GameShell'
import { TRADITION_BG } from '@/lib/constants'
import type { Tradition } from '@/generated/prisma/client'

/**
 * "Same Person, Many Names" — match a figure to the name another tradition
 * uses for them.
 *
 * Built entirely from FigureAlias rows, so the game asserts nothing beyond a
 * naming fact: Moses is called Musa in the Quran. There is no theological
 * content to get wrong.
 *
 * Keyboard-first: both columns are listboxes with arrow-key navigation. Drag
 * is not the mechanic, so nothing depends on a pointer.
 */
export interface NamePair {
  figureId: number
  canonicalName: string
  aliasName: string
  aliasTradition: Tradition
}

const GAME_ID = 'name-match'

export function NameMatchGame({ pairs }: { pairs: NamePair[] }) {
  const [round, setRound] = useState(0)
  const [selectedFigure, setSelectedFigure] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [wrong, setWrong] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  // Reshuffle the right-hand column each round so position carries no hint.
  // `round` keys the shuffle so "Start again" produces a fresh order.
  const shuffledAliases = useMemo(() => {
    const copy = [...pairs]
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(((i + 1) * 9301 + round * 49297 + 233280) % (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }, [pairs, round])

  const done = matched.size === pairs.length
  const score = done ? Math.round((pairs.length / Math.max(attempts, pairs.length)) * 100) : null

  function attemptMatch(figureId: number, aliasFigureId: number, aliasName: string) {
    setAttempts((a) => a + 1)
    if (figureId === aliasFigureId) {
      const next = new Set(matched)
      next.add(figureId)
      setMatched(next)
      setSelectedFigure(null)
      setWrong(null)
      const name = pairs.find((p) => p.figureId === figureId)?.canonicalName
      setAnnouncement(`Correct. ${name} is also called ${aliasName}.`)
    } else {
      setWrong(aliasFigureId)
      setAnnouncement(`Not a match. Try another name.`)
      window.setTimeout(() => setWrong(null), 800)
    }
  }

  function restart() {
    setRound((r) => r + 1)
    setMatched(new Set())
    setSelectedFigure(null)
    setWrong(null)
    setAttempts(0)
    setAnnouncement('New game started.')
  }

  return (
    <GameShell
      gameId={GAME_ID}
      title="Same Person, Many Names"
      howToPlay="Some people appear in more than one holy book, with a different name in each. Pick a name on the left, then find the matching name on the right."
      keyboardHelp="Use Tab to reach a list, then the arrow keys to move between names and Enter or Space to choose. Pick one name on the left first, then one on the right."
      score={score}
      total={pairs.length}
      correct={matched.size}
      announcement={announcement}
      onRestart={restart}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-bold text-primary-900">Choose a person</h2>
          <ul className="space-y-2">
            {pairs.map((pair) => {
              const isMatched = matched.has(pair.figureId)
              const isSelected = selectedFigure === pair.figureId
              return (
                <li key={pair.figureId}>
                  <button
                    type="button"
                    disabled={isMatched}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedFigure(pair.figureId)}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-left text-lg font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 ${
                      isMatched
                        ? 'cursor-default border-green-300 bg-green-50 text-green-900'
                        : isSelected
                          ? 'border-gold-600 bg-gold-100 text-primary-950'
                          : 'border-primary-300 bg-white text-primary-900 hover:border-primary-500'
                    }`}
                  >
                    {pair.canonicalName}
                    {isMatched && <span className="ml-2 text-green-700">✓</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-primary-900">Find the other name</h2>
          <ul className="space-y-2">
            {shuffledAliases.map((pair) => {
              const isMatched = matched.has(pair.figureId)
              const isWrong = wrong === pair.figureId
              return (
                <li key={`${pair.figureId}-alias`}>
                  <button
                    type="button"
                    disabled={isMatched || selectedFigure === null}
                    onClick={() =>
                      selectedFigure !== null &&
                      attemptMatch(selectedFigure, pair.figureId, pair.aliasName)
                    }
                    className={`w-full rounded-xl border-2 px-4 py-3 text-left text-lg font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 ${
                      isMatched
                        ? 'cursor-default border-green-300 bg-green-50 text-green-900'
                        : isWrong
                          ? 'border-christian-500 bg-christian-50 text-christian-900'
                          : selectedFigure === null
                            ? 'cursor-not-allowed border-primary-200 bg-primary-100 text-primary-500'
                            : 'border-primary-300 bg-white text-primary-900 hover:border-primary-500'
                    }`}
                  >
                    <span>{pair.aliasName}</span>
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${TRADITION_BG[pair.aliasTradition]}`}
                    >
                      {pair.aliasTradition === 'JEWISH'
                        ? 'Torah'
                        : pair.aliasTradition === 'CHRISTIAN'
                          ? 'Bible'
                          : pair.aliasTradition === 'ISLAMIC'
                            ? 'Quran'
                            : 'Shared'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          {selectedFigure === null && !done && (
            <p className="mt-3 text-sm text-primary-600">Pick a person on the left first.</p>
          )}
        </section>
      </div>
    </GameShell>
  )
}
