'use client'

import { useState } from 'react'
import { GameShell } from '@/components/kids/GameShell'
import { ERA_LABEL } from '@/lib/constants'
import type { TimelineEra } from '@/generated/prisma/client'

/**
 * "Put It In Order" — arrange events from one era into the order the timeline
 * records.
 *
 * Ordering comes from TimelineEvent.position, so the game reflects the site's
 * existing editorial sequence rather than asserting a chronology of its own.
 *
 * The reorder mechanic is Alt+ArrowUp / Alt+ArrowDown on the focused item.
 * That is the accessible pattern: it works with a keyboard, with a screen
 * reader, and on a touch screen, none of which drag-and-drop does reliably.
 */
export interface SortableEvent {
  slug: string
  name: string
  position: number
}

const GAME_ID = 'timeline-sorter'

export function TimelineSorterGame({
  era,
  events,
}: {
  era: TimelineEra
  events: SortableEvent[]
}) {
  // Start deliberately out of order: reverse, which is never the answer for
  // more than one item and needs no randomness (Math.random would also break
  // server/client agreement).
  const [order, setOrder] = useState<SortableEvent[]>(() => [...events].reverse())
  const [checked, setChecked] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const correctOrder = [...events].sort((a, b) => a.position - b.position)
  const correctCount = order.filter((e, i) => e.slug === correctOrder[i]?.slug).length
  const allCorrect = correctCount === events.length
  const score = checked ? Math.round((correctCount / events.length) * 100) : null

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= order.length) return

    const next = [...order]
    ;[next[index], next[target]] = [next[target], next[index]]
    setOrder(next)
    setChecked(false)
    setAnnouncement(`${order[index].name} moved to position ${target + 1} of ${order.length}.`)

    // Keep focus on the item the child is dragging with the keyboard.
    window.requestAnimationFrame(() => {
      document.getElementById(`sort-${next[target].slug}`)?.focus()
    })
  }

  function check() {
    setChecked(true)
    setAnnouncement(
      allCorrect
        ? 'That is the order the timeline uses. Well done.'
        : `${correctCount} of ${events.length} are in the right place. Keep going.`,
    )
  }

  function restart() {
    setOrder([...events].reverse())
    setChecked(false)
    setAnnouncement('New game started.')
  }

  return (
    <GameShell
      gameId={GAME_ID}
      title="Put It In Order"
      howToPlay={`These events are from the ${ERA_LABEL[era]} part of the timeline. Move them into the order the timeline puts them in, then press Check.`}
      keyboardHelp="Tab to an event, then hold Alt and press the Up or Down arrow to move it. Press Check when you think the order is right."
      score={score}
      total={events.length}
      correct={checked ? correctCount : 0}
      announcement={announcement}
      onRestart={restart}
    >
      <ol className="space-y-2">
        {order.map((event, i) => {
          const inPlace = checked && event.slug === correctOrder[i]?.slug
          const outOfPlace = checked && !inPlace

          return (
            <li key={event.slug}>
              <div
                id={`sort-${event.slug}`}
                tabIndex={0}
                role="button"
                aria-label={`${event.name}, position ${i + 1} of ${order.length}. Hold Alt and press arrow up or down to move.`}
                onKeyDown={(e) => {
                  if (!e.altKey) return
                  if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    move(i, -1)
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    move(i, 1)
                  }
                }}
                className={`flex items-center gap-4 rounded-xl border-2 px-4 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 ${
                  inPlace
                    ? 'border-green-400 bg-green-50'
                    : outOfPlace
                      ? 'border-gold-400 bg-gold-50'
                      : 'border-primary-300 bg-white'
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-200 font-bold text-primary-800">
                  {i + 1}
                </span>
                <span className="flex-1 text-lg font-semibold text-primary-900">
                  {event.name}
                </span>

                <span className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${event.name} up`}
                    className="rounded-lg border border-primary-300 px-3 py-1 text-lg font-bold text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
                  >
                    <span aria-hidden="true">↑</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === order.length - 1}
                    aria-label={`Move ${event.name} down`}
                    className="rounded-lg border border-primary-300 px-3 py-1 text-lg font-bold text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
                  >
                    <span aria-hidden="true">↓</span>
                  </button>
                </span>
              </div>
            </li>
          )
        })}
      </ol>

      <button
        type="button"
        onClick={check}
        className="mt-5 rounded-lg bg-gold-600 px-6 py-3 text-lg font-bold text-primary-950 transition-colors hover:bg-gold-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700"
      >
        Check my order
      </button>
    </GameShell>
  )
}
