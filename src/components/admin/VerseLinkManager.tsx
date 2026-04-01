'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { VerseLink, Verse, Source } from '@prisma/client'

type VerseLinkWithVerses = VerseLink & {
  verseA: Verse & { source: Source }
  verseB: Verse & { source: Source }
}
type VerseWithSource = Verse & { source: Source }

interface Props {
  verseLinks: VerseLinkWithVerses[]
  verses: VerseWithSource[]
}

const LINK_TYPES = ['PARALLEL', 'CONTRAST', 'ELABORATION', 'FULFILLMENT_CLAIM'] as const
const LINK_TYPE_LABEL: Record<string, string> = {
  PARALLEL: 'Parallel',
  CONTRAST: 'Contrast',
  ELABORATION: 'Elaboration',
  FULFILLMENT_CLAIM: 'Fulfillment claim',
}

function verseLabel(v: VerseWithSource) {
  return `${v.source.title} — ${v.book} ${v.chapter}:${v.verse}`
}

export function VerseLinkManager({ verseLinks, verses }: Props) {
  const router = useRouter()
  const [links, setLinks] = useState(verseLinks)
  const [showForm, setShowForm] = useState(false)
  const [verseAId, setVerseAId] = useState('')
  const [verseBId, setVerseBId] = useState('')
  const [linkType, setLinkType] = useState<typeof LINK_TYPES[number]>('PARALLEL')
  const [notes, setNotes] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [search, setSearch] = useState('')

  const filteredLinks = search
    ? links.filter((l) =>
        `${l.verseA.book} ${l.verseB.book} ${l.linkType}`.toLowerCase().includes(search.toLowerCase())
      )
    : links

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!verseAId || !verseBId) return
    setCreating(true)
    setCreateError('')

    const res = await fetch('/api/verse-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verseAId: parseInt(verseAId),
        verseBId: parseInt(verseBId),
        linkType,
        notes: notes || undefined,
      }),
    })

    setCreating(false)
    if (!res.ok) {
      const data = await res.json()
      setCreateError(JSON.stringify(data.error))
      return
    }

    setShowForm(false)
    setVerseAId('')
    setVerseBId('')
    setNotes('')
    router.refresh()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this verse link?')) return
    await fetch(`/api/verse-links/${id}`, { method: 'DELETE' })
    setLinks(links.filter((l) => l.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Create form */}
      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">Create manual link</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs rounded border border-stone-200 px-2 py-1 text-stone-500 hover:bg-stone-50"
          >
            {showForm ? 'Cancel' : '+ New link'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Verse A *</label>
                <select
                  value={verseAId}
                  onChange={(e) => setVerseAId(e.target.value)}
                  required
                  className="w-full rounded-md border border-stone-200 px-2 py-1.5 text-sm focus:outline-none"
                >
                  <option value="">Select verse…</option>
                  {verses.map((v) => (
                    <option key={v.id} value={v.id}>{verseLabel(v)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Verse B *</label>
                <select
                  value={verseBId}
                  onChange={(e) => setVerseBId(e.target.value)}
                  required
                  className="w-full rounded-md border border-stone-200 px-2 py-1.5 text-sm focus:outline-none"
                >
                  <option value="">Select verse…</option>
                  {verses.map((v) => (
                    <option key={v.id} value={v.id}>{verseLabel(v)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Link type *</label>
                <select
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value as typeof LINK_TYPES[number])}
                  className="w-full rounded-md border border-stone-200 px-2 py-1.5 text-sm focus:outline-none"
                >
                  {LINK_TYPES.map((t) => (
                    <option key={t} value={t}>{LINK_TYPE_LABEL[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">Notes</label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional editorial note"
                  className="w-full rounded-md border border-stone-200 px-2 py-1.5 text-sm focus:outline-none"
                />
              </div>
            </div>

            {createError && <p className="text-xs text-red-600">{createError}</p>}

            <button
              type="submit"
              disabled={creating}
              className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating…' : 'Create link'}
            </button>
          </form>
        )}
      </div>

      {/* Link list */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-stone-500">{links.length} approved links</p>
          <input
            type="text"
            placeholder="Filter by book or type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-stone-200 px-3 py-1.5 text-sm focus:border-stone-400 focus:outline-none w-56"
          />
        </div>

        {filteredLinks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 p-8 text-center text-sm text-stone-400">
            No approved verse links yet.
          </div>
        ) : (
          <div className="rounded-xl border border-stone-200 bg-white divide-y divide-stone-100">
            {filteredLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-stone-800">
                      {link.verseA.book} {link.verseA.chapter}:{link.verseA.verse}
                    </span>
                    <span className="text-xs text-stone-400">({link.verseA.source.title})</span>
                    <span className="text-stone-300">↔</span>
                    <span className="text-sm text-stone-800">
                      {link.verseB.book} {link.verseB.chapter}:{link.verseB.verse}
                    </span>
                    <span className="text-xs text-stone-400">({link.verseB.source.title})</span>
                  </div>
                  {link.notes && <p className="mt-0.5 text-xs text-stone-400 truncate">{link.notes}</p>}
                </div>
                <span className="flex-shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                  {LINK_TYPE_LABEL[link.linkType]}
                </span>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="flex-shrink-0 text-xs text-stone-300 hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
