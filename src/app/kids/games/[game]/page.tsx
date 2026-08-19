import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getNamePairs,
  getPresenceQuestions,
  getSortableEra,
  getFamilyChain,
} from '@/lib/kids/game-data'
import { NameMatchGame } from '@/components/kids/games/NameMatchGame'
import { WhoTellsItGame } from '@/components/kids/games/WhoTellsItGame'
import { TimelineSorterGame } from '@/components/kids/games/TimelineSorterGame'
import { FamilyChainGame } from '@/components/kids/games/FamilyChainGame'

// Game boards are built from published content, so they cache like any other
// page. Randomisation is deliberately absent from the data layer — the shuffles
// are deterministic — so a cached board is a correct board.
export const revalidate = 3600

const GAMES = ['name-match', 'who-tells-it', 'timeline-sorter', 'family-chain'] as const
type GameSlug = (typeof GAMES)[number]

/**
 * Shown when the database has too little data for a game to be playable — an
 * empty or partially seeded install, for instance. Better than rendering a
 * puzzle with one item in it.
 */
function NotEnoughData() {
  return (
    <div className="rounded-xl border-2 border-primary-200 bg-white p-8 text-center">
      <h1 className="font-serif text-2xl font-bold text-primary-950">
        This game is not ready yet
      </h1>
      <p className="mt-2 text-primary-700">
        There is not enough information on the site to play it right now.
      </p>
      <Link
        href="/kids/games"
        className="mt-4 inline-block rounded-lg bg-gold-600 px-5 py-2 font-bold text-primary-950 hover:bg-gold-500"
      >
        Try another game
      </Link>
    </div>
  )
}

export default async function KidsGamePage({
  params,
}: {
  params: Promise<{ game: string }>
}) {
  const { game } = await params
  if (!GAMES.includes(game as GameSlug)) notFound()

  switch (game as GameSlug) {
    case 'name-match': {
      const pairs = await getNamePairs()
      return pairs.length >= 3 ? <NameMatchGame pairs={pairs} /> : <NotEnoughData />
    }
    case 'who-tells-it': {
      const questions = await getPresenceQuestions()
      return questions.length >= 3 ? <WhoTellsItGame questions={questions} /> : <NotEnoughData />
    }
    case 'timeline-sorter': {
      const data = await getSortableEra()
      return data ? <TimelineSorterGame era={data.era} events={data.events} /> : <NotEnoughData />
    }
    case 'family-chain': {
      const chain = await getFamilyChain()
      return chain.length >= 3 ? <FamilyChainGame chain={chain} /> : <NotEnoughData />
    }
  }
}
