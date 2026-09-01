import Link from 'next/link'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminLearnPage() {
  const courses = await prisma.course.findMany({
    orderBy: { position: 'asc' },
    include: {
      chapters: {
        orderBy: { position: 'asc' },
        include: {
          _count: { select: { items: true, questions: true } },
          questions: { select: { isPublished: true } },
        },
      },
    },
  })

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-stone-900">Courses & chapters</h1>
      <p className="mb-6 max-w-3xl text-sm text-stone-500">
        A chapter is published only when it has a recorded neutrality review. Questions
        approved from the candidate queue arrive unpublished.
      </p>

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

          <table className="w-full border-collapse overflow-hidden rounded-lg border border-stone-200 bg-white text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-400">
                <th className="px-3 py-2 font-semibold">Chapter</th>
                <th className="px-3 py-2 font-semibold">Items</th>
                <th className="px-3 py-2 font-semibold">Questions</th>
                <th className="px-3 py-2 font-semibold">Neutrality review</th>
                <th className="px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {course.chapters.map((chapter) => {
                const published = chapter.questions.filter((q) => q.isPublished).length
                const draft = chapter._count.questions - published
                return (
                  <tr key={chapter.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-3 py-2">
                      <Link href={`/learn/${course.slug}/${chapter.slug}`} className="font-medium text-stone-800 hover:text-stone-950">
                        {chapter.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-stone-600">{chapter._count.items}</td>
                    <td className="px-3 py-2 text-stone-600">
                      {published} published{draft > 0 && <span className="text-amber-700"> · {draft} draft</span>}
                    </td>
                    <td className="px-3 py-2 text-stone-600">
                      {chapter.neutralityReviewedAt
                        ? new Date(chapter.neutralityReviewedAt).toLocaleDateString()
                        : <span className="text-rose-700">Not reviewed</span>}
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
          </table>
        </section>
      ))}
    </div>
  )
}
