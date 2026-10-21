'use client'

import { useState } from 'react'
import { useDeviceStore } from '@/lib/experience/storage'
import { NOTES_KEY, READLIST_KEY, parseList, parseNotes, toggleListItem, upsertNote, type ListItem, type Note } from '@/lib/experience/notebook'

const NO_NOTES: Note[] = []
const NO_LIST: ListItem[] = []

/** A private note and a reading-list toggle for the page you are on. Stored on this device only. */
export function NoteButton({ href, label }: { href: string; label: string }) {
  const notes = useDeviceStore(NOTES_KEY, NO_NOTES, parseNotes)
  const list = useDeviceStore(READLIST_KEY, NO_LIST, parseList)
  const existing = notes.value.find((n) => n.href === href)
  const inList = list.value.some((l) => l.href === href)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [msg, setMsg] = useState('')

  function begin() { setDraft(existing?.text ?? ''); setOpen(true); setMsg('') }
  function saveNote() {
    const ok = notes.save(upsertNote(notes.value, { href, label, text: draft, at: Date.now() }))
    setMsg(ok ? (draft.trim() ? 'Note saved on this device.' : 'Note removed.') : 'Could not save. Device storage is unavailable.')
    if (ok) setOpen(false)
  }

  return (
    <section aria-labelledby="note-title" className="mt-10 rounded-3xl border border-[#d7c5ad] bg-white p-5 sm:p-6">
      <h2 id="note-title" className="font-serif text-xl text-slate-950">Keep this page</h2>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className="reading-action" onClick={open ? () => setOpen(false) : begin} aria-expanded={open}>📝 {existing ? 'Edit my note' : 'Add a private note'}</button>
        <button type="button" className="reading-action" aria-pressed={inList} onClick={() => setMsg(list.save(toggleListItem(list.value, { href, label })) ? (inList ? 'Removed from your reading list.' : 'Added to your reading list.') : 'Could not save.')}>
          {inList ? '✓ In my reading list' : '＋ Add to my reading list'}
        </button>
        <a href="/notebook" className="text-sm font-bold text-[#173b68] hover:underline">Open my notebook →</a>
      </div>
      {existing && !open && <p className="mt-3 whitespace-pre-line rounded-2xl bg-[#fbf6ec] p-4 text-slate-800">{existing.text}</p>}
      {open && (
        <div className="mt-3">
          <label htmlFor="note-text" className="sr-only">Your note about {label}</label>
          <textarea id="note-text" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={4000} rows={4} className="editorial-control w-full p-3" placeholder="What stood out? Questions to come back to?" />
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={saveNote} className="rounded-xl bg-[#173b68] px-5 py-2 font-bold text-white hover:bg-[#102d51]">Save note</button>
            <button type="button" onClick={() => setOpen(false)} className="reading-action">Cancel</button>
          </div>
        </div>
      )}
      <p role="status" className="mt-2 text-sm text-slate-700">{msg}</p>
      <p className="mt-1 text-xs text-slate-600">Notes stay on this device. Nothing is sent anywhere.</p>
    </section>
  )
}
