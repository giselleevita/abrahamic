'use client'

import { useSyncExternalStore } from 'react'

const none = () => () => {}
const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window
const LANG: Record<string, string> = { JEWISH: 'he-IL', ISLAMIC: 'ar-SA', CHRISTIAN: 'en-US' }

/** Says a name aloud with the browser's built-in voice. Nothing leaves the device; hidden if speech is unavailable. */
export function PronounceButton({ name, tradition, className = '' }: { name: string; tradition?: string; className?: string }) {
  const ok = useSyncExternalStore(none, canSpeak, () => false)
  if (!ok) return null
  return (
    <button
      type="button"
      onClick={() => {
        const synth = window.speechSynthesis
        synth.cancel()
        const u = new SpeechSynthesisUtterance(name)
        u.lang = (tradition && LANG[tradition]) || 'en-US'
        u.rate = 0.8
        synth.speak(u)
      }}
      aria-label={`Hear how to say ${name}`}
      title="Hear it. Voices depend on your device, and some may not have this language."
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d7c5ad] bg-white text-sm hover:border-[#b7791f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f] ${className}`}
    >
      <span aria-hidden="true">🔊</span>
    </button>
  )
}
