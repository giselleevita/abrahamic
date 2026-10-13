import Link from 'next/link'
import { ArrowRight, BookOpen, Clock3, Compass, GitCompareArrows, Search } from 'lucide-react'
import prisma from '@/lib/prisma'
import { JourneyResumeCard } from '@/components/learn/JourneyProgress'

export const revalidate = 300

export default async function HomePage() {
  const journey = await prisma.course.findUnique({
    where: { slug: 'abraham-across-traditions' },
    select: {
      slug: true, title: true, isPublished: true,
      chapters: {
        where: { isPublished: true }, orderBy: { position: 'asc' },
        select: { slug: true, title: true },
      },
    },
  })
  const steps = journey?.isPublished ? journey.chapters : []

  return (
    <div className="bg-[#fffaf5]">
      <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-amber-50 via-white to-violet-50">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-violet-200/35 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Start with a guided journey</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-6xl">One story. Three traditions. A clearer understanding.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">Discover how Judaism, Christianity, and Islam remember Abraham. Hear each tradition in its own voice, then compare the evidence.</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-700">
              <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-violet-700" aria-hidden="true" /> 13 minutes</span>
              <span className="inline-flex items-center gap-2"><Compass className="h-4 w-4 text-blue-700" aria-hidden="true" /> Six short steps</span>
              <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-emerald-700" aria-hidden="true" /> Sources included</span>
            </div>
            <p className="mt-7 text-sm text-slate-600">Free to explore · No account needed · Your progress stays on this device</p>
          </div>
          <div>
            {journey?.isPublished && steps.length > 0 ? (
              <JourneyResumeCard courseSlug={journey.slug} title={journey.title} steps={steps.map((step) => ({ ...step, href: `/learn/${journey.slug}/${step.slug}` }))} />
            ) : (
              <div className="rounded-3xl border border-violet-200 bg-white p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-950">Explore guided journeys</h2>
                <Link href="/learn" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">View journeys <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {steps.length > 0 && <section aria-labelledby="journey-preview">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Your route</p>
          <h2 id="journey-preview" className="mt-2 text-3xl font-bold text-slate-950">What you’ll understand</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">Begin with the shared story, learn each tradition separately, then see where their interpretations meet and differ.</p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => <li key={step.slug} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-800">{index + 1}</span><span className="font-semibold text-slate-900">{step.title}</span></li>)}
          </ol>
          <Link href={`/learn/${journey?.slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900">See the journey map <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </section>}

        <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8" aria-labelledby="explore-more">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Explore at your own pace</p>
          <h2 id="explore-more" className="mt-2 text-2xl font-bold text-slate-950">Have a question already?</h2>
          <form action="/search" role="search" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="home-search" className="sr-only">Search the site</label>
            <div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" /><input id="home-search" name="q" type="search" minLength={2} placeholder="Try Abraham, prayer, or creation" className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-slate-950 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" /></div>
            <button type="submit" className="h-14 rounded-xl bg-slate-900 px-7 font-bold text-white hover:bg-slate-800">Search</button>
          </form>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/comparisons" className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 font-semibold text-violet-950 hover:bg-violet-100"><GitCompareArrows className="h-5 w-5" aria-hidden="true" /> Browse sourced comparisons <ArrowRight className="ml-auto h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/sources" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-semibold text-emerald-950 hover:bg-emerald-100"><BookOpen className="h-5 w-5" aria-hidden="true" /> Read available source excerpts <ArrowRight className="ml-auto h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="mt-16 max-w-3xl" aria-labelledby="trust-heading">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">Our approach</p>
          <h2 id="trust-heading" className="mt-2 text-2xl font-bold text-slate-950">Curious, careful, and sourced.</h2>
          <p className="mt-3 leading-7 text-slate-600">We label tradition-specific beliefs, distinguish scripture from interpretation, and link claims to their evidence. This is a curated learning experience, not an exhaustive scripture library.</p>
          <Link href="/editorial-method" className="mt-4 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900">How we work <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </section>
      </main>
    </div>
  )
}
