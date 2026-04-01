'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Source, Figure, Theme, Claim, InterpretationScope } from '@prisma/client'

type VerseOption = {
  id: number
  book: string
  chapter: number
  verse: number
  referenceKey: string
  source: { title: string }
}

type ClaimWithRelations = Claim & {
  verses: { verseId: number; isPrimary: boolean; verse: VerseOption }[]
  figures: { figureId: number }[]
  themes: { themeId: number }[]
}

interface Props {
  sources: Source[]
  figures: Figure[]
  themes: Theme[]
  verses: VerseOption[]
  initialData?: ClaimWithRelations
}

const SCOPE_LABELS: Record<InterpretationScope, string> = {
  LITERAL: 'Literal reading',
  MAJORITY_SCHOLARLY: 'Majority scholarly view',
  SPECIFIC_TRADITION: 'Specific tradition',
}

export function ClaimForm({ sources, figures, themes, verses, initialData }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [sourceId, setSourceId] = useState(initialData?.sourceId ?? sources[0]?.id ?? 0)
  const [statement, setStatement] = useState(initialData?.statement ?? '')
  const [notes, setNotes] = useState(initialData?.notes ?? '')
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [interpretationScope, setInterpretationScope] = useState<InterpretationScope | ''>(
    initialData?.interpretationScope ?? ''
  )
  const [specificTradition, setSpecificTradition] = useState(initialData?.specificTradition ?? '')
  const [selectedVerseIds, setSelectedVerseIds] = useState<number[]>(
    initialData?.verses.map((v) => v.verseId) ?? []
  )
  const [selectedFigureIds, setSelectedFigureIds] = useState<number[]>(
    initialData?.figures.map((f) => f.figureId) ?? []
  )
  const [selectedThemeIds, setSelectedThemeIds] = useState<number[]>(
    initialData?.themes.map((t) => t.themeId) ?? []
  )
  const [verseSearch, setVerseSearch] = useState('')
  const [aiThemeLoading, setAiThemeLoading] = useState(false)
  const [aiThemeMessage, setAiThemeMessage] = useState('')

  const filteredVerses = verseSearch
    ? verses
        .filter(
          (v) =>
            v.referenceKey.toLowerCase().includes(verseSearch.toLowerCase()) ||
            v.book.toLowerCase().includes(verseSearch.toLowerCase())
        )
        .slice(0, 20)
    : []

  function toggleId(list: number[], setList: (v: number[]) => void, id: number) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  }

  async function handleAiThemeSuggest() {
    if (statement.trim().length < 10) return
    setAiThemeLoading(true)
    setAiThemeMessage('')
    try {
      const res = await fetch('/api/ai/theme-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement }),
      })
      if (!res.ok) throw new Error('Request failed')
      const { suggestedThemeIds } = await res.json()
      if (suggestedThemeIds.length === 0) {
        setAiThemeMessage('No suggestions — confirm themes manually.')
      } else {
        const names = suggestedThemeIds.map((id: number) => themes.find((t) => t.id === id)?.name).filter(Boolean)
        setSelectedThemeIds(suggestedThemeIds)
        setAiThemeMessage(`AI suggested: ${names.join(', ')} — confirm before saving.`)
      }
    } catch {
      setAiThemeMessage('AI suggestion failed — confirm themes manually.')
    } finally {
      setAiThemeLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedVerseIds.length === 0) { setError('At least one verse is required.'); return }
    if (interpretationScope === 'SPECIFIC_TRADITION' && !specificTradition.trim()) {
      setError('Please name the specific tradition.'); return
    }
    setLoading(true)
    setError('')

    const payload = {
      sourceId,
      statement,
      notes: notes || undefined,
      isPublished,
      interpretationScope: interpretationScope || undefined,
      specificTradition: interpretationScope === 'SPECIFIC_TRADITION' ? specificTradition : undefined,
      verseIds: selectedVerseIds,
      figureIds: selectedFigureIds,
      themeIds: selectedThemeIds,
    }
    const url = initialData ? `/api/claims/${initialData.id}` : '/api/claims'
    const method = initialData ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error?.message ?? JSON.stringify(data.error) ?? 'Error saving claim.')
      return
    }
    router.push('/admin/claims')
    router.refresh()
  }

  async function handleDelete() {
    if (!initialData || !confirm('Delete this claim? This cannot be undone.')) return
    await fetch(`/api/claims/${initialData.id}`, { method: 'DELETE' })
    router.push('/admin/claims')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source */}
      <div>
        <label className="block text-sm font-medium text-stone-700">Source *</label>
        <select
          value={sourceId}
          onChange={(e) => setSourceId(Number(e.target.value))}
          className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        >
          {sources.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>

      {/* Statement */}
      <div>
        <label className="block text-sm font-medium text-stone-700">Statement *</label>
        <p className="text-xs text-stone-400 mb-1">One predicate. No evaluative language. Describe what the text says.</p>
        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          required
          rows={4}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          placeholder="The text states that…"
        />
      </div>

      {/* Verse search + selection */}
      <div>
        <label className="block text-sm font-medium text-stone-700">Verses * (at least one required)</label>
        <input
          type="text"
          placeholder="Search by book or reference key…"
          value={verseSearch}
          onChange={(e) => setVerseSearch(e.target.value)}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
        />
        {filteredVerses.length > 0 && (
          <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-stone-200 bg-white">
            {filteredVerses.map((v) => (
              <label key={v.id} className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-stone-50 text-sm">
                <input
                  type="checkbox"
                  checked={selectedVerseIds.includes(v.id)}
                  onChange={() => toggleId(selectedVerseIds, setSelectedVerseIds, v.id)}
                  className="rounded border-stone-300"
                />
                <span className="text-stone-400 text-xs">{v.source.title}</span>
                <span>{v.book} {v.chapter}:{v.verse}</span>
              </label>
            ))}
          </div>
        )}
        {selectedVerseIds.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedVerseIds.map((id) => {
              const v = verses.find((x) => x.id === id)
              return v ? (
                <span key={id} className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs">
                  {v.book} {v.chapter}:{v.verse}
                  <button type="button" onClick={() => setSelectedVerseIds(selectedVerseIds.filter((x) => x !== id))} className="text-stone-400 hover:text-stone-600">×</button>
                </span>
              ) : null
            })}
          </div>
        )}
      </div>

      {/* Figures */}
      <div>
        <label className="block text-sm font-medium text-stone-700">Figures (optional)</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {figures.map((f) => (
            <label key={f.id} className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input type="checkbox" checked={selectedFigureIds.includes(f.id)} onChange={() => toggleId(selectedFigureIds, setSelectedFigureIds, f.id)} className="rounded border-stone-300" />
              {f.canonicalName}
            </label>
          ))}
        </div>
      </div>

      {/* Themes + AI suggestion */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-stone-700">Themes (optional)</label>
          <button
            type="button"
            onClick={handleAiThemeSuggest}
            disabled={aiThemeLoading || statement.trim().length < 10}
            className="rounded border border-stone-300 px-2 py-0.5 text-xs text-stone-500 hover:bg-stone-50 disabled:opacity-40 transition-colors"
          >
            {aiThemeLoading ? 'Suggesting…' : '✦ AI suggest'}
          </button>
        </div>
        {aiThemeMessage && (
          <p className="mb-2 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">{aiThemeMessage}</p>
        )}
        <div className="flex flex-wrap gap-3">
          {themes.map((t) => (
            <label key={t.id} className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input type="checkbox" checked={selectedThemeIds.includes(t.id)} onChange={() => toggleId(selectedThemeIds, setSelectedThemeIds, t.id)} className="rounded border-stone-300" />
              {t.name}
            </label>
          ))}
        </div>
      </div>

      {/* Interpretation scope */}
      <div>
        <label className="block text-sm font-medium text-stone-700">Interpretation scope (optional)</label>
        <p className="text-xs text-stone-400 mb-2">Clarifies the epistemic status of this claim for readers.</p>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-sm">
            <input type="radio" name="scope" value="" checked={interpretationScope === ''} onChange={() => setInterpretationScope('')} />
            Not specified
          </label>
          {(Object.keys(SCOPE_LABELS) as InterpretationScope[]).map((scope) => (
            <label key={scope} className="flex items-center gap-1.5 cursor-pointer text-sm">
              <input type="radio" name="scope" value={scope} checked={interpretationScope === scope} onChange={() => setInterpretationScope(scope)} />
              {SCOPE_LABELS[scope]}
            </label>
          ))}
        </div>
        {interpretationScope === 'SPECIFIC_TRADITION' && (
          <input
            type="text"
            value={specificTradition}
            onChange={(e) => setSpecificTradition(e.target.value)}
            placeholder="e.g. Sunni, Shia, Reform Judaism, Catholic…"
            className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-stone-700">Editorial notes (internal, not shown to users)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          placeholder="Internal notes…"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded border-stone-300" />
        <span className="text-sm font-medium text-stone-700">Publish this claim</span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 transition-colors">
          {loading ? 'Saving…' : initialData ? 'Update Claim' : 'Create Claim'}
        </button>
        {initialData && (
          <button type="button" onClick={handleDelete} className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
