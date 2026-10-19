'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bookmark, Check } from 'lucide-react'
import { useDeviceStore } from '@/lib/experience/storage'
import { SAVED_KEY, EMPTY_SAVED, parseSaved, type SavedItem } from '@/lib/experience/saved'

export function SaveButton({ item }: { item: SavedItem }) {
  const { value, save } = useDeviceStore(SAVED_KEY, EMPTY_SAVED, parseSaved)
  const [message, setMessage] = useState('')
  const saved = value.items.some((v) => v.id === item.id)
  function toggle() {
    if (!saved && value.items.length >= 500) { setMessage('Your saved list is full. Remove an item first.'); return }
    const ok = save({ version: 1, items: saved ? value.items.filter((v) => v.id !== item.id) : [...value.items, item] })
    setMessage(ok ? saved ? 'Removed from Saved.' : 'Saved on this device.' : 'Could not save. Device storage is unavailable.')
  }
  return <span className="inline-flex flex-wrap items-center gap-2"><button type="button" className="reading-action" aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${item.label}`} onClick={toggle}>{saved ? <Check size={15} aria-hidden /> : <Bookmark size={15} aria-hidden />}{saved ? 'Saved' : 'Save'}</button><span role="status" className="text-xs text-primary-700">{message}</span></span>
}

export function SavedList() {
  const { value, save } = useDeviceStore(SAVED_KEY, EMPTY_SAVED, parseSaved)
  const [message, setMessage] = useState('')
  function remove(id?: string) {
    setMessage(save({ version: 1, items: id ? value.items.filter((i) => i.id !== id) : [] }) ? 'Saved list updated.' : 'Could not update. Device storage is unavailable.')
  }
  return <div><p className="mb-6 text-primary-700">Saved passages and comparisons stay on this device. No account is needed.</p>{value.items.length ? <><button className="reading-action mb-5" onClick={() => remove()}>Clear saved list</button><ul aria-label="Saved items" className="space-y-3">{value.items.map((item) => <li key={item.id} className="editorial-card flex flex-wrap items-center justify-between gap-3 p-5"><div className="min-w-0"><p className="editorial-eyebrow">{item.kind === 'verse' ? 'Passage' : 'Comparison'}</p><Link href={item.href} className="editorial-link break-words">{item.label}</Link></div><button className="reading-action" onClick={() => remove(item.id)} aria-label={`Remove ${item.label}`}>Remove</button></li>)}</ul></> : <div className="editorial-card p-7"><h2 className="text-2xl">Your collection starts here</h2><p className="mt-3 text-primary-700">Use Save beside a passage or comparison to find it here later.</p><Link className="editorial-button mt-5" href="/comparisons">Explore comparisons</Link></div>}<p role="status" className="mt-4 text-sm">{message}</p></div>
}
