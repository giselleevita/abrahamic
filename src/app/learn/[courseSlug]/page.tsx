import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'
import { ChapterProgressBadge } from '@/components/learn/ChapterProgressBadge'

export const dynamic = 'force-dynamic'

type Params = Promise<{ courseSlug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { courseSlug } = await params
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { title: true, description: true },
  })
  if (!course) return {}
  return { title: course.title, description: course.description ?? undefined }
}

export default async function CoursePage({ params }: { params: Params }) {
  const { courseSlug } = await params
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: { position: 'asc' },
        include: { _count: { select: { items: true, questions: true } } },
      },
    },
  })

  if (!course || !course.isPublished) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Course"
        title={course.title}
        description={course.description ?? undefined}
        trail={[{ href: '/learn', label: 'Chapters' }]}
      />

      <ol className="space-y-3">
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
                  <span className="text-lg font-bold text-slate-950 group-hover:text-blue-800">{chapter.title}</span>
                  <ChapterProgressBadge slug={chapter.slug} />
                </span>
                {chapter.summary && <span className="mt-1 block leading-7 text-slate-600">{chapter.summary}</span>}
                <span className="mt-2 block text-sm text-slate-500">
                  {chapter._count.items} things to read · {chapter._count.questions} questions
                </span>
              </span>
              <ArrowRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-blue-700 transition group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
