/**
 * Single description of the kids games: the games index, the home tiles and the
 * in-game banner all read from here, so a title, icon or suggested age cannot
 * differ between surfaces.
 */
export interface KidsGameInfo {
  slug: string
  title: string
  short: string
  emoji: string
  blurb: string
  /** Suggested age, shown as a badge. Guidance for grown-ups, not a gate. */
  ages: string
  /** Why that age — shown to parents and teachers. */
  agesWhy: string
  /** Solid tile colours (card) and banner gradient. */
  card: string
  banner: string
}

export const KIDS_GAMES: KidsGameInfo[] = [
  {
    slug: 'name-match',
    title: 'Same Person, Many Names',
    short: 'Many Names',
    emoji: '🧩',
    blurb: 'Moses, Moshe, Musa: one person, three names. Can you match them up?',
    ages: 'Ages 6+',
    agesWhy: 'Matching names; very little reading.',
    card: 'bg-sky-100 border-sky-400',
    banner: 'from-sky-200 to-sky-100 border-sky-400',
  },
  {
    slug: 'family-chain',
    title: 'Who Came First?',
    short: 'Who Came First?',
    emoji: '🌳',
    blurb: 'Build a family chain from parent to child, oldest first.',
    ages: 'Ages 7+',
    agesWhy: 'Short names in a row; ordering practice.',
    card: 'bg-violet-100 border-violet-400',
    banner: 'from-violet-200 to-violet-100 border-violet-400',
  },
  {
    slug: 'timeline-sorter',
    title: 'Put It In Order',
    short: 'Put It In Order',
    emoji: '⏳',
    blurb: 'Move these events into the order the timeline puts them in.',
    ages: 'Ages 8+',
    agesWhy: 'Reading short event descriptions and ordering them.',
    card: 'bg-emerald-100 border-emerald-400',
    banner: 'from-emerald-200 to-emerald-100 border-emerald-400',
  },
  {
    slug: 'who-tells-it',
    title: 'Who Tells This Story?',
    short: 'Who Tells It?',
    emoji: '🔍',
    blurb: 'Some stories are in all three books. Some are only in one. Which is which?',
    ages: 'Ages 9–12',
    agesWhy: 'More reading, and some ideas to compare between books.',
    card: 'bg-rose-100 border-rose-400',
    banner: 'from-rose-200 to-rose-100 border-rose-400',
  },
]

export const KIDS_GAME_BY_SLUG: Record<string, KidsGameInfo> = Object.fromEntries(
  KIDS_GAMES.map((g) => [g.slug, g]),
)
