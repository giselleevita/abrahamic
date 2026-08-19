'use client'

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

interface Tab {
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultIndex?: number
  /** Accessible name for the tablist, e.g. "Concept views". */
  label?: string
}

/**
 * Tabs following the WAI-ARIA tabs pattern: roving tabindex, arrow-key
 * navigation, Home/End, and the tabpanel wired to its tab by id.
 *
 * Only the active tab is in the tab order; arrow keys move between tabs. That
 * is what the pattern specifies, and it keeps a long tablist from trapping
 * keyboard users in a sequence of stops.
 */
export function Tabs({ tabs, defaultIndex = 0, label = 'Tabs' }: TabsProps) {
  const [active, setActive] = useState(defaultIndex)
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const focusTab = (index: number) => {
    setActive(index)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = tabs.length - 1
    switch (event.key) {
      case 'ArrowRight':
        focusTab(active === last ? 0 : active + 1)
        break
      case 'ArrowLeft':
        focusTab(active === 0 ? last : active - 1)
        break
      case 'Home':
        focusTab(0)
        break
      case 'End':
        focusTab(last)
        break
      default:
        return
    }
    event.preventDefault()
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="mb-6 flex gap-1 rounded-xl bg-stone-100 p-1"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            id={`${baseId}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`${baseId}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 ${
              active === i
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          id={`${baseId}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${i}`}
          tabIndex={0}
          hidden={active !== i}
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
        >
          {active === i && tab.content}
        </div>
      ))}
    </div>
  )
}
