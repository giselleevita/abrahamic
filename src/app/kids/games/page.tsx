import Link from 'next/link'

export const metadata = { title: 'Games · Abrahamic for Kids' }

const GAMES = [
  {
    slug: 'name-match',
    title: 'Same Person, Many Names',
    blurb: 'Moses, Moshe, Musa — one person, three names. Can you match them up?',
  },
  {
    slug: 'who-tells-it',
    title: 'Who Tells This Story?',
    blurb: 'Some stories are in all three books. Some are only in one. Which is which?',
  },
  {
    slug: 'timeline-sorter',
    title: 'Put It In Order',
    blurb: 'Move these events into the order the timeline puts them in.',
  },
  {
    slug: 'family-chain',
    title: 'Who Came First?',
    blurb: 'Build a family chain from parent to child, oldest first.',
  },
]

export default function KidsGamesPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-primary-950 sm:text-4xl">Games</h1>
      <p className="mt-2 max-w-2xl text-lg text-primary-800">
        Four games about the people and stories in the Torah, the Bible, and the Quran. You
        can play all of them with just a keyboard.
      </p>

      <div className="stagger mt-6 grid gap-4 sm:grid-cols-2">
        {GAMES.map((game) => (
          <Link
            key={game.slug}
            href={`/kids/games/${game.slug}`}
            className="rounded-xl border-2 border-primary-200 bg-white p-6 transition-colors hover:border-gold-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            <h2 className="font-serif text-2xl font-bold text-primary-950">{game.title}</h2>
            <p className="mt-2 leading-relaxed text-primary-700">{game.blurb}</p>
            <p className="mt-3 font-semibold text-gold-700">Play →</p>
          </Link>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-primary-200 bg-white p-5 text-sm leading-relaxed text-primary-700">
        Your scores are kept only on this device. Nothing is sent anywhere, and you never
        need an account.
      </p>
    </div>
  )
}
