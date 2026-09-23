'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { extractYoutubeId } from '@/lib/schemas/video'
import { TRADITION_LABEL } from '@/lib/constants'
import type { Tradition } from '@/generated/prisma/client'

export interface AdminVideo {
  id: number
  youtubeId: string
  title: string
  channelName: string
  editorNote: string
  perspectiveTradition: Tradition | null
  isPublished: boolean
  isKidsSafe: boolean
  conceptNames: string[]
}

interface Option {
  id: number
  label: string
}

const TRADITIONS: Tradition[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC', 'SHARED']

export function VideoManager({
  videos,
  concepts,
}: {
  videos: AdminVideo[]
  concepts: Option[]
}) {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [channelName, setChannelName] = useState('')
  const [editorNote, setEditorNote] = useState('')
  const [tradition, setTradition] = useState<Tradition | ''>('')
  const [conceptIds, setConceptIds] = useState<number[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewId = extractYoutubeId(url)
  const noteTooShort = editorNote.trim().length > 0 && editorNote.trim().length < 20

  async function create() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          youtubeId: url,
          title,
          channelName,
          editorNote,
          ...(tradition ? { perspectiveTradition: tradition } : {}),
          ...(conceptIds.length ? { conceptIds } : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(
          typeof data.error === 'string'
            ? data.error
            : Object.values(data.error?.fieldErrors ?? {})
                .flat()
                .join('; ') || 'Could not add the video',
        )
        return
      }
      setUrl('')
      setTitle('')
      setChannelName('')
      setEditorNote('')
      setTradition('')
      setConceptIds([])
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  async function patch(id: number, body: Record<string, unknown>) {
    await fetch(`/api/videos/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    router.refresh()
  }

  async function remove(id: number) {
    await fetch(`/api/videos/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  // Surface single-perspective clusters to the editor. Not a block — a prompt
  // to notice when one tradition's reading is the only one represented.
  const perspectiveCounts = videos.reduce<Record<string, number>>((acc, v) => {
    if (v.perspectiveTradition) acc[v.perspectiveTradition] = (acc[v.perspectiveTradition] ?? 0) + 1
    return acc
  }, {})
  const lopsided =
    videos.length >= 3 && Object.keys(perspectiveCounts).length === 1
      ? Object.keys(perspectiveCounts)[0]
      : null

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-900">Add a video</h2>
        <p className="mt-1 text-sm text-stone-600">
          Paste a YouTube URL. Nothing appears on the site until you publish it, and the
          editor note is required — an outside voice on a neutrality-critical page should
          never be added silently.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold text-stone-600">YouTube URL or id</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-sm"
            />
            {url && (
              <span
                className={`mt-1 block text-xs ${previewId ? 'text-green-700' : 'text-christian-700'}`}
              >
                {previewId ? `Video id: ${previewId}` : 'Not a recognised YouTube link'}
              </span>
            )}
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-stone-600">Channel</span>
            <input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-sm"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-stone-600">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-sm"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-stone-600">
              Why is this video here? (required, 20+ characters)
            </span>
            <textarea
              value={editorNote}
              onChange={(e) => setEditorNote(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-sm"
            />
            {noteTooShort && (
              <span className="mt-1 block text-xs text-christian-700">
                Say something specific about why this belongs here.
              </span>
            )}
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-stone-600">
              Perspective (optional)
            </span>
            <select
              value={tradition}
              onChange={(e) => setTradition(e.target.value as Tradition | '')}
              className="mt-1 w-full rounded-lg border border-stone-300 p-2 text-sm"
            >
              <option value="">Not tradition-specific</option>
              {TRADITIONS.map((t) => (
                <option key={t} value={t}>
                  {TRADITION_LABEL[t]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-stone-600">Attach to concepts</span>
            <select
              multiple
              value={conceptIds.map(String)}
              onChange={(e) =>
                setConceptIds([...e.target.selectedOptions].map((o) => Number(o.value)))
              }
              className="mt-1 h-24 w-full rounded-lg border border-stone-300 p-2 text-sm"
            >
              {concepts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-christian-50 p-2 text-sm text-christian-800">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={busy || !previewId || !title || !channelName || editorNote.trim().length < 20}
          onClick={create}
          className="mt-4 rounded-lg bg-stone-900 px-5 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-40"
        >
          {busy ? 'Adding…' : 'Add video'}
        </button>
      </section>

      {lopsided && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Every video with a stated perspective currently represents the{' '}
          {TRADITION_LABEL[lopsided as Tradition]} reading. Consider whether the other
          traditions are fairly represented.
        </p>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-stone-900">
          Videos ({videos.length})
        </h2>
        {videos.length === 0 ? (
          <p className="rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-500">
            No videos yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {videos.map((video) => (
              <li
                key={video.id}
                className="rounded-xl border border-stone-200 bg-white p-4 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-900">{video.title}</p>
                    <p className="text-xs text-stone-500">
                      {video.channelName} · <code>{video.youtubeId}</code>
                      {video.conceptNames.length > 0 &&
                        ` · ${video.conceptNames.join(', ')}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => patch(video.id, { isPublished: !video.isPublished })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        video.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'border border-stone-300 text-stone-600'
                      }`}
                    >
                      {video.isPublished ? 'Published' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={() => patch(video.id, { isKidsSafe: !video.isKidsSafe })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        video.isKidsSafe
                          ? 'bg-jewish-100 text-jewish-800'
                          : 'border border-stone-300 text-stone-600'
                      }`}
                    >
                      {video.isKidsSafe ? 'Kids-safe' : 'Mark kids-safe'}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(video.id)}
                      className="rounded-lg border border-christian-300 px-3 py-1.5 text-xs font-semibold text-christian-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-stone-600">{video.editorNote}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
