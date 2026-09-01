import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import prisma from '@/lib/prisma'
import { COMPARISON_TAG_LABEL } from '@/lib/constants'
import { PageIntro } from '@/components/layout/PageIntro'

export const metadata: Metadata = { title: 'Comparisons' }
export const dynamic = 'force-dynamic'

const FILTERS = [
  { value: '', label: 'All comparisons' },
  { value: 'SHARED', label: 'Shared views' },
  { value: 'SIMILAR_DIFFERENT', label: 'Similar, with differences' },
  { value: 'CONTRADICTION', label: 'Direct disagreements' },
] as const

const TAG_STYLE = {
  SHARED: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  SIMILAR_DIFFERENT: 'border-amber-200 bg-amber-50 text-amber-900',
  CONTRADICTION: 'border-rose-200 bg-rose-50 text-rose-800',
} as const

export default async function ComparisonsPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams
  const validTags = ['SHARED', 'SIMILAR_DIFFERENT', 'CONTRADICTION'] as const
  const activeTag = validTags.includes(tag as typeof validTags[number]) ? tag as typeof validTags[number] : undefined
  const comparisons = await prisma.comparison.findMany({
    where: { isPublished: true, ...(activeTag ? { tag: activeTag } : {}) },
    select: { id: true, title: true, summary: true, tag: true, _count: { select: { claims: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <PageIntro eyebrow="Compare" title="Side-by-side comparisons" description="Start with the short summary, then open a comparison to inspect each tradition's view and the sources behind it." />

      <section aria-labelledby="filter-heading" className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 id="filter-heading" className="text-base font-bold text-slate-900">Show me</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const active = filter.value === (activeTag ?? '')
            return <Link key={filter.value} href={filter.value ? `/comparisons?tag=${filter.value}` : '/comparisons'} aria-current={active ? 'page' : undefined} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${active ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50'}`}>{filter.label}</Link>
          })}
        </div>
      </section>

      <p className="mb-5 text-sm font-semibold text-slate-600">{comparisons.length} result{comparisons.length === 1 ? '' : 's'}</p>
      {comparisons.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">No comparisons match this filter. Try another category.</div> : <div className="grid gap-5 md:grid-cols-2">
        {comparisons.map((comparison) => <Link key={comparison.id} href={`/comparisons/${comparison.id}`} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md">
          <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${TAG_STYLE[comparison.tag]}`}>{COMPARISON_TAG_LABEL[comparison.tag]}</span>
          <h2 className="mt-4 text-2xl font-bold text-slate-950 group-hover:text-blue-800">{comparison.title}</h2>
          {comparison.summary ? <p className="mt-3 line-clamp-4 flex-1 text-base leading-7 text-slate-600">{comparison.summary}</p> : <p className="mt-3 flex-1 text-base text-slate-500">Open to read the full comparison.</p>}
          <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4"><span className="text-sm text-slate-500">{comparison._count.claims} tradition view{comparison._count.claims === 1 ? '' : 's'}</span><span className="inline-flex items-center gap-2 font-bold text-blue-700">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></div>
        </Link>)}
      </div>}
    </div>
  )
}
