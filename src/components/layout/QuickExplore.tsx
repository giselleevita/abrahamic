'use client'

import { useEffect, useId, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Bookmark, BookOpen, Compass, Search, X } from 'lucide-react'

export function QuickExplore() {
  const ref = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const titleId = useId()
  const inputId = useId()
  function open() {
    ref.current?.showModal()
    input.current?.focus()
  }
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (ref.current?.open) ref.current.close()
        else { ref.current?.showModal(); input.current?.focus() }
      }
    }
    const dialog = ref.current
    window.addEventListener('keydown', shortcut)
    dialog?.setAttribute('data-ready', 'true')
    return () => { window.removeEventListener('keydown', shortcut); dialog?.removeAttribute('data-ready') }
  }, [])
  return <>
    <button type="button" className="quick-explore-trigger" onClick={open} aria-haspopup="dialog" aria-keyshortcuts="Meta+K Control+K"><Search size={17} aria-hidden /><span>Search &amp; explore</span><kbd>⌘ K</kbd></button>
    <dialog ref={ref} aria-labelledby={titleId} className="quick-explore-dialog" onClick={(event) => { if (event.target === event.currentTarget) ref.current?.close() }}>
      <div className="quick-explore-inner"><div className="flex items-center justify-between gap-4"><p className="editorial-eyebrow" id={titleId}>Where will curiosity take you?</p><button type="button" className="reading-action" aria-label="Close search" onClick={() => ref.current?.close()}><X size={18} /></button></div>
        <form role="search" className="quick-explore-form" onSubmit={(event) => { event.preventDefault(); const query = input.current?.value.trim() ?? ''; if (query.length < 2) return; ref.current?.close(); router.push(`/search?q=${encodeURIComponent(query)}`) }}>
          <label htmlFor={inputId} className="sr-only">Search people, beliefs, or verses</label><Search size={22} aria-hidden /><input ref={input} id={inputId} name="q" type="search" minLength={2} required placeholder="A person, a belief, a question…" /><button type="submit" className="editorial-button" aria-label="Submit search"><ArrowUpRight size={20} /></button>
        </form>
        <p className="workbench-caption mt-6">Or choose a place to begin</p>
        <div className="quick-explore-links">{[
          { href: '/learn', label: 'Guided journeys', detail: 'Follow a sourced path', Icon: Compass },
          { href: '/comparisons', label: 'Compare perspectives', detail: 'Hear each tradition in its own voice', Icon: BookOpen },
          { href: '/saved', label: 'Your saved collection', detail: 'Pick up where curiosity left off', Icon: Bookmark },
        ].map(({ href, label, detail, Icon }) => <Link key={href} href={href} onClick={() => ref.current?.close()}><Icon size={20} aria-hidden /><span><strong>{label}</strong><small>{detail}</small></span><ArrowUpRight size={16} aria-hidden /></Link>)}</div>
        <p className="mt-5 text-xs text-primary-700">Press Esc to close · ⌘ K or Ctrl K to open</p>
      </div>
    </dialog>
  </>
}
