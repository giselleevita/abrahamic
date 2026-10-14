import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import prisma from '@/lib/prisma'
import { JourneyResumeCard } from '@/components/learn/JourneyProgress'

export const revalidate = 300
export const metadata: Metadata = { title: 'Guided Journeys', description: 'Beginner-friendly, sourced journeys through Judaism, Christianity, and Islam.' }

export default async function LearnPage() {
  const courses = await prisma.course.findMany({ where: { isPublished: true }, orderBy: { position: 'asc' }, include: { chapters: { where: { isPublished: true }, orderBy: { position: 'asc' } } } })
  const featured = courses[0]
  const more = courses.slice(1)
  const featuredSteps = featured?.chapters.map((chapter) => ({ slug: chapter.slug, title: chapter.title, href: `/learn/${featured.slug}/${chapter.slug}` })) ?? []

  return <div className="editorial-page min-h-screen">
    <section className="border-b border-[#e5d9c8] bg-[#f3eadb]"><div className="mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-14">
      <div><p className="editorial-eyebrow">Guided journeys</p><h1 className="editorial-title mt-3 text-4xl sm:text-6xl">Follow the story. Understand each tradition.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#51483c]">Short, visual paths present Jewish, Christian, and Islamic perspectives in their own voices before placing them side by side. Every important claim leads back to evidence.</p><p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#51483c]"><Clock3 className="h-4 w-4 text-[#80571b]" aria-hidden="true" /> No prior knowledge needed · Around 13 minutes</p>{featured && <div className="mt-8 max-w-lg"><JourneyResumeCard courseSlug={featured.slug} title={featured.title} steps={featuredSteps} /></div>}</div>
      {featured && <figure><div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[#d7c5ad] bg-[#173b68] lg:aspect-[4/5]"><Image src={featured.artworkPath ?? '/timeline/patriarchal.jpg'} alt={featured.artworkAlt ?? ''} fill priority className="object-cover" sizes="(min-width:1024px) 42vw, 100vw" /></div><figcaption className="mt-3 text-xs leading-5 text-[#655a4b]">Artwork: {featured.artworkCredit ?? 'Abrahamic Texts project artwork'} · {featured.artworkLicense === 'PROJECT' ? 'Project-created' : featured.artworkLicense ?? 'Project-created'} · <Link href={featured.artworkSourceUrl ?? '/licensing'} className="editorial-link">source and licence</Link></figcaption></figure>}
    </div></section>

    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      {featured && <section aria-labelledby="featured-journey"><p className="editorial-eyebrow">Flagship journey</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h2 id="featured-journey" className="editorial-title text-3xl sm:text-4xl">{featured.title}</h2><p className="mt-2 max-w-3xl leading-7 text-[#51483c]">{featured.description}</p></div><Link href={`/learn/${featured.slug}`} className="editorial-link inline-flex items-center gap-2">View journey map <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
        <ol className="editorial-card mt-6 divide-y divide-[#eee4d6] px-4 sm:px-6">{featured.chapters.map((chapter, index) => <li key={chapter.id}><Link href={`/learn/${featured.slug}/${chapter.slug}`} className="group flex flex-wrap items-center gap-x-4 gap-y-1 py-4 focus-visible:outline-3 focus-visible:outline-[#a67222]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eee2cf] text-sm font-bold text-[#654414]">{index + 1}</span><span className="min-w-0 flex-1 font-semibold text-[#242019]">{chapter.title}<span className="ml-3 text-sm font-normal text-[#655a4b]">{chapter.estimatedMinutes ?? 3} min</span></span><ArrowRight className="h-4 w-4 text-[#173b68]" aria-hidden="true" /></Link></li>)}</ol>
      </section>}
      {more.length > 0 && <section className="mt-16" aria-labelledby="more-journeys"><p className="editorial-eyebrow">Keep exploring</p><h2 id="more-journeys" className="editorial-title mt-2 text-3xl">More journeys</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{more.map((course) => <Link key={course.id} href={`/learn/${course.slug}`} className="editorial-card group block p-6 hover:border-[#173b68] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#a67222]"><div className="flex items-center justify-between gap-3"><h3 className="text-xl font-bold text-[#242019]">{course.title}</h3><ArrowRight className="h-5 w-5 text-[#173b68]" aria-hidden="true" /></div>{course.description && <p className="mt-3 line-clamp-3 leading-7 text-[#51483c]">{course.description}</p>}<p className="mt-4 text-sm font-semibold text-[#655a4b]">{course.chapters.length} steps</p></Link>)}</div></section>}
    </div>
  </div>
}
