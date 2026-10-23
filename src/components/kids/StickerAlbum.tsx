'use client'

import { useKidsProgress } from '@/lib/kids/progress'
import { KIDS_GAMES } from '@/lib/kids/games'

/** One sticker per game finished; a gold star for a score of 90% or more. Kept on this device. */
export function StickerAlbum() {
  const { progress } = useKidsProgress()
  const have = KIDS_GAMES.filter((g) => progress.games[g.slug]).length
  return (
    <section aria-labelledby="sticker-title" className="mt-8 rounded-3xl border-4 border-amber-300 bg-amber-50 p-5 sm:p-6">
      <h2 id="sticker-title" className="font-serif text-2xl font-bold text-primary-950">⭐ My sticker album</h2>
      <p className="mt-1 text-primary-800">{have === 0 ? 'Finish a game to win your first sticker!' : `${have} of ${KIDS_GAMES.length} stickers. ${have === KIDS_GAMES.length ? 'You got them all!' : 'Keep going!'}`}</p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {KIDS_GAMES.map((g) => {
          const best = progress.games[g.slug]?.bestScore
          const got = best !== undefined
          return (
            <li key={g.slug} className={`flex flex-col items-center rounded-2xl border-2 p-4 text-center ${got ? 'kids-pop border-amber-400 bg-white' : 'border-dashed border-amber-300 bg-white/50'}`}>
              <span aria-hidden="true" className={`text-5xl ${got ? '' : 'opacity-25 grayscale'}`}>{g.emoji}</span>
              <span className="mt-2 text-sm font-bold text-primary-950">{g.short}</span>
              <span className="text-xs text-primary-700">{got ? (best >= 90 ? '🌟 Gold star!' : 'Sticker won') : 'Not yet'}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
