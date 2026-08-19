import Link from 'next/link'
import prisma from '@/lib/prisma'
import { AGE_BAND_RULES } from '@/lib/kids/readability'

export const dynamic = 'force-dynamic'

export default async function KidsHomePage() {
  const [stories, storyCount] = await Promise.all([
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
      <section className="rounded-2xl border-2 border-gold-500 bg-white p-6 sm:p-10">
        <h1 className="font-serif text-4xl font-bold leading-tight text-primary-950 sm:text-5xl">
          Three books, one big story
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-800">
          Judaism, Christianity, and Islam each have holy books. Many of the same people
          appear in all three. Sometimes the books tell a story the same way. Sometimes
          they tell it differently. Here you can read about them and play some games.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/kids/stories"
            className="rounded-xl bg-gold-600 px-6 py-3 text-lg font-bold text-primary-950 transition-colors hover:bg-gold-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700"
          >
            Read stories
          </Link>
          <Link
            href="/kids/games"
            className="rounded-xl border-2 border-primary-300 bg-white px-6 py-3 text-lg font-bold text-primary-900 transition-colors hover:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
          >
            Play games
          </Link>
        </div>
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
