'use client'

import { useState } from 'react'
import { GameShell } from '@/components/kids/GameShell'
import type { Tradition, TraditionPresence } from '@/generated/prisma/client'

/**
 * "Who Tells This Story?" — for a given event, say what each tradition's texts
 * do with it.
 *
 * Built from TimelineEventTradition.presence, so every answer is already an
 * editorial judgement recorded on the main site rather than something this
 * game decides.
 *
 * The wording matters more than the mechanic. AFFIRMED/MODIFIED/SILENT/
 * REJECTED are never presented as better or worse than one another — a book
 * that does not mention an event is not failing, and a book that tells it
 * differently is not wrong. The child is scored on reading the record
 * correctly, never on approving of it.
 */

/** Kid-facing wording, deliberately separate from the adult labels. */
const PRESENCE_CHOICES: { value: TraditionPresence; label: string }[] = [
  { value: 'AFFIRMED', label: 'Tells this story' },
  { value: 'MODIFIED', label: 'Tells it differently' },
  { value: 'SILENT', label: "Doesn't mention it" },
  { value: 'REJECTED', label: 'Says something different' },
]

const TRADITION_BOOK: Record<Tradition, string> = {
  JEWISH: 'The Torah / Hebrew Bible',
  CHRISTIAN: 'The New Testament',
  ISLAMIC: 'The Quran',
  SHARED: 'Shared texts',
}

export interface PresenceQuestion {
  eventSlug: string
  eventName: string
  summary: string | null
  tradition: Tradition
  answer: TraditionPresence
}

const GAME_ID = 'who-tells-it'

export function WhoTellsItGame({ questions }: { questions: PresenceQuestion[] }) {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<TraditionPresence | null>(null)
  const [correct, setCorrect] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  const current = questions[index]
  const finished = index >= questions.length - 1 && chosen !== null
  const score = finished ? Math.round((correct / questions.length) * 100) : null

  function choose(value: TraditionPresence) {
    if (chosen !== null) return
    setChosen(value)

    const rightLabel = PRESENCE_CHOICES.find((c) => c.value === current.answer)?.label ?? ''
    if (value === current.answer) {
      setCorrect((c) => c + 1)
      setAnnouncement(`Correct. ${TRADITION_BOOK[current.tradition]}: ${rightLabel.toLowerCase()}.`)
    } else {
      setAnnouncement(
        `Not quite. ${TRADITION_BOOK[current.tradition]}: ${rightLabel.toLowerCase()}.`,
      )
    }
  }

  function next() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1)
      setChosen(null)
      setAnnouncement('')
    }
  }

  function restart() {
    setIndex(0)
    setChosen(null)
    setCorrect(0)
    setAnnouncement('New game started.')
  }

  return (
    <GameShell
      gameId={GAME_ID}
      title="Who Tells This Story?"
      howToPlay="Not every holy book tells every story, and books that share a story sometimes tell it differently. Read the event, then say what this book does with it."
      keyboardHelp="Use Tab to move between the answer buttons and Enter or Space to choose one. Then Tab to the Next button."
      score={score}
      total={questions.length}
      correct={correct}
      announcement={announcement}
      onRestart={restart}
    >
      <div className="rounded-xl border-2 border-primary-300 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
          Question {index + 1} of {questions.length}
        </p>

        <h2 className="mt-2 font-serif text-2xl font-bold text-primary-950">
          {current.eventName}
        </h2>
        {current.summary && (
          <p className="mt-2 leading-relaxed text-primary-700">{current.summary}</p>
        )}

        <p className="mt-6 text-lg font-semibold text-primary-900">
          What does {TRADITION_BOOK[current.tradition]} do with this story?
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {PRESENCE_CHOICES.map((choice) => {
            const isAnswer = choice.value === current.answer
            const isChosen = choice.value === chosen
            const revealed = chosen !== null

            return (
              <button
                key={choice.value}
                type="button"
                disabled={revealed}
                onClick={() => choose(choice.value)}
                className={`rounded-xl border-2 px-4 py-3 text-left text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 ${
                  revealed && isAnswer
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : revealed && isChosen
                      ? 'border-christian-500 bg-christian-50 text-christian-900'
                      : revealed
                        ? 'border-primary-200 bg-white text-primary-500'
                        : 'border-primary-300 bg-white text-primary-900 hover:border-primary-500'
                }`}
              >
                {choice.label}
                {revealed && isAnswer && <span className="ml-2 text-green-700">✓</span>}
              </button>
            )
          })}
        </div>

        {chosen !== null && (
          <div className="mt-5 flex items-center gap-4">
            <p className="text-sm text-primary-700">
              Every book keeps its own record. None of these answers is better than another.
            </p>
            {index < questions.length - 1 && (
              <button
                type="button"
                onClick={next}
                className="ml-auto shrink-0 rounded-lg bg-gold-600 px-5 py-2 font-bold text-primary-950 transition-colors hover:bg-gold-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  )
}
