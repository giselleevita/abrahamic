'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const supported = () => typeof window !== 'undefined' && 'speechSynthesis' in window
/** Server and first client render say "unsupported" so hydration matches, then the real answer. */
function useSpeechSupport() {
  return useSyncExternalStore(subscribe, supported, () => false)
}

/**
 * Reads text aloud with the browser's built-in voice. Nothing is sent to a
 * server. Renders nothing where speech is unavailable.
 */
export function ListenButton({ text, label = 'Listen', className = '' }: { text: string; label?: string; className?: string }) {
  const ok = useSpeechSupport()
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => () => { if (supported()) window.speechSynthesis.cancel() }, [])
  if (!ok) return null

  function toggle() {
    const synth = window.speechSynthesis
    if (speaking) { synth.cancel(); setSpeaking(false); return }
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = document.documentElement.lang || 'en'
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    synth.speak(utterance)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d7c5ad] bg-white px-4 py-2 text-sm font-bold text-[#173b68] hover:border-[#b7791f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f] ${className}`}
    >
      <span aria-hidden="true">{speaking ? '⏹' : '🔊'}</span>
      {speaking ? 'Stop' : label}
    </button>
  )
}
