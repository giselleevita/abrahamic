import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'
import { QuizRunner } from '@/components/learn/QuizRunner'
import { ControversialBanner } from '@/components/claims/ControversialBanner'
import type { QuizQuestionData } from '@/components/learn/types'
import { filterVerseTranslations } from '@/lib/filter-public-translations'
import { formatVerseRef, verseReaderHref } from '@/lib/verse-links'

export const dynamic = 'force-dynamic'

type Params = Promise<{ courseSlug: string; chapterSlug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { chapterSlug } = await params
  const chapter = await prisma.chapter.findUnique({
    where: { slug: chapterSlug },
    select: { title: true },
  })
  return chapter ? { title: `Quiz — ${chapter.title}` } : {}
}

export default async function QuizPage({ params }: { params: Params }) {
  const { courseSlug, chapterSlug } = await params

  const chapter = await prisma.chapter.findUnique({
    where: { slug: chapterSlug },
    include: {
      course: true,
      questions: {
        where: { isPublished: true },
        orderBy: { position: 'asc' },
        include: {
          options: { orderBy: { position: 'asc' } },
          concept: { select: { slug: true, name: true } },
          comparison: { select: { id: true, title: true } },
          timelineEvent: { select: { slug: true, name: true } },
          claim: { select: { id: true, statement: true } },
          verses: {
            orderBy: { position: 'asc' },
            include: {
              verse: {
                include: {
                  source: { select: { slug: true } },
                  translations: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!chapter || !chapter.isPublished || chapter.course.slug !== courseSlug) notFound()

  const nextChapter = await prisma.chapter.findFirst({
    where: { courseId: chapter.courseId, isPublished: true, position: { gt: chapter.position } },
    orderBy: { position: 'asc' },
    select: { slug: true, title: true },
  })

  const questions: QuizQuestionData[] = chapter.questions.map((q) => ({
    id: q.id,
    kind: q.kind,
    format: q.format,
    prompt: q.prompt,
    explanation: q.explanation,
    subjectTradition: q.subjectTradition,
    isContested: q.isContested,
    options: q.options.map((o) => ({
      id: o.id,
      text: o.text,
      isCorrect: o.isCorrect,
      optionTradition: o.optionTradition,
      presence: o.presence,
      rationale: o.rationale,
    })),
    citation:
      q.comparison ? { label: `From the comparison: ${q.comparison.title}`, href: `/comparisons/${q.comparison.id}` }
      : q.concept ? { label: `From: ${q.concept.name}`, href: `/concepts/${q.concept.slug}` }
      : q.timelineEvent ? { label: `From: ${q.timelineEvent.name}`, href: `/timeline#${q.timelineEvent.slug}` }
      : null,
    // Verse text goes through the public-demo policy — a quiz must not become
    // a way to read licensed translations the rest of the site withholds.
    verses: q.verses.map(({ verse }) => {
      const allowed = filterVerseTranslations(verse.translations)
      return {
        reference: formatVerseRef(verse),
        text: allowed[0]?.text ?? null,
        href: verseReaderHref(verse.source.slug, verse),
      }
    }),
  }))

  const hasContested = questions.some((q) => q.isContested)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Quiz"
        title={chapter.title}
        description="Every question asks what a tradition teaches or what a text says — not which tradition is correct."
        crumbLabel="Quiz"
        trail={[
          { href: '/learn', label: 'Chapters' },
          { href: `/learn/${chapter.course.slug}`, label: chapter.course.title },
          { href: `/learn/${chapter.course.slug}/${chapter.slug}`, label: chapter.title },
        ]}
      />

      {hasContested && (
        <div className="mb-8">
          <ControversialBanner />
        </div>
      )}

      <QuizRunner
        chapterSlug={chapter.slug}
        questions={questions}
        questionCount={chapter.quizQuestionCount}
        passPercent={chapter.quizPassPercent}
        nextChapterHref={nextChapter ? `/learn/${chapter.course.slug}/${nextChapter.slug}` : null}
        nextChapterTitle={nextChapter?.title ?? null}
      />

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href={`/learn/${chapter.course.slug}/${chapter.slug}`} className="font-semibold text-blue-700 hover:text-blue-900">
          Back to the chapter
        </Link>
      </p>
    </div>
  )
}
