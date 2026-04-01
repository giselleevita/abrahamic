'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Claim, Source, Comparison } from '@prisma/client'
import { COMPARISON_TAG_LABEL, TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'

type ClaimOption = Claim & { source: Source }
type ComparisonWithClaims = Comparison & { isControversial: boolean; claims: { claimId: number; position: number }[] }

interface Props {
  claims: ClaimOption[]
  initialData?: ComparisonWithClaims
}

const TAGS = ['SHARED', 'SIMILAR_DIFFERENT', 'CONTRADICTION'] as const

export function ComparisonForm({ claims, initialData }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [tag, setTag] = useState<typeof TAGS[number]>(initialData?.tag ?? 'SHARED')
  const [summary, setSummary] = useState(initialData?.summary ?? '')
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [isControversial, setIsControversial] = useState(initialData?.isControversial ?? false)
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false)
  const [aiSummaryDraft, setAiSummaryDraft] = useState(false)
  const [selectedClaimIds, setSelectedClaimIds] = useState<number[]>(
    initialData?.claims.sort((a, b) => a.position - b.position).map((c) => c.claimId) ?? []
  )
  const [claimSearch, setClaimSearch] = useState('')

  const filteredClaims = claimSearch
    ? claims.filter((c) => c.statement.toLowerCase().includes(claimSearch.toLowerCase())).slice(0, 10)
    : claims.slice(0, 10)

  function addClaim(id: number) {
    if (!selectedClaimIds.includes(id)) setSelectedClaimIds([...selectedClaimIds, id])
  }
  function removeClaim(id: number) {
    setSelectedClaimIds(selectedClaimIds.filter((x) => x !== id))
  }

  function autoSlug() {
    if (!slug) setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  async function handleAiSummary() {
    if (!initialData) return
    setAiSummaryLoading(true)
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comparisonId: initialData.id }),
      })
      if (!res.ok) throw new Error('Request failed')
      const { summary: draft } = await res.json()
      setSummary(draft)
      setAiSummaryDraft(true)
    } catch {
      // silently fail — editor can write manually
    } finally {
      setAiSummaryLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedClaimIds.length < 2) {
      setError('At least 2 claims are required for a comparison.')
      return
    }
    setLoading(true)
    setError('')

    const payload = { title, slug, tag, summary, isPublished, isControversial, claimIds: selectedClaimIds }
    const url = initialData ? `/api/comparisons/${initialData.id}` : '/api/comparisons'
    const method = initialData ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error?.message ?? JSON.stringify(data.error) ?? 'Error saving.')
      return
    }

    router.push('/admin/comparisons')
    router.refresh()
  }

  async function handleDelete() {
    if (!initialData) return
    if (!confirm('Delete this comparison?')) return
    await fetch(`/api/comparisons/${initialData.id}`, { method: 'DELETE' })
    router.push('/admin/comparisons')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-700">Title *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={autoSlug}
          required
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          placeholder="Abraham's Covenant with God"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Slug *</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-mono focus:border-stone-500 focus:outline-none"
          placeholder="abrahams-covenant"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700">Tag * (editorial judgment)</label>
        <div className="mt-2 flex gap-3">
          {TAGS.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="radio" name="tag" value={t} checked={tag === t} onChange={() => setTag(t)} />
              {COMPARISON_TAG_LABEL[t]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-stone-700">Summary</label>
          {initialData && (
            <button
              type="button"
              onClick={handleAiSummary}
              disabled={aiSummaryLoading}
              className="rounded border border-stone-300 px-2 py-0.5 text-xs text-stone-500 hover:bg-stone-50 disabled:opacity-40 transition-colors"
            >
              {aiSummaryLoading ? 'Generating…' : '✦ Generate AI draft'}
            </button>
          )}
        </div>
        {aiSummaryDraft && (
          <p className="mb-2 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
            ⚠ AI-generated draft — edit before saving.
          </p>
        )}
        <textarea
          value={summary}
          onChange={(e) => { setSummary(e.target.value); setAiSummaryDraft(false) }}
          rows={5}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          placeholder="Explain what the traditions share, differ on, or contradict…"
        />
      </div>

      {/* Claims */}
      <div>
        <label className="block text-sm font-medium text-stone-700">
          Claims * (at least 2, ordered by position)
        </label>

        {/* Selected claims (ordered) */}
        {selectedClaimIds.length > 0 && (
          <div className="mt-2 space-y-1">
            {selectedClaimIds.map((id, i) => {
              const claim = claims.find((c) => c.id === id)
              if (!claim) return null
              return (
                <div key={id} className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white p-3">
                  <span className="w-5 text-center text-xs text-stone-400">{i + 1}</span>
                  <Badge className={TRADITION_BG[claim.source.tradition]}>{claim.source.title}</Badge>
                  <p className="flex-1 text-xs text-stone-700 line-clamp-1">{claim.statement}</p>
                  <button type="button" onClick={() => removeClaim(id)} className="text-stone-300 hover:text-red-500">×</button>
                </div>
              )
            })}
          </div>
        )}

        {/* Add claims */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search claims to add…"
            value={claimSearch}
            onChange={(e) => setClaimSearch(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
          <div className="mt-1 max-h-48 overflow-y-auto rounded-md border border-stone-200 bg-white">
            {filteredClaims.map((claim) => (
              <button
                key={claim.id}
                type="button"
                onClick={() => addClaim(claim.id)}
                disabled={selectedClaimIds.includes(claim.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-stone-50 disabled:opacity-40"
              >
                <Badge className={TRADITION_BG[claim.source.tradition]}>{claim.source.title}</Badge>
                <span className="line-clamp-1 text-stone-700">{claim.statement}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={isControversial} onChange={(e) => setIsControversial(e.target.checked)} className="rounded border-stone-300" />
        <span className="text-sm font-medium text-stone-700">Mark as controversial</span>
        <span className="text-xs text-stone-400">(shows a warning banner to readers)</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded border-stone-300" />
        <span className="text-sm font-medium text-stone-700">Publish this comparison</span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving…' : initialData ? 'Update Comparison' : 'Create Comparison'}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
