import Link from 'next/link'
import prisma from '@/lib/prisma'
import { ABRAHAM_STEP_SLUGS } from '@/lib/learn/metrics'
import { artworkIssues, chapterReadiness } from '@/lib/learn/readiness'

export const dynamic = 'force-dynamic'

export default async function AdminLearnPage() {
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - 29)
  since.setUTCHours(0, 0, 0, 0)
  const [courses, completionTotals] = await Promise.all([prisma.course.findMany({
    orderBy: { position: 'asc' },
    include: {
      chapters: {
        orderBy: { position: 'asc' },
        include: {
          _count: { select: { items: true, questions: true } },
          items: { select: { itemType: true } },
          questions: { select: { isPublished: true } },
        },
      },
    },
  }), prisma.journeyMetric.groupBy({
    by: ['chapterSlug'],
    where: { day: { gte: since } },
    _sum: { count: true },
  })])
  const completions = new Map(completionTotals.map((row) => [row.chapterSlug, row._sum.count ?? 0]))

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-stone-900">Courses & chapters</h1>
      <p className="mb-6 max-w-3xl text-sm text-stone-500">
        A chapter is published only when it has a recorded neutrality review. Questions
        approved from the candidate queue arrive unpublished.
      </p>

      <section className="mb-8 rounded-xl border border-violet-200 bg-violet-50 p-5">
        <h2 className="font-semibold text-violet-950">Abraham journey · last 30 days</h2>
        <p className="mt-1 text-xs text-violet-800">Anonymous completion actions, not unique people. No visitor identifiers are stored.</p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ABRAHAM_STEP_SLUGS.map((slug, index) => (
            <li key={slug} className="rounded-lg bg-white p-3 text-sm text-slate-800">
              <span className="font-medium">Step {index + 1}</span>
              <span className="float-right font-bold tabular-nums">{completions.get(slug) ?? 0}</span>
            </li>
          ))}
        </ol>
      </section>

      {courses.length === 0 && <p className="text-sm text-stone-500">No courses yet.</p>}

      {courses.map((course) => (
        <section key={course.id} className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-stone-900">{course.title}</h2>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              course.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
            }`}>
              {course.isPublished ? 'Published' : 'Draft'}
            </span>
            <Link href={`/learn/${course.slug}`} className="ml-auto text-sm text-stone-500 hover:text-stone-800">
              View on site →
            </Link>
          </div>

          {artworkIssues(course).length > 0 && <p className="mb-3 text-sm text-amber-800">Course artwork needs: {artworkIssues(course).join(', ')}.</p>}

          <div className="overflow-x-auto rounded-lg border border-stone-200"><table className="w-full min-w-[740px] border-collapse bg-white text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-400">
                <th className="px-3 py-2 font-semibold">Chapter</th>
                <th className="px-3 py-2 font-semibold">Items / evidence</th>
                <th className="px-3 py-2 font-semibold">Quiz</th>
                <th className="px-3 py-2 font-semibold">Neutrality review</th>
                <th className="px-3 py-2 font-semibold">Journey readiness</th>
                <th className="px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {course.chapters.map((chapter) => {
                const published = chapter.questions.filter((q) => q.isPublished).length
                const draft = chapter._count.questions - published
                const readiness = chapterReadiness(chapter, course)
                return (
                  <tr key={chapter.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-3 py-2">
                      <Link href={`/learn/${course.slug}/${chapter.slug}`} className="font-medium text-stone-800 hover:text-stone-950">
                        {chapter.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-stone-600">{chapter._count.items} items<span className="block text-xs text-stone-500">{readiness.evidenceLinks} evidence link(s) · {readiness.directVerses} direct scripture excerpt(s)</span></td>
                    <td className="px-3 py-2 text-stone-600">
                      {published} published{draft > 0 && <span className="text-amber-700"> · {draft} draft</span>}
                    </td>
                    <td className="px-3 py-2 text-stone-600">
                      {chapter.neutralityReviewedAt
                        ? new Date(chapter.neutralityReviewedAt).toLocaleDateString()
                        : <span className="text-rose-700">Not reviewed</span>}
                    </td>
                    <td className="px-3 py-2 text-stone-600">
                      <span className={readiness.ready ? 'font-semibold text-emerald-700' : 'font-semibold text-amber-800'}>{readiness.ready ? 'Ready' : 'Needs work'}</span>
                      {!readiness.ready && <span className="block text-xs text-stone-500">{readiness.issues.join(', ')}</span>}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        chapter.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {chapter.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table></div>
        </section>
      ))}
    </div>
  )
}
