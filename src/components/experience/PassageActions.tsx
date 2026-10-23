'use client'
import { useState } from 'react'
import { SaveButton } from './SavedItems'
import { formatVerseRef, verseReaderHref, type VerseRef } from '@/lib/verse-links'
export function PassageActions({ sourceSlug, sourceTitle, verse, id }: { sourceSlug: string; sourceTitle: string; verse: VerseRef; id: number }) {
  const [message, setMessage] = useState('')
  const href = verseReaderHref(sourceSlug, verse)
  const label = `${sourceTitle} · ${formatVerseRef(verse)}`
  async function action(share: boolean) {
    const url = new URL(href, window.location.origin).href
    try {
      if (share && navigator.share) {
        try {
          await navigator.share({ title: label, url })
          setMessage('Passage shared.')
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') return
          await navigator.clipboard.writeText(url)
          setMessage('Passage link copied.')
        }
      } else {
        await navigator.clipboard.writeText(share ? url : `${label} — ${url}`)
        setMessage(share ? 'Passage link copied.' : 'Reference copied.')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      setMessage('Could not copy or share. You can copy this passage link from the address bar.')
    }
  }
  return <div className="mt-3 flex flex-wrap items-center gap-2"><SaveButton item={{ id: `verse:${id}`, kind: 'verse', href, label }} /><button type="button" className="reading-action" onClick={() => action(false)}>Copy reference<span className="sr-only"> {formatVerseRef(verse)}</span></button><button type="button" className="reading-action" onClick={() => action(true)}>Share<span className="sr-only"> {formatVerseRef(verse)}</span></button><p className="w-full text-xs text-primary-700" role="status">{message}</p></div>
}
