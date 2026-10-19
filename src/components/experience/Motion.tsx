'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useDeviceStore } from '@/lib/experience/storage'
import { DEFAULT_EFFECTS, EFFECTS_KEY, parseEffects } from '@/lib/experience/preferences'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

function EffectsPreference() {
  const { value, save } = useDeviceStore(EFFECTS_KEY, DEFAULT_EFFECTS, parseEffects)
  const osReduced = usePrefersReducedMotion()
  const [sessionReduced, setSessionReduced] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    document.documentElement.dataset.reduceEffects = String(value.reduced || sessionReduced || osReduced)
    return () => { delete document.documentElement.dataset.reduceEffects }
  }, [value.reduced, sessionReduced, osReduced])
  return <div className="mx-auto max-w-7xl px-5 py-4 text-sm text-primary-700"><label className="inline-flex min-h-11 cursor-pointer items-center gap-3"><input type="checkbox" checked={value.reduced || sessionReduced} onChange={(e) => { const ok = save({ version: 1, reduced: e.target.checked }); setSessionReduced(ok ? false : e.target.checked); window.dispatchEvent(new CustomEvent('abrahamic:session-effects', { detail: e.target.checked })); setError(ok ? '' : 'Applies for this visit. Device storage is unavailable.') }} />Reduce effects</label>{osReduced && <span className="ml-3">System reduced motion is on.</span>}<p role="status">{error}</p></div>
}
export function MotionSettings() {
  const path = usePathname()
  return path.startsWith('/kids') ? null : <EffectsPreference />
}

/** Animate only artwork; text, focus targets and document scrolling remain native. */
export function StoryScene({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { value } = useDeviceStore(EFFECTS_KEY, DEFAULT_EFFECTS, parseEffects)
  const [sessionReduced, setSessionReduced] = useState(false)
  useEffect(() => {
    const listener = (event: Event) => setSessionReduced((event as CustomEvent<boolean>).detail)
    window.addEventListener('abrahamic:session-effects', listener)
    return () => window.removeEventListener('abrahamic:session-effects', listener)
  }, [])
  const reduced = usePrefersReducedMotion() || value.reduced || sessionReduced
  useEffect(() => {
    const el = ref.current
    if (!el || reduced || document.documentElement.dataset.reduceEffects === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    try { if (parseEffects(window.localStorage.getItem(EFFECTS_KEY) ?? '{}').reduced) return } catch { /* static preference unavailable */ }
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const shift = Math.max(-24, Math.min(24, ((window.innerHeight / 2 - rect.top - rect.height / 2) / window.innerHeight) * 48))
      el.style.setProperty('--scene-shift', `${shift}px`)
    }
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        el.animate?.([{ opacity: .75, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 400, easing: 'ease-out' })
        observer?.disconnect()
      }
    }) : null
    observer?.observe(el)
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', scroll)
    update()
    return () => {
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', scroll)
      cancelAnimationFrame(frame)
      observer?.disconnect()
      const animations = el.getAnimations?.() ?? []
      animations.forEach((animation) => animation.cancel())
      el.style.removeProperty('--scene-shift')
    }
  }, [reduced])
  return <div ref={ref} className={`story-scene ${className}`}>{children}</div>
}
