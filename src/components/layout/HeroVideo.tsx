'use client'

import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

/**
 * Decorative hero background video.
 *
 * The video previously autoplayed unconditionally, which ignores the OS
 * "reduce motion" setting — a real accessibility problem for a large, looping,
 * full-bleed animation. Under that setting it holds on its first frame
 * instead, preserving the visual composition without the movement.
 */
export function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return

    if (reduced) {
      video.pause()
      // Show a representative frame rather than a blank element.
      if (video.readyState >= 1) video.currentTime = 0
      return
    }

    // `play()` rejects when the browser blocks autoplay; the static frame is a
    // perfectly good fallback, so swallow it.
    void video.play().catch(() => {})
  }, [reduced])

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover opacity-40"
      autoPlay={!reduced}
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
