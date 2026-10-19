'use client'
import { useEffect } from 'react'
/** Synchronize highlighting after streamed/client navigation as well as native hash changes. */
export function PassageFocus() {
  useEffect(() => {
    let active: HTMLElement | null = null
    const focusPassage = () => {
      active?.removeAttribute('data-active-passage')
      if (!/^#(?:v|h)-\d+$/.test(window.location.hash)) return
      active = document.getElementById(window.location.hash.slice(1))
      if (!active) return
      active.dataset.activePassage = 'true'
      active.tabIndex = -1
      active.scrollIntoView({ block: 'start', behavior: 'instant' })
      active.focus({ preventScroll: true })
    }
    const frame = requestAnimationFrame(focusPassage)
    window.addEventListener('hashchange', focusPassage)
    window.addEventListener('popstate', focusPassage)
    return () => {
      cancelAnimationFrame(frame)
      active?.removeAttribute('data-active-passage')
      window.removeEventListener('hashchange', focusPassage)
      window.removeEventListener('popstate', focusPassage)
    }
  }, [])
  return null
}
