'use client'

import Link from 'next/link'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import { chapterProgress, completedCount, firstIncompleteChapter } from '@/lib/learn/progress'
import { useLearnProgress, useProgressHydrated } from '@/lib/learn/use-progress'

export type JourneyStep = { slug: string; title: string; href: string; estimatedMinutes?: number | null }

export function JourneyResumeCard({
  courseSlug,
  title,
  steps,
}: {
  courseSlug: string
  title: string
  steps: JourneyStep[]
}) {
  const hydrated = useProgressHydrated()
  const { progress } = useLearnProgress()
  const slugs = steps.map((s) => s.slug)
  const done = hydrated ? completedCount(progress, slugs) : 0
  const nextSlug = firstIncompleteChapter(progress, slugs)
  const next = steps.find((s) => s.slug === nextSlug)
  const complete = hydrated && steps.length > 0 && nextSlug === null
  const percent = steps.length ? Math.round((done / steps.length) * 100) : 0

  return (
    <div className="editorial-card p-6 sm:p-8">
      <p className="editorial-eyebrow">
        {complete ? 'Journey complete' : done > 0 ? 'Continue your journey' : 'Flagship journey'}
      </p>
      <h2 className="editorial-title mt-2 text-3xl">{title}</h2>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e9decd]" role="progressbar" aria-label="Journey progress" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-[#173b68] transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-[#51483c]">{done} of {steps.length} steps complete</p>
      <Link href={complete ? `/learn/${courseSlug}` : next?.href ?? `/learn/${courseSlug}`} className="editorial-button mt-5">
        {complete ? 'Review your journey' : done > 0 && next ? `Continue: ${next.title}` : next ? 'Begin the journey' : 'View journey map'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  )
}

export function JourneyStepList({ steps }: { steps: JourneyStep[] }) {
  const hydrated = useProgressHydrated()
  const { progress } = useLearnProgress()
  const nextSlug = hydrated ? firstIncompleteChapter(progress, steps.map((step) => step.slug)) : null

  return (
    <ol className="space-y-3">
      {steps.map((step, index) => {
        const state = chapterProgress(progress, step.slug)
        const complete = hydrated && Boolean(state.completedAt)
        const upNext = hydrated && step.slug === nextSlug
        const status = !hydrated ? 'Loading progress' : complete ? 'Completed' : upNext ? state.visitedAt ? 'In progress · up next' : 'Up next' : state.visitedAt ? 'Started' : 'Not started'

        return <li key={step.slug}>
          <Link href={step.href} className={`editorial-card group flex min-w-0 items-center gap-4 p-5 transition hover:border-[#173b68] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#a67222] ${upNext ? 'border-[#173b68]' : ''}`}>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${complete ? 'bg-[#e5efdf] text-[#315526]' : upNext ? 'bg-[#dce8f2] text-[#173b68]' : 'bg-[#eee2cf] text-[#654414]'}`} aria-hidden="true">{complete ? <Check className="h-5 w-5" /> : index + 1}</span>
            <span className="min-w-0 flex-1"><span className="block font-bold text-[#242019]">{step.title}</span><span className="mt-1 block text-sm text-[#655a4b]">{step.estimatedMinutes ?? 3} min · {status}</span></span>
            <ArrowRight className="h-5 w-5 shrink-0 text-[#173b68]" aria-hidden="true" />
          </Link>
        </li>
      })}
    </ol>
  )
}

export function CompleteStepLink({ courseSlug, chapterSlug, next }: { courseSlug: string; chapterSlug: string; next: JourneyStep | null }) {
  const { completeStep } = useLearnProgress()
  if (!next) return null
  return <Link href={next.href} onClick={() => completeStep(courseSlug, chapterSlug, next.slug)} className="editorial-button">Complete &amp; continue <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
}

export function CompleteJourneyLink({ courseSlug, chapterSlug }: { courseSlug: string; chapterSlug: string }) {
  const { completeStep } = useLearnProgress()
  return <Link href={`/learn/${courseSlug}`} onClick={() => completeStep(courseSlug, chapterSlug, null)} className="editorial-button">Finish journey <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
}

export function RestartJourneyButton({ courseSlug, slugs }: { courseSlug: string; slugs: string[] }) {
  const { resetJourney } = useLearnProgress()
  return <button type="button" onClick={() => resetJourney(courseSlug, slugs)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><RotateCcw className="h-4 w-4" aria-hidden="true" /> Restart journey</button>
}
