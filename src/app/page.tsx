import './premium.css'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Compass, GitBranch, Search, Sparkles } from 'lucide-react'
import prisma from '@/lib/prisma'
import { JourneyResumeCard } from '@/components/learn/JourneyProgress'
import { StoryScene } from '@/components/experience/Motion'
import { ChoosePath } from '@/components/home/ChoosePath'
import { TrailStrip } from '@/components/home/TrailStrip'
import { DidYouKnow } from '@/components/home/DidYouKnow'
import { DeferredPerspectives, DeferredJourney, DeferredEras } from '@/components/discovery/DiscoveryIsland'

export const revalidate = 300

export default async function HomePage() {
  const [journey, comparisons, topics, eras] = await Promise.all([
    prisma.course.findUnique({
      where: { slug: 'abraham-across-traditions' },
      select: {
        slug: true, title: true, isPublished: true, estimatedMinutes: true,
        artworkPath: true, artworkAlt: true, artworkCredit: true, artworkSourceUrl: true, artworkLicense: true,
        chapters: { where: { isPublished: true }, orderBy: { position: 'asc' }, select: { slug: true, title: true, summary: true, learningObjective: true, estimatedMinutes: true } },
      },
    }),
    prisma.comparison.findMany({
      where: { isPublished: true, claims: { some: { claim: { isPublished: true, figures: { some: { figure: { slug: 'abraham' } } } } } } },
      orderBy: { id: 'asc' }, take: 3,
      select: { id: true, title: true, summary: true, claims: {
        where: { claim: { isPublished: true } }, orderBy: { position: 'asc' },
        select: { claim: { select: { id: true, statement: true, source: { select: { title: true, slug: true, tradition: true } }, verses: { select: { verse: { select: { book: true, chapter: true, verse: true, versification: true } } } } } } },
      } },
    }),
    prisma.theme.findMany({ where: { slug: { in: ['prayer', 'god', 'ethics'] }, claims: { some: { claim: { isPublished: true } } } }, orderBy: { name: 'asc' }, take: 3, select: { slug: true, name: true } }),
    prisma.timelineEvent.findMany({ where: { isPublished: true }, distinct: ['era'], orderBy: [{ era: 'asc' }, { position: 'asc' }], select: { era: true, slug: true, name: true, summary: true } }),
  ])
  const steps = journey?.isPublished ? journey.chapters : []
  const preview = comparisons[0]
  const perspectiveTopics = comparisons.map((comparison) => ({ id: comparison.id, title: comparison.title, perspectives: comparison.claims.map(({ claim }) => ({ id: claim.id, statement: claim.statement, tradition: claim.source.tradition, sourceTitle: claim.source.title, sourceSlug: claim.source.slug, citations: claim.verses.map(({ verse }) => verse) })) }))

  return <div className="premium-home editorial-page">
    <section className="premium-hero" aria-labelledby="home-title">
      <StoryScene className="premium-hero-scene"><Image src={journey?.artworkPath ?? '/timeline/patriarchal.jpg'} alt={journey?.artworkAlt ?? 'Painting of a Bedouin encampment with tents and palms beside a well (Marie-Méloé Lafon, 1841)'} fill preload sizes="100vw" className="object-cover" /></StoryScene>
      <div className="premium-hero-shade" aria-hidden />
      <div className="premium-hero-orbit" aria-hidden><span /><span /><span /></div>
      <div className="premium-hero-inner">
        <div className="premium-hero-copy">
          <p className="premium-kicker"><span /> A meeting of worlds</p>
          <h1 id="home-title">One shared<br />beginning.<br /><em>Three distinct traditions.</em></h1>
          <p className="premium-hero-description">Meet Abraham through Jewish, Christian, and Islamic perspectives. Discover the stories that connect them—and the differences that make each tradition its own.</p>
          <div className="premium-tradition-links" aria-label="Explore each tradition">{[
            { name: 'Judaism', index: 1, style: 'sapphire' },
            { name: 'Christianity', index: 2, style: 'garnet' },
            { name: 'Islam', index: 3, style: 'amethyst' },
          ].map((tradition) => steps[tradition.index] && <Link key={tradition.name} prefetch={false} href={`/learn/${journey?.slug}/${steps[tradition.index].slug}`}><span className={tradition.style} />{tradition.name}<ArrowUpRight size={13} aria-hidden /></Link>)}</div>
          {journey?.isPublished && steps.length > 0 ? <div className="premium-hero-journey"><JourneyResumeCard courseSlug={journey.slug} title={journey.title} steps={steps.map((step) => ({ ...step, href: `/learn/${journey.slug}/${step.slug}` }))} /></div> : <Link href="/learn" className="editorial-button mt-8">Explore journeys <ArrowRight size={18} aria-hidden /></Link>}
          <p className="premium-hero-footnote">Free to explore. No account needed. Yours to discover.</p>
        </div>
        <div className="premium-scene-note"><span className="scene-crosshair" aria-hidden>+</span><div><p>A shared point of departure</p><span>Abraham · Avraham · Ibrahim</span></div><Sparkles size={20} aria-hidden /></div>
      </div>
      <div className="premium-hero-bottom"><a href="#choose-path"><ArrowDown size={16} aria-hidden className="scroll-cue" />Scroll to discover</a><span>Project artwork · <Link href={journey?.artworkSourceUrl ?? '/licensing'}>Source &amp; licence</Link></span></div>
    </section>

    <div className="premium-introduction" id="discover"><p>Read with curiosity.<br /><em>Compare with care.</em></p><span>Every perspective has a context. Every claim has a source. Find your own way through the connections.</span><Link href="/editorial-method">Our approach <ArrowUpRight size={17} aria-hidden /></Link></div>

    <TrailStrip />
    <ChoosePath />
    <DidYouKnow />

    <div className="premium-content">
      {perspectiveTopics.length > 0 && <DeferredPerspectives topics={perspectiveTopics} fallback={<section className="premium-section" id="perspectives" aria-labelledby="perspective-title"><div className="premium-section-heading"><div><p className="editorial-eyebrow">01 / An exchange of perspectives</p><h2 id="perspective-title">One question.<br /><em>More than one perspective.</em></h2></div><p>Choose a question and inspect each tradition’s perspective.</p></div><div className="premium-static-preview">{comparisons.map((comparison) => <Link className="premium-text-link" href={`/comparisons/${comparison.id}`} key={comparison.id}>{comparison.title}<ArrowUpRight size={17} aria-hidden /></Link>)}</div></section>} />}
      {preview && <div className="premium-featured-note"><span className="editorial-eyebrow">Go a little deeper</span><p>{preview.title}</p><Link href={`/comparisons/${preview.id}`} className="premium-text-link">Explore the perspectives <ArrowUpRight size={17} aria-hidden /></Link></div>}
      {journey?.isPublished && <DeferredJourney courseSlug={journey.slug} steps={steps} fallback={<section className="premium-section" aria-labelledby="route-title"><div className="premium-section-heading"><div><p className="editorial-eyebrow">02 / Your guided journey</p><h2 id="route-title">Take the scenic route.<br /><em>Find the connections.</em></h2></div></div><ol className="premium-static-preview">{steps.map((step, i) => <li key={step.slug}><Link className="premium-text-link" href={`/learn/${journey.slug}/${step.slug}`}>{String(i + 1).padStart(2, '0')} / {step.title}<ArrowRight size={16} aria-hidden /></Link></li>)}</ol></section>} />}
      {eras.length > 0 && <DeferredEras events={eras} fallback={<section className="premium-section" aria-labelledby="era-title"><div className="premium-section-heading"><div><p className="editorial-eyebrow">03 / A world of stories</p><h2 id="era-title">Travel through<br /><em>the stories that connect us.</em></h2></div></div><div className="premium-static-preview">{eras.map((event) => <Link className="premium-text-link" href={`/timeline#${event.slug}`} key={event.slug}>{event.name}<ArrowUpRight size={17} aria-hidden /></Link>)}</div></section>} />}

      <section className="premium-section" aria-labelledby="explore-title">
        <div className="premium-section-heading"><div><p className="editorial-eyebrow">04 / Make your own connections</p><h2 id="explore-title">Follow a thread.<br /><em>See where it leads.</em></h2></div><p>People, passages, and ideas. A different way into the same extraordinary collection.</p></div>
        <div className="premium-destinations">{[
          { href: '/family-tree', title: 'Every name has a story.', subtitle: 'People & connections', image: 'kingdom', Icon: GitBranch },
          { href: '/sources', title: 'Begin with the words.', subtitle: 'Read the source texts', image: 'gospel', Icon: BookOpen },
          { href: '/learn', title: 'Let curiosity be your guide.', subtitle: 'Sourced learning journeys', image: 'exodus', Icon: Compass },
        ].map(({ href, title, subtitle, image, Icon }) => <Link key={href} href={href} className="premium-destination"><Image src={`/timeline/${image}.jpg`} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" /><div className="destination-shade" /><div className="destination-top"><Icon size={24} aria-hidden /><ArrowUpRight size={22} aria-hidden /></div><div className="destination-copy"><p>{subtitle}</p><h3>{title}</h3></div></Link>)}</div>
      </section>

      <section aria-labelledby="kids-promo-title" className="my-14 overflow-hidden rounded-3xl border-4 border-amber-300 bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 p-6 sm:p-10">
        <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-amber-900">🎈 New · For ages 6–12</p>
            <h2 id="kids-promo-title" className="mt-2 font-serif text-3xl font-bold text-slate-950 sm:text-4xl">Is a young explorer with you?</h2>
            <p className="mt-3 max-w-xl text-lg leading-8 text-slate-800">Kid-friendly stories, four colourful games, and a short video about the three books, reviewed by an editor and with no sign-in.</p>
            <Link href="/kids" className="mt-5 inline-block rounded-2xl bg-slate-950 px-6 py-3 text-lg font-bold text-white hover:bg-slate-800">Visit the kids&apos; corner →</Link>
          </div>
          <p aria-hidden="true" className="text-6xl sm:text-7xl">🧩🌳🔍</p>
        </div>
      </section>

      <section className="premium-search-section" aria-labelledby="search-title"><p className="editorial-eyebrow">There is always another question</p><h2 id="search-title">What are you<br /><em>curious about?</em></h2><form action="/search" role="search"><label className="sr-only" htmlFor="home-search">Search the site</label><Search size={23} aria-hidden /><input id="home-search" type="search" name="q" minLength={2} required placeholder="Try Abraham, prayer, or creation" /><button type="submit" aria-label="Search" className="editorial-button"><ArrowUpRight size={22} aria-hidden /></button></form>{topics.length > 0 && <div className="premium-search-suggestions"><span>Or explore</span>{topics.map((topic) => <Link href={`/themes/${topic.slug}`} key={topic.slug}>{topic.name}<ArrowUpRight size={12} aria-hidden /></Link>)}</div>}</section>
    </div>
  </div>
}
