import Link from 'next/link'
import { StickerAlbum } from '@/components/kids/StickerAlbum'
import { KIDS_GAMES } from '@/lib/kids/games'

export const metadata = { title: 'Games · Abrahamic for Kids' }


export default function KidsGamesPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-primary-950 sm:text-4xl">Games</h1>
      <p className="mt-2 max-w-2xl text-lg text-primary-800">
        Four games about the people and stories in the Torah, the Bible, and the Quran. Pick a game that fits your age. The age on each card is only a suggestion, so try any you like! You can play all of them with just a keyboard.
      </p>

      <div className="stagger mt-6 grid gap-4 sm:grid-cols-2">
        {KIDS_GAMES.map((game) => (
          <Link
            key={game.slug}
            href={`/kids/games/${game.slug}`}
            className={`rounded-3xl border-4 ${game.card} p-6 sm:p-8 transition-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600`}
          >
            <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-4xl shadow-sm" aria-hidden="true">{game.emoji}</span>
            <h2 className="font-serif text-2xl font-bold text-primary-950">{game.title}</h2>
            <p className="mt-2 leading-relaxed text-primary-700">{game.blurb}</p>
            <p className="mt-4 flex items-center justify-between gap-3"><span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-primary-900">{game.ages}</span><span className="text-lg font-bold text-primary-950">Play! →</span></p>
          </Link>
        ))}
      </div>

      <StickerAlbum />

      <p className="mt-8 rounded-xl border border-primary-200 bg-white p-5 text-sm leading-relaxed text-primary-700">
        Your scores are kept only on this device. Nothing is sent anywhere, and you never
        need an account.
      </p>
    </div>
  )
}
