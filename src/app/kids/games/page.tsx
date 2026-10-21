import Link from 'next/link'

export const metadata = { title: 'Games · Abrahamic for Kids' }

const GAMES = [
  {
    slug: 'name-match',
    title: 'Same Person, Many Names',
    emoji: '🧩',
    tone: 'bg-sky-50 border-sky-300',
    blurb: 'Moses, Moshe, Musa — one person, three names. Can you match them up?',
  },
  {
    slug: 'who-tells-it',
    title: 'Who Tells This Story?',
    emoji: '🔍',
    tone: 'bg-rose-50 border-rose-300',
    blurb: 'Some stories are in all three books. Some are only in one. Which is which?',
  },
  {
    slug: 'timeline-sorter',
    title: 'Put It In Order',
    emoji: '⏳',
    tone: 'bg-emerald-50 border-emerald-300',
    blurb: 'Move these events into the order the timeline puts them in.',
  },
  {
    slug: 'family-chain',
    title: 'Who Came First?',
    emoji: '🌳',
    tone: 'bg-violet-50 border-violet-300',
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
            className={`rounded-2xl border-2 ${game.tone} p-6 sm:p-8 transition-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600`}
          >
            <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl" aria-hidden="true">{game.emoji}</span>
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
