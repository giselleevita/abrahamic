import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Clock3, Compass } from 'lucide-react'
import prisma from '@/lib/prisma'
import { JourneyResumeCard } from '@/components/learn/JourneyProgress'

export const revalidate = 300
export const metadata: Metadata = { title: 'Guided Journeys', description: 'Beginner-friendly, sourced journeys through Judaism, Christianity, and Islam.' }

export default async function LearnPage() {
  const courses = await prisma.course.findMany({ where: { isPublished: true }, orderBy: { position: 'asc' }, include: { chapters: { where: { isPublished: true }, orderBy: { position: 'asc' }, include: { _count: { select: { items: true, questions: true } } } } } })
  const featured = courses[0]
  const more = courses.slice(1)
  const featuredSteps = featured?.chapters.map((chapter) => ({ slug: chapter.slug, title: chapter.title, href: `/learn/${featured.slug}/${chapter.slug}` })) ?? []

  return <div className="min-h-screen bg-[#fffaf5]">
    <section className="relative overflow-hidden border-b border-amber-200 bg-gradient-to-br from-amber-50 via-white to-violet-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="relative z-10"><p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Guided journeys</p><h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-6xl">Follow the story. Understand each tradition.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Short, visual paths present Jewish, Christian, and Islamic perspectives in their own words before placing them side by side. Every important claim leads back to evidence.</p><div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600"><span className="inline-flex items-center gap-2"><Compass className="h-4 w-4 text-blue-700" /> No prior knowledge needed</span><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-violet-700" /> 10–15 minutes</span><span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-emerald-700" /> Sources included</span></div></div>
        {featured && <div className="relative"><div className="absolute inset-x-8 -top-8 h-48 overflow-hidden rounded-3xl opacity-45"><Image src={featured.artworkPath ?? '/timeline/patriarchal.jpg'} alt="" fill className="object-cover" sizes="(min-width:1024px) 40vw, 90vw" /></div><div className="relative pt-24"><JourneyResumeCard courseSlug={featured.slug} title={featured.title} steps={featuredSteps} /></div></div>}
      </div>
    </section>
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      {featured && <section aria-labelledby="featured-journey"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Flagship journey</p><h2 id="featured-journey" className="mt-2 text-3xl font-bold text-slate-950">{featured.title}</h2><p className="mt-2 max-w-3xl leading-7 text-slate-600">{featured.description}</p></div><Link href={`/learn/${featured.slug}`} className="inline-flex items-center gap-2 font-bold text-blue-700">View journey map <ArrowRight className="h-4 w-4" /></Link></div><ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{featured.chapters.map((chapter, index) => <li key={chapter.id}><Link href={`/learn/${featured.slug}/${chapter.slug}`} className="group flex h-full min-h-48 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"><span className="text-sm font-bold text-blue-700">Step {index + 1} · {chapter.estimatedMinutes ?? 3} min</span><h3 className="mt-3 text-xl font-bold text-slate-950 group-hover:text-blue-800">{chapter.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{chapter.summary}</p><span className="mt-4 inline-flex items-center gap-2 font-bold text-blue-700">Open step <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link></li>)}</ol></section>}
      {more.length > 0 && <section className="mt-16" aria-labelledby="more-journeys"><p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">Keep exploring</p><h2 id="more-journeys" className="mt-2 text-3xl font-bold text-slate-950">More journeys</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{more.map((course) => <Link key={course.id} href={`/learn/${course.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md"><div className="flex items-center justify-between gap-3"><h3 className="text-xl font-bold text-slate-950 group-hover:text-blue-800">{course.title}</h3><ArrowRight className="h-5 w-5 text-blue-700" /></div>{course.description && <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{course.description}</p>}<p className="mt-4 text-sm font-semibold text-slate-500">{course.chapters.length} steps</p></Link>)}</div></section>}
    </main>
  </div>
}
