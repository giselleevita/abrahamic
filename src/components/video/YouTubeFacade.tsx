'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { youtubeIdSchema } from '@/lib/schemas/video'
import { TRADITION_DOT, TRADITION_LABEL } from '@/lib/constants'
import type { Tradition } from '@/generated/prisma/client'

/**
 * A YouTube embed that loads nothing from Google until the viewer asks.
 *
 * The card is drawn entirely in CSS. Notably it does NOT use a thumbnail from
 * i.ytimg.com: that would be a Google request on page load, which is exactly
 * what a privacy facade exists to avoid. Only after an explicit click does the
 * iframe mount, and then to youtube-nocookie.com without autoplay.
 */
interface YouTubeFacadeProps {
  youtubeId: string
  title: string
  channelName: string
  editorNote: string
  perspectiveTradition?: Tradition | null
  durationSeconds?: number | null
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function YouTubeFacade({
  youtubeId,
  title,
  channelName,
  editorNote,
  perspectiveTradition,
  durationSeconds,
}: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)

  // Re-validate at render. The schema guards the write path, but a row could
  // predate that constraint, and this string goes straight into a URL.
  if (!youtubeIdSchema.safeParse(youtubeId).success) {
    return (
      <div className="rounded-xl border border-christian-300 bg-christian-50 p-4 text-sm text-christian-900">
        This video could not be displayed: its identifier is not valid.
      </div>
    )
  }

  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`

  return (
    <figure className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div className="relative aspect-video bg-gradient-to-br from-primary-900 to-primary-950">
        {playing ? (
          <iframe
            ref={frameRef}
            src={src}
            title={title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            // No `autoplay` in the allow list: playback stays user-initiated.
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setPlaying(true)
              // Move focus into the player so keyboard users land on it.
              window.setTimeout(() => frameRef.current?.focus(), 100)
            }}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center transition-colors hover:bg-primary-900/40 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-gold-500"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-600 text-primary-950 shadow-lg transition-transform group-hover:scale-105 motion-reduce:transform-none">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="font-serif text-lg font-semibold text-primary-50">
              Play “{title}”
            </span>
            <span className="text-xs text-primary-300">
              Playing this loads a video from YouTube (Google).
            </span>
          </button>
        )}
      </div>

      <figcaption className="space-y-2 p-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-semibold text-stone-900">{title}</p>
          <p className="text-xs text-stone-500">
            {channelName}
            {durationSeconds ? ` · ${formatDuration(durationSeconds)}` : ''}
          </p>
        </div>

        {perspectiveTradition && (
          <p className="flex items-center gap-2 text-xs text-stone-600">
            <span
              className={`h-2 w-2 rounded-full ${TRADITION_DOT[perspectiveTradition]}`}
              aria-hidden="true"
            />
            Presents a {TRADITION_LABEL[perspectiveTradition]} reading
          </p>
        )}

        <p className="text-sm leading-relaxed text-stone-700">
          <span className="font-semibold text-stone-900">Why this is here: </span>
          {editorNote}
        </p>

        {/* Stated on every video, not buried in a policy page. A lecture is an
            argument, and this platform does not endorse arguments. */}
        <p className="text-xs text-stone-500">
          Third-party video. Selected for context; inclusion is not endorsement.{' '}
          <Link href="/licensing" className="underline hover:text-stone-800">
            Content policy
          </Link>
        </p>
      </figcaption>
    </figure>
  )
}
