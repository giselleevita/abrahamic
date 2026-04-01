'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Source, Verse, VerseTranslation } from '@prisma/client'

type VerseWithTranslations = Verse & { translations: VerseTranslation[] }

interface Props {
  sources: Source[]
  verses: VerseWithTranslations[]
  selectedVerse: VerseWithTranslations | null | undefined
  currentSourceKey: string
}

const LABELS = ['ORIGINAL', 'CLASSIC', 'MODERN', 'SCHOLARLY'] as const
type Label = typeof LABELS[number]

export function TranslationManager({ sources, verses, selectedVerse, currentSourceKey }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [showAdd, setShowAdd] = useState(false)
  const [newLabel, setNewLabel] = useState<Label>('MODERN')
  const [newName, setNewName] = useState('')
  const [newText, setNewText] = useState('')
  const [newDefault, setNewDefault] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')

  function navigate(params: Record<string, string>) {
    const sp = new URLSearchParams({ sourceKey: currentSourceKey, ...params })
    router.push(`/admin/translations?${sp}`)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedVerse) return
    setAdding(true)
    setAddError('')

    const res = await fetch('/api/translations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verseId: selectedVerse.id,
        label: newLabel,
        name: newName,
        text: newText,
        isDefault: newDefault,
      }),
    })

    setAdding(false)
    if (!res.ok) {
      const data = await res.json()
      setAddError(JSON.stringify(data.error))
      return
    }

    setShowAdd(false)
    setNewName('')
    setNewText('')
    setNewDefault(false)
    startTransition(() => router.refresh())
  }

  async function handleSetDefault(id: number) {
    await fetch(`/api/translations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDefault: true }),
    })
    startTransition(() => router.refresh())
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this translation?')) return
    await fetch(`/api/translations/${id}`, { method: 'DELETE' })
    startTransition(() => router.refresh())
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left: source + verse picker */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Source</label>
          <select
            value={currentSourceKey}
            onChange={(e) => navigate({ sourceKey: e.target.value })}
            className="w-full rounded-md border border-stone-200 px-2 py-1.5 text-sm focus:outline-none"
          >
            {sources.map((s) => (
              <option key={s.key} value={s.key}>{s.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">
            Verse ({verses.length})
          </label>
          <div className="max-h-96 overflow-y-auto rounded-md border border-stone-200 bg-white">
            {verses.map((v) => (
              <button
                key={v.id}
                onClick={() => navigate({ sourceKey: currentSourceKey, verseId: String(v.id) })}
                className={`w-full text-left px-3 py-2 text-sm border-b border-stone-50 last:border-0 transition-colors ${
                  selectedVerse?.id === v.id
                    ? 'bg-stone-100 font-medium text-stone-900'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {v.book} {v.chapter}:{v.verse}
                <span className="ml-1 text-xs text-stone-400">({v.translations.length})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: translation editor */}
      <div className="lg:col-span-2">
        {!selectedVerse ? (
          <p className="text-sm text-stone-400">Select a verse to manage translations.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-stone-900">
                {selectedVerse.book} {selectedVerse.chapter}:{selectedVerse.verse}
              </h2>
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="rounded border border-stone-200 px-2 py-1 text-xs text-stone-500 hover:bg-stone-50"
              >
                {showAdd ? 'Cancel' : '+ Add translation'}
              </button>
            </div>

            {/* Add form */}
            {showAdd && (
              <form onSubmit={handleAdd} className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Label *</label>
                    <select
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value as Label)}
                      className="w-full rounded border border-stone-200 px-2 py-1.5 text-sm focus:outline-none"
                    >
                      {LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Name / version *</label>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      placeholder="e.g. KJV, NIV, Sahih International"
                      className="w-full rounded border border-stone-200 px-2 py-1.5 text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Text *</label>
                  <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    required
                    rows={3}
                    className="w-full rounded border border-stone-200 px-2 py-1.5 text-sm focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDefault}
                    onChange={(e) => setNewDefault(e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  Set as default translation for this verse
                </label>
                {addError && <p className="text-xs text-red-600">{addError}</p>}
                <button
                  type="submit"
                  disabled={adding}
                  className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 transition-colors"
                >
                  {adding ? 'Adding…' : 'Add translation'}
                </button>
              </form>
            )}

            {/* Existing translations */}
            {selectedVerse.translations.length === 0 ? (
              <p className="text-sm text-stone-400">No translations yet for this verse.</p>
            ) : (
              <div className="space-y-3">
                {selectedVerse.translations.map((t) => (
                  <div key={t.id} className="rounded-xl border border-stone-200 bg-white p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                        {t.label}
                      </span>
                      <span className="text-sm font-medium text-stone-800">{t.name}</span>
                      {t.isDefault && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed italic">"{t.text}"</p>
                    <div className="mt-3 flex gap-3">
                      {!t.isDefault && (
                        <button
                          onClick={() => handleSetDefault(t.id)}
                          className="text-xs text-stone-500 hover:text-stone-700 border border-stone-200 rounded px-2 py-0.5"
                        >
                          Set as default
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-xs text-stone-300 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
