'use client'

import Link from 'next/link'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import { chapterProgress, completedCount } from '@/lib/learn/progress'
import { useLearnProgress, useProgressHydrated } from '@/lib/learn/use-progress'

export type JourneyStep = { slug: string; title: string; href: string }

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
  const done = hydrated ? completedCount(progress, steps.map((s) => s.slug)) : 0
  const saved = progress.currentJourney?.courseSlug === courseSlug
    ? steps.find((s) => s.slug === progress.currentJourney?.chapterSlug)
    : undefined
  const next = saved ?? steps.find((s) => !chapterProgress(progress, s.slug).completedAt) ?? steps[0]
  const percent = steps.length ? Math.round((done / steps.length) * 100) : 0

  return (
    <div className="rounded-3xl border border-violet-200 bg-white/90 p-6 shadow-xl shadow-violet-100/50 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
        {done > 0 ? 'Continue your journey' : 'Flagship journey'}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Journey progress" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-slate-600">{done} of {steps.length} steps complete</p>
      <Link href={next?.href ?? `/learn/${courseSlug}`} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200">
        {done > 0 ? `Continue: ${next?.title}` : 'Begin the journey'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  )
}

export function JourneyStepList({ steps }: { steps: JourneyStep[] }) {
  const hydrated = useProgressHydrated()
  const { progress } = useLearnProgress()
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => {
        const complete = hydrated && Boolean(chapterProgress(progress, step.slug).completedAt)
        return <li key={step.slug}><Link href={step.href} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${complete ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}>{complete ? <Check className="h-5 w-5" aria-label="Completed" /> : index + 1}</span><span className="min-w-0 flex-1 font-bold text-slate-950 group-hover:text-blue-800">{step.title}</span><ArrowRight className="h-5 w-5 text-blue-700 transition group-hover:translate-x-1" aria-hidden="true" /></Link></li>
      })}
    </ol>
  )
}

export function CompleteStepLink({ courseSlug, chapterSlug, next }: { courseSlug: string; chapterSlug: string; next: JourneyStep | null }) {
  const { completeStep } = useLearnProgress()
  if (!next) return null
  return <Link href={next.href} onClick={() => completeStep(courseSlug, chapterSlug, next.slug)} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200">Complete &amp; continue <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
}

export function RestartJourneyButton({ courseSlug, slugs }: { courseSlug: string; slugs: string[] }) {
  const { resetJourney } = useLearnProgress()
  return <button type="button" onClick={() => resetJourney(courseSlug, slugs)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><RotateCcw className="h-4 w-4" aria-hidden="true" /> Restart journey</button>
}
