import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'
import { FigureQuiz } from '@/components/figures/FigureQuiz'
import { buildFigureQuiz, type FigureQuizQuestion } from '@/lib/figure-quiz'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'Daily challenge',
  description: 'Three quick questions about names across the traditions, new every day.',
}

/** Whole days since the epoch (UTC); module-level so the page component stays pure. */
function today(): number {
  return Math.floor(Date.now() / 86_400_000)
}

export default async function DailyPage() {
  const [figures, aliases] = await Promise.all([
    prisma.figure.findMany({ select: { id: true, canonicalName: true }, orderBy: { id: 'asc' } }),
    prisma.figureAlias.findMany({ select: { figureId: true, tradition: true, name: true } }),
  ])
  const day = today()
  const pool = figures
    .map((f) => ({ f, qs: buildFigureQuiz(f, aliases, 3) }))
    .filter((x) => x.qs.length > 0)
  const questions: FigureQuizQuestion[] = []
  for (let k = 0; k < Math.min(3, pool.length); k++) {
    const { qs } = pool[(day * 3 + k) % pool.length]
    questions.push(qs[(day + k) % qs.length])
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Play"
        title="Daily challenge"
        description="Three questions about names, new every day. Finish them to build a streak and earn badges."
        plainWords="A quick, friendly puzzle. Nothing is scored against anyone else, and your streak is kept only on this device."
      />
      {questions.length >= 2 ? (
        <FigureQuiz name="today" questions={questions} kind="daily" heading="Three questions about names" />
      ) : (
        <p className="rounded-2xl border border-[#d7c5ad] bg-white p-6">There are not enough names on the site to make a challenge yet.</p>
      )}
      <p className="mt-6"><Link href="/album" className="font-bold text-[#173b68] hover:underline">See my streak and badges →</Link></p>
    </div>
  )
}
