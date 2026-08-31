import Link from 'next/link'
import { ArrowRight, BookOpen, Clock3, GitCompareArrows, Search, Users } from 'lucide-react'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const START_HERE = [
  { href: '/figures', title: 'Explore people', description: 'Find Abraham, Moses, Jesus, Muhammad, and other key figures across the three traditions.', action: 'Browse people', icon: Users, accent: 'bg-blue-50 text-blue-800 border-blue-100' },
  { href: '/comparisons', title: 'Compare beliefs', description: 'See similarities and differences side by side, with sources clearly attached.', action: 'View comparisons', icon: GitCompareArrows, accent: 'bg-violet-50 text-violet-800 border-violet-100' },
  { href: '/sources', title: 'Read the sources', description: 'Go directly to the Torah, Hebrew Bible, New Testament, Quran, and related texts.', action: 'Choose a source', icon: BookOpen, accent: 'bg-emerald-50 text-emerald-800 border-emerald-100' },
  { href: '/timeline', title: 'Follow the story', description: 'Move through major people and events in chronological order, from creation onward.', action: 'Open timeline', icon: Clock3, accent: 'bg-amber-50 text-amber-900 border-amber-100' },
]

export default async function HomePage() {
  const [figures, themes, comparisons, figureCount, comparisonCount, conceptCount, timelineCount] = await Promise.all([
    prisma.figure.findMany({ orderBy: { canonicalName: 'asc' }, take: 8 }),
    prisma.theme.findMany({ orderBy: { name: 'asc' }, take: 10 }),
    prisma.comparison.findMany({ where: { isPublished: true }, select: { id: true, title: true, summary: true }, orderBy: { createdAt: 'asc' }, take: 3 }),
    prisma.figure.count(),
    prisma.comparison.count({ where: { isPublished: true } }),
    prisma.concept.count({ where: { isPublished: true } }),
    prisma.timelineEvent.count({ where: { isPublished: true } }),
  ])

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-blue-700">A clear guide to three traditions</p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">Understand Judaism, Christianity, and Islam—side by side.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">Find a person, belief, event, or scripture passage. We organise the evidence so you can learn without already knowing specialist terms.</p>
            <form action="/search" role="search" className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <label htmlFor="home-search" className="sr-only">Search the whole site</label>
              <div className="relative flex-1">
                <Search aria-hidden="true" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input id="home-search" name="q" type="search" minLength={2} placeholder="Try “Abraham”, “prayer”, or “creation”" className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base text-slate-950 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
              </div>
              <button type="submit" className="h-14 rounded-xl bg-blue-700 px-7 text-base font-bold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200">Search</button>
            </form>
            <p className="mt-3 text-sm text-slate-500">No account needed. Every comparison links back to its source.</p>
          </div>
          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="text-2xl font-bold text-slate-950">New here? Start in 3 steps</h2>
            <ol className="mt-6 space-y-5">
              {[
                ['1', 'Choose what interests you', 'A person, topic, scripture, or point in history.'],
                ['2', 'See each tradition clearly', 'Views are labelled and placed next to one another.'],
                ['3', 'Check the evidence', 'Follow citations to the original source and reader notes.'],
              ].map(([number, title, text]) => <li key={number} className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">{number}</span><div><p className="font-bold text-slate-900">{title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div></li>)}
            </ol>
          </aside>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <section aria-labelledby="start-heading">
          <p className="text-sm font-bold text-blue-700">START HERE</p>
          <h2 id="start-heading" className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">What would you like to do?</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {START_HERE.map(({ href, title, description, action, icon: Icon, accent }) => <Link key={href} href={href} className="group flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100"><span className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accent}`}><Icon className="h-6 w-6" aria-hidden="true" /></span><h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 flex-1 text-base leading-7 text-slate-600">{description}</p><span className="mt-5 inline-flex items-center gap-2 font-bold text-blue-700">{action}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" /></span></Link>)}
          </div>
        </section>

        <section className="mt-16 grid gap-8 rounded-3xl bg-slate-900 p-7 text-white sm:p-10 lg:grid-cols-[0.65fr_1.35fr]" aria-labelledby="library-heading">
          <div><p className="text-sm font-bold text-blue-300">THE LIBRARY</p><h2 id="library-heading" className="mt-2 text-3xl font-bold text-white">A lot to explore, clearly organised.</h2><p className="mt-4 leading-7 text-slate-300">Use the guided routes above or jump straight into the full collection.</p></div>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[[figureCount, 'people', '/figures'], [comparisonCount, 'comparisons', '/comparisons'], [conceptCount, 'beliefs & concepts', '/concepts'], [timelineCount, 'timeline events', '/timeline']].map(([value, label, href]) => <Link key={label} href={href as string} className="rounded-2xl border border-slate-700 bg-slate-800 p-5 transition hover:border-blue-400 hover:bg-slate-700"><dt className="text-sm leading-5 text-slate-300">{label}</dt><dd className="mt-2 text-3xl font-bold text-white">{value}</dd></Link>)}
          </dl>
        </section>

        <section className="mt-16 grid gap-12 lg:grid-cols-2">
          <div aria-labelledby="people-heading"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-blue-700">PEOPLE</p><h2 id="people-heading" className="mt-2 text-3xl font-bold text-slate-950">Popular figures</h2></div><Link href="/figures" className="font-bold text-blue-700 hover:text-blue-900">View all</Link></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{figures.map((figure) => <Link key={figure.slug} href={`/figures/${figure.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 text-center font-bold text-slate-900 shadow-sm hover:border-blue-300 hover:text-blue-800">{figure.canonicalName}</Link>)}</div></div>
          <div aria-labelledby="topics-heading"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-blue-700">TOPICS</p><h2 id="topics-heading" className="mt-2 text-3xl font-bold text-slate-950">Browse by theme</h2></div><Link href="/themes" className="font-bold text-blue-700 hover:text-blue-900">View all</Link></div><div className="mt-6 flex flex-wrap gap-3">{themes.map((theme) => <Link key={theme.slug} href={`/themes/${theme.slug}`} className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-900">{theme.name}</Link>)}</div></div>
        </section>

        {comparisons.length > 0 && <section className="mt-16" aria-labelledby="comparison-heading"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-blue-700">SIDE BY SIDE</p><h2 id="comparison-heading" className="mt-2 text-3xl font-bold text-slate-950">Featured comparisons</h2></div><Link href="/comparisons" className="font-bold text-blue-700 hover:text-blue-900">View all</Link></div><div className="mt-6 grid gap-5 md:grid-cols-3">{comparisons.map((comparison) => <Link key={comparison.id} href={`/comparisons/${comparison.id}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md"><span className="text-xs font-bold uppercase tracking-wider text-blue-700">Comparison</span><h3 className="mt-3 text-xl font-bold text-slate-950 group-hover:text-blue-800">{comparison.title}</h3>{comparison.summary && <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{comparison.summary}</p>}<span className="mt-5 inline-flex items-center gap-2 font-bold text-blue-700">Open comparison <ArrowRight className="h-4 w-4" /></span></Link>)}</div></section>}
      </main>
    </div>
  )
}
