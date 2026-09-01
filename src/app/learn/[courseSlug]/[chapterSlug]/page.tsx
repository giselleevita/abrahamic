import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'
import { ChapterItemCard } from '@/components/learn/ChapterItemCard'
import { ChapterVisitTracker } from '@/components/learn/ChapterVisitTracker'
import { ControversialBanner } from '@/components/claims/ControversialBanner'

export const dynamic = 'force-dynamic'

type Params = Promise<{ courseSlug: string; chapterSlug: string }>

async function loadChapter(chapterSlug: string) {
  return prisma.chapter.findUnique({
    where: { slug: chapterSlug },
    include: {
      course: true,
      questions: { where: { isPublished: true }, select: { id: true, isContested: true } },
      items: {
        orderBy: { position: 'asc' },
        include: {
          concept: { select: { slug: true, name: true, summary: true, category: true } },
          comparison: { select: { id: true, title: true, summary: true, tag: true } },
          figure: { select: { slug: true, canonicalName: true, description: true } },
          timelineEvent: { select: { slug: true, name: true, summary: true } },
          theme: { select: { slug: true, name: true, description: true } },
        },
      },
    },
  })
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { chapterSlug } = await params
  const chapter = await prisma.chapter.findUnique({
    where: { slug: chapterSlug },
    select: { title: true, summary: true },
  })
  if (!chapter) return {}
  return { title: chapter.title, description: chapter.summary ?? undefined }
}

export default async function ChapterPage({ params }: { params: Params }) {
  const { courseSlug, chapterSlug } = await params
  const chapter = await loadChapter(chapterSlug)

  if (!chapter || !chapter.isPublished || chapter.course.slug !== courseSlug) notFound()

  const hasContested = chapter.questions.some((q) => q.isContested)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <ChapterVisitTracker slug={chapter.slug} />

      <PageIntro
        eyebrow={chapter.course.title}
        title={chapter.title}
        description={chapter.summary ?? undefined}
        trail={[
          { href: '/learn', label: 'Chapters' },
          { href: `/learn/${chapter.course.slug}`, label: chapter.course.title },
        ]}
      />

      {hasContested && (
        <div className="mb-8">
          <ControversialBanner />
        </div>
      )}

      <ol className="space-y-4">
        {chapter.items.map((item) => (
          <li key={item.id}>
            <ChapterItemCard item={item} />
          </li>
        ))}
      </ol>

      {chapter.questions.length > 0 && (
        <div className="mt-10 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-amber-50 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-950">Check your understanding</h2>
          <p className="mt-2 max-w-2xl leading-7 text-slate-600">
            {chapter.questions.length} question{chapter.questions.length === 1 ? '' : 's'} on what
            each tradition teaches. You can retake it as many times as you like.
          </p>
          <Link
            href={`/learn/${chapter.course.slug}/${chapter.slug}/quiz`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Start the quiz <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
