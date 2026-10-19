import Link from 'next/link'
import prisma from '@/lib/prisma'
import { AGE_BAND_RULES } from '@/lib/kids/readability'

// Cached content. Editors' changes appear immediately: mutating routes
// invalidate the matching tag via revalidateContent().
export const revalidate = 3600

export default async function KidsStoriesPage({ searchParams }: { searchParams: Promise<{ age?: string }> }) {
  const { age } = await searchParams
  const selected = age === 'AGE_6_8' || age === 'AGE_9_12' ? age : ''
  // Both flags are required: `isPublished` is the release switch and
  // `status` is the review outcome. The database also enforces the pairing.
  const stories = await prisma.kidsStory.findMany({
    where: { isPublished: true, status: 'APPROVED' },
    select: { slug: true, title: true, ageBand: true, body: true },
    orderBy: [{ ageBand: 'asc' }, { createdAt: 'asc' }],
  })

  const bands = ['AGE_6_8', 'AGE_9_12'] as const

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-primary-950 sm:text-4xl">Stories</h1>
      <p className="mt-2 max-w-2xl text-lg text-primary-800">
        Short stories about what the Torah, the Bible, and the Quran say.
      </p>

      <nav aria-label="Choose an age band" className="mt-6 flex flex-wrap gap-3">{[['', 'All stories'], ['AGE_6_8', 'Ages 6–8'], ['AGE_9_12', 'Ages 9–12']].map(([value, label]) => <Link key={value} aria-current={selected === value ? 'page' : undefined} className={`rounded-xl border-2 px-5 py-3 text-lg font-semibold ${selected === value ? 'border-primary-900 bg-primary-900 text-white' : 'border-primary-200 bg-white text-primary-900'}`} href={value ? `/kids/stories?age=${value}` : '/kids/stories'}>{label}</Link>)}</nav>
      {stories.length === 0 && (
        <p className="mt-8 rounded-xl border border-primary-200 bg-white p-6 text-primary-700">
          There are no stories here yet. Check back soon.
        </p>
      )}

      {bands.filter((band) => !selected || selected === band).map((band) => {
        const inBand = stories.filter((s) => s.ageBand === band)
        if (inBand.length === 0) return null

        return (
          <section key={band} className="mt-8">
            <h2 className="font-serif text-2xl font-bold text-primary-950">
              {AGE_BAND_RULES[band].label}
            </h2>
            <div className="stagger mt-4 grid gap-4 sm:grid-cols-2">
              {inBand.map((story) => (
                <Link
                  key={story.slug}
                  href={`/kids/stories/${story.slug}`}
                  className="rounded-xl border-2 border-primary-200 bg-white p-5 transition-colors hover:border-gold-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
                >
                  <h3 className="font-serif text-xl font-bold text-primary-950">{story.title}</h3>
                  <p className="mt-2 line-clamp-3 leading-relaxed text-primary-700">
                    {story.body}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-gold-700">Read it →</p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
