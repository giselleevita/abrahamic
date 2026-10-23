import Link from 'next/link'
import prisma from '@/lib/prisma'
import { AGE_BAND_RULES } from '@/lib/kids/readability'
import { KIDS_GAMES } from '@/lib/kids/games'
import { YouTubeFacade } from '@/components/video/YouTubeFacade'

// Cached content. Editors' changes appear immediately: mutating routes
// invalidate the matching tag via revalidateContent().
export const revalidate = 3600

export default async function KidsHomePage() {
  const [videos, stories, storyCount] = await Promise.all([
    prisma.videoResource.findMany({
      where: { isPublished: true, isKidsSafe: true },
      orderBy: { createdAt: 'asc' },
      take: 2,
    }),
    prisma.kidsStory.findMany({
      where: { isPublished: true, status: 'APPROVED' },
      select: { slug: true, title: true, ageBand: true, body: true },
      orderBy: { createdAt: 'asc' },
      take: 3,
    }),
    prisma.kidsStory.count({ where: { isPublished: true, status: 'APPROVED' } }),
  ])

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl border-2 border-gold-500 bg-gradient-to-br from-amber-100 via-sky-100 to-emerald-100 p-6 sm:p-10">
        <span aria-hidden="true" className="pointer-events-none absolute -right-2 top-2 select-none text-7xl opacity-80 sm:right-8 sm:text-8xl">📚</span>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-24 hidden select-none text-5xl sm:block">⭐</span>
        <h1 className="relative font-serif text-4xl font-bold leading-tight text-primary-950 sm:text-5xl">
          Three books, one big story
        </h1>
        <p className="relative mt-4 max-w-2xl text-lg leading-relaxed text-primary-800">
          Judaism, Christianity, and Islam each have holy books. Many of the same people
          appear in all three. Sometimes the books tell a story the same way. Sometimes
          they tell it differently. Be a story detective: read, watch, and play!
        </p>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <Link
            href="/kids/games"
            className="rounded-2xl bg-gold-600 px-6 py-3 text-lg font-bold text-primary-950 shadow-md transition-transform hover:-translate-y-0.5 hover:bg-gold-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            🎮 Play games
          </Link>
          <Link
            href="/kids/stories"
            className="rounded-2xl border-2 border-primary-300 bg-white px-6 py-3 text-lg font-bold text-primary-900 transition-transform hover:-translate-y-0.5 hover:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            📖 Read stories
          </Link>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="kids-games-heading">
        <h2 id="kids-games-heading" className="font-serif text-2xl font-bold text-primary-950">Pick a game</h2>
        <div className="stagger mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {KIDS_GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/kids/games/${game.slug}`}
              className={`flex min-h-36 flex-col items-center justify-center gap-1 rounded-3xl border-4 p-4 text-center text-lg font-bold text-primary-950 transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${game.card}`}
            >
              <span aria-hidden="true" className="text-4xl">{game.emoji}</span>
              {game.short}
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-primary-900">{game.ages}</span>
            </Link>
          ))}
        </div>
      </section>

      {videos.length > 0 && (
        <section className="mt-10" aria-labelledby="kids-watch-heading">
          <h2 id="kids-watch-heading" className="font-serif text-2xl font-bold text-primary-950">🎬 Watch and learn</h2>
          <p className="mt-1 text-primary-700">
            Short videos from other educators. Nothing loads from YouTube until you press play.
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {videos.map((video) => (
              <YouTubeFacade
                key={video.id}
                youtubeId={video.youtubeId}
                title={video.title}
                channelName={video.channelName}
                editorNote={video.editorNote}
                perspectiveTradition={video.perspectiveTradition}
                durationSeconds={video.durationSeconds}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 rounded-2xl border-2 border-amber-300 bg-amber-50 p-6">
        <h2 className="font-serif text-xl font-bold text-primary-950">💡 Did you know?</h2>
        <p className="mt-2 text-lg leading-relaxed text-primary-800">
          One person can have different names in different books. Moses in English is
          Moshe in Hebrew and Musa in Arabic. Can you match more in the games?
        </p>
      </section>

      {stories.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-bold text-primary-950">Start with these</h2>
            {storyCount > stories.length && (
              <Link
                href="/kids/stories"
                className="text-sm font-semibold text-primary-600 hover:text-primary-900"
              >
                All {storyCount} stories <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>

          <div className="stagger grid gap-4 sm:grid-cols-3">
            {stories.map((story) => (
              <Link
                key={story.slug}
                href={`/kids/stories/${story.slug}`}
                className="rounded-xl border-2 border-primary-200 bg-white p-5 transition-colors hover:border-gold-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                  {AGE_BAND_RULES[story.ageBand].label}
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold text-primary-950">
                  {story.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-primary-700">
                  {story.body}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 rounded-xl border border-primary-200 bg-white p-6">
        <h2 className="font-serif text-xl font-bold text-primary-950">
          A note for parents and teachers
        </h2>
        <p className="mt-2 leading-relaxed text-primary-700">
          These stories describe what each text says. They do not teach any one tradition as
          correct, and they do not ask a child to believe anything. Each story is written from
          sourced entries on the main site, and every one is read and approved by an editor
          before it is published here. Nothing on these pages is generated and shown to a child
          without a person checking it first.
        </p>
      </section>
    </div>
  )
}
