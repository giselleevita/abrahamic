'use client'

import { useDeviceStore } from '@/lib/experience/storage'
import { ALBUM_KEY, EMPTY_ALBUM, badges, currentStreak, dayKey, parseAlbum } from '@/lib/album'
import { TRAIL_KEY, parseTrail, type TrailItem } from '@/lib/experience/trail'
import { NOTES_KEY, parseNotes, type Note } from '@/lib/experience/notebook'

const NO_TRAIL: TrailItem[] = []
const NO_NOTES: Note[] = []

export function AlbumView() {
  const album = useDeviceStore(ALBUM_KEY, EMPTY_ALBUM, parseAlbum)
  const trail = useDeviceStore(TRAIL_KEY, NO_TRAIL, parseTrail)
  const notes = useDeviceStore(NOTES_KEY, NO_NOTES, parseNotes)
  const today = dayKey(new Date())
  const streak = currentStreak(album.value.days, today)
  const list = badges(album.value, today, { figuresVisited: new Set(trail.value.filter((t) => t.kind === 'figure').map((t) => t.href)).size, notes: notes.value.length })
  const earned = list.filter((b) => b.earned).length

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['🔥', `${streak}`, streak === 1 ? 'day in a row' : 'days in a row'],
          ['📅', `${album.value.days.length}`, 'challenges finished'],
          ['🏅', `${earned} of ${list.length}`, 'badges earned'],
        ].map(([icon, big, small]) => (
          <div key={small} className="rounded-3xl border border-[#d7c5ad] bg-white p-5 text-center">
            <p aria-hidden="true" className="text-3xl">{icon}</p>
            <p className="mt-1 font-serif text-3xl font-bold text-slate-950">{big}</p>
            <p className="text-sm text-slate-700">{small}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-serif text-2xl text-slate-950">Badges</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {list.map((b) => (
          <li key={b.id} className={`flex items-center gap-4 rounded-2xl border-2 p-4 ${b.earned ? 'kids-pop border-[#b7791f] bg-[#fbf6ec]' : 'border-[#d7c5ad] bg-white opacity-70'}`}>
            <span aria-hidden="true" className={`text-4xl ${b.earned ? '' : 'grayscale'}`}>{b.icon}</span>
            <span>
              <span className="block font-bold text-slate-950">{b.title} {b.earned && <span className="sr-only">(earned)</span>}</span>
              <span className="block text-sm text-slate-700">{b.earned ? 'Earned!' : b.how}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-600">Kept only on this device. Nothing is sent anywhere.</p>
    </div>
  )
}
