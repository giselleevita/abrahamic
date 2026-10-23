'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useDeviceStore } from '@/lib/experience/storage'
import { NOTES_KEY, READLIST_KEY, encodeShare, notesToMarkdown, parseList, parseNotes, toggleListItem, upsertNote, type ListItem, type Note } from '@/lib/experience/notebook'

const NO_NOTES: Note[] = []
const NO_LIST: ListItem[] = []

export function NotebookView() {
  const notes = useDeviceStore(NOTES_KEY, NO_NOTES, parseNotes)
  const list = useDeviceStore(READLIST_KEY, NO_LIST, parseList)
  const [copied, setCopied] = useState('')

  function download() {
    const blob = new Blob([notesToMarkdown(notes.value, list.value)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'my-abrahamic-notes.md'; a.click()
    URL.revokeObjectURL(url)
  }
  async function share() {
    const url = `${window.location.origin}/collection?i=${encodeShare(list.value)}`
    try { await navigator.clipboard.writeText(url); setCopied('Link copied. It holds only the page titles, never your notes.') }
    catch { setCopied(url) }
  }

  const empty = notes.value.length === 0 && list.value.length === 0
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 print:hidden">
        <button type="button" className="reading-action" onClick={download} disabled={empty}>⬇ Download as Markdown</button>
        <button type="button" className="reading-action" onClick={() => window.print()} disabled={empty}>🖨 Print</button>
        <button type="button" className="reading-action" onClick={share} disabled={list.value.length === 0}>🔗 Share my reading list</button>
      </div>
      <p role="status" className="text-sm text-slate-700">{copied}</p>

      {empty && <p className="rounded-2xl border border-[#d7c5ad] bg-white p-6 text-slate-800">Nothing here yet. Open a person, idea or comparison and choose “Add a private note” or “Add to my reading list”.</p>}

      {list.value.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-slate-950">Reading list</h2>
          <ol className="mt-3 space-y-2">
            {list.value.map((l) => (
              <li key={l.href} className="flex items-center justify-between gap-3 rounded-2xl border border-[#d7c5ad] bg-white px-4 py-3">
                <Link href={l.href} className="font-semibold text-[#173b68] hover:underline">{l.label}</Link>
                <button type="button" className="text-sm font-semibold text-slate-600 underline print:hidden" onClick={() => list.save(toggleListItem(list.value, l))}>Remove</button>
              </li>
            ))}
          </ol>
        </section>
      )}

      {notes.value.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-slate-950">My notes</h2>
          <ul className="mt-3 space-y-3">
            {notes.value.map((n) => (
              <li key={n.href} className="rounded-2xl border border-[#d7c5ad] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <Link href={n.href} className="font-serif text-lg font-bold text-slate-950 hover:underline">{n.label}</Link>
                  <button type="button" className="text-sm font-semibold text-slate-600 underline print:hidden" onClick={() => notes.save(upsertNote(notes.value, { ...n, text: '' }))}>Delete</button>
                </div>
                <p className="mt-2 whitespace-pre-line text-slate-800">{n.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
