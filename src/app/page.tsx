import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Clock3, GitCompareArrows, Search } from 'lucide-react'
import prisma from '@/lib/prisma'
import { JourneyResumeCard } from '@/components/learn/JourneyProgress'

export const revalidate = 300

export default async function HomePage() {
  const journey = await prisma.course.findUnique({
    where: { slug: 'abraham-across-traditions' },
    select: {
      slug: true, title: true, isPublished: true, artworkPath: true, artworkAlt: true,
      artworkCredit: true, artworkSourceUrl: true, artworkLicense: true,
      chapters: { where: { isPublished: true }, orderBy: { position: 'asc' }, select: { slug: true, title: true } },
    },
  })
  const steps = journey?.isPublished ? journey.chapters : []

  return <div className="editorial-page">
    <section className="border-b border-[#e5d9c8] bg-[#f3eadb]" aria-labelledby="home-title">
      <div className="mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-14 lg:py-20">
        <div className="min-w-0">
          <p className="editorial-eyebrow">Start with a guided journey</p>
          <h1 id="home-title" className="editorial-title mt-4 max-w-3xl text-[2.65rem] sm:text-6xl">Meet Abraham across three traditions.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#51483c]">Explore how Judaism, Christianity, and Islam remember Abraham. Hear each tradition in its own voice before comparing the evidence.</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#51483c]"><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#80571b]" aria-hidden="true" /> 13 minutes</span><span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#80571b]" aria-hidden="true" /> Six sourced steps</span></div>
          {journey?.isPublished && steps.length > 0 ? <div className="mt-8 max-w-lg"><JourneyResumeCard courseSlug={journey.slug} title={journey.title} steps={steps.map((step) => ({ ...step, href: `/learn/${journey.slug}/${step.slug}` }))} /></div> : <Link href="/learn" className="editorial-button mt-8">Explore journeys <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
          <p className="mt-4 text-sm text-[#655a4b]">Free to explore · No account needed · Progress stays on this device</p>
        </div>
        <figure className="min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-[#d7c5ad] bg-[#173b68] shadow-[0_24px_60px_rgba(55,39,23,.15)] lg:aspect-[4/5]"><Image src={journey?.artworkPath ?? '/timeline/patriarchal.jpg'} alt={journey?.artworkAlt ?? 'Illustrated ancient desert encampment beneath a field of stars'} fill priority className="object-cover" sizes="(min-width:1024px) 42vw, 100vw" /></div>
          <figcaption className="mt-3 text-xs leading-5 text-[#655a4b]">Artwork: {journey?.artworkCredit ?? 'Abrahamic Texts project artwork'} · {journey?.artworkLicense === 'PROJECT' ? 'Project-created' : journey?.artworkLicense ?? 'Project-created'} · <Link href={journey?.artworkSourceUrl ?? '/licensing'} className="editorial-link">source and licence</Link></figcaption>
        </figure>
      </div>
    </section>

    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      {steps.length > 0 && <section aria-labelledby="route-title">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="editorial-eyebrow">Your route</p><h2 id="route-title" className="editorial-title mt-2 text-3xl sm:text-4xl">Six steps, one clear path</h2></div><Link href={`/learn/${journey?.slug}`} className="editorial-link inline-flex items-center gap-2">See the journey map <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
        <p className="mt-3 max-w-2xl leading-7 text-[#51483c]">Begin with the shared figure, learn each tradition separately, then consider where interpretations meet and differ.</p>
        <ol className="editorial-card mt-6 grid gap-x-6 p-3 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">{steps.map((step, index) => <li key={step.slug} className="flex min-w-0 items-center gap-3 border-b border-[#eee4d6] px-2 py-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eee2cf] text-sm font-bold text-[#654414]">{index + 1}</span><span className="text-sm font-semibold text-[#242019]">{step.title}</span></li>)}</ol>
      </section>}

      <section className="editorial-card mt-14 p-6 sm:p-8" aria-labelledby="explore-title">
        <p className="editorial-eyebrow">Explore at your own pace</p><h2 id="explore-title" className="editorial-title mt-2 text-3xl">Have a question already?</h2>
        <form action="/search" role="search" className="mt-6 flex flex-col gap-3 sm:flex-row"><label htmlFor="home-search" className="sr-only">Search the site</label><div className="relative min-w-0 flex-1"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#655a4b]" aria-hidden="true" /><input id="home-search" name="q" type="search" minLength={2} placeholder="Try Abraham, prayer, or creation" className="editorial-control h-12 w-full pl-12 pr-4" /></div><button type="submit" className="editorial-button">Search</button></form>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/comparisons" className="editorial-control flex items-center gap-3 p-4 font-semibold hover:bg-[#f8f1e7]"><GitCompareArrows className="h-5 w-5 text-[#173b68]" aria-hidden="true" /> Sourced comparisons <ArrowRight className="ml-auto h-4 w-4" aria-hidden="true" /></Link><Link href="/sources" className="editorial-control flex items-center gap-3 p-4 font-semibold hover:bg-[#f8f1e7]"><BookOpen className="h-5 w-5 text-[#173b68]" aria-hidden="true" /> Read source texts <ArrowRight className="ml-auto h-4 w-4" aria-hidden="true" /></Link></div>
      </section>

      <section className="mt-14 max-w-3xl" aria-labelledby="trust-title"><p className="editorial-eyebrow">Our approach</p><h2 id="trust-title" className="editorial-title mt-2 text-3xl">Curious, careful, and sourced.</h2><p className="mt-3 leading-7 text-[#51483c]">We label tradition-specific beliefs, distinguish scripture from interpretation, and link claims to their evidence. This is a curated learning experience, not an exhaustive scripture library.</p><Link href="/editorial-method" className="editorial-link mt-4 inline-flex items-center gap-2">How we work <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></section>
    </div>
  </div>
}
