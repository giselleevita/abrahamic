import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'
import { ChapterProgressBadge } from '@/components/learn/ChapterProgressBadge'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Learn',
  description: 'Guided chapters through Judaism, Christianity and Islam, each ending in a short quiz.',
}

export default async function LearnPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { position: 'asc' },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: { position: 'asc' },
        include: { _count: { select: { items: true, questions: true } } },
      },
    },
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Learn"
        title="Chapters"
        description="A guided path through the three traditions. Each chapter gathers the relevant people, beliefs and comparisons, then asks a few questions. Questions ask what each tradition teaches — never which one is right."
      />

      {courses.length === 0 && <p className="text-slate-600">No courses are published yet.</p>}

      {courses.map((course) => (
        <section key={course.id} className="mb-12" aria-labelledby={`course-${course.id}`}>
          <h2 id={`course-${course.id}`} className="text-2xl font-bold text-slate-950">
            {course.title}
          </h2>
          {course.description && (
            <p className="mt-2 max-w-3xl leading-7 text-slate-600">{course.description}</p>
          )}

          <ol className="mt-6 space-y-3">
            {course.chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <Link
                  href={`/learn/${course.slug}/${chapter.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-800">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold text-slate-950 group-hover:text-blue-800">
                        {chapter.title}
                      </span>
                      <ChapterProgressBadge slug={chapter.slug} />
                    </span>
                    {chapter.summary && (
                      <span className="mt-1 block leading-7 text-slate-600">{chapter.summary}</span>
                    )}
                    <span className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                      <BookOpen aria-hidden="true" className="h-4 w-4" />
                      {chapter._count.items} things to read · {chapter._count.questions} questions
                    </span>
                  </span>
                  <ArrowRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-blue-700 transition group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
