import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Target } from 'lucide-react'
import prisma from '@/lib/prisma'
import { ChapterItemCard } from '@/components/learn/ChapterItemCard'
import { ChapterVisitTracker } from '@/components/learn/ChapterVisitTracker'
import { CompleteStepLink } from '@/components/learn/JourneyProgress'
import { ControversialBanner } from '@/components/claims/ControversialBanner'
import { filterPublicDemoTranslations, PUBLIC_TRANSLATION_FIELDS } from '@/lib/public-demo-policy'

export const dynamic = 'force-dynamic'
type Params = Promise<{ courseSlug: string; chapterSlug: string }>

async function loadChapter(chapterSlug: string) {
  return prisma.chapter.findUnique({ where: { slug: chapterSlug }, include: { course: { include: { chapters: { where: { isPublished: true }, orderBy: { position: 'asc' }, select: { slug: true, title: true, position: true } } } }, questions: { where: { isPublished: true }, select: { id: true, isContested: true } }, items: { orderBy: { position: 'asc' }, include: { concept: { select: { slug: true, name: true, summary: true, category: true } }, comparison: { select: { id: true, title: true, summary: true, tag: true } }, figure: { select: { slug: true, canonicalName: true, description: true } }, timelineEvent: { select: { slug: true, name: true, summary: true } }, theme: { select: { slug: true, name: true, description: true } }, verse: { select: { referenceKey: true, book: true, chapter: true, verse: true, versification: true, source: { select: { key: true, title: true } }, translations: { select: PUBLIC_TRANSLATION_FIELDS, orderBy: [{ isDefault: 'desc' }, { id: 'asc' }] } } } } } } })
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> { const { chapterSlug } = await params; const chapter = await prisma.chapter.findUnique({ where: { slug: chapterSlug }, select: { title: true, summary: true } }); return chapter ? { title: chapter.title, description: chapter.summary ?? undefined } : {} }

export default async function ChapterPage({ params }: { params: Params }) {
  const { courseSlug, chapterSlug } = await params
  const chapter = await loadChapter(chapterSlug)
  if (!chapter?.isPublished || chapter.course.slug !== courseSlug) notFound()
  const steps = chapter.course.chapters
  const currentIndex = steps.findIndex((s) => s.slug === chapter.slug)
  const previous = currentIndex > 0 ? steps[currentIndex - 1] : null
  const next = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null
  const hasContested = chapter.questions.some((q) => q.isContested)
  const safeItems = chapter.items.map((item) => item.verse ? { ...item, verse: { ...item.verse, translations: filterPublicDemoTranslations(item.verse.translations) } } : item)
  const step = currentIndex + 1
  const percent = Math.round((step / steps.length) * 100)

  return <div className="editorial-page min-h-screen pb-28 lg:pb-16">
    <ChapterVisitTracker slug={chapter.slug} />
    <div className="border-b border-[#e5d9c8] bg-[#fffdf9]"><div className="mx-auto max-w-6xl px-5 py-4 sm:px-8"><div className="flex items-center justify-between gap-4"><Link href={`/learn/${courseSlug}`} className="editorial-link min-w-0 truncate text-sm">← {chapter.course.title}</Link><span className="shrink-0 text-sm font-semibold text-[#51483c]">Step {step} of {steps.length}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e9decd]" role="progressbar" aria-label="Journey progress" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-[#173b68]" style={{ width: `${percent}%` }} /></div><details className="mt-3 lg:hidden"><summary className="cursor-pointer text-sm font-semibold text-[#51483c]">View all journey steps</summary><ol className="mt-3 space-y-2">{steps.map((s, i) => <li key={s.slug}><Link href={`/learn/${courseSlug}/${s.slug}`} aria-current={s.slug === chapter.slug ? 'step' : undefined} className={`block rounded-lg px-3 py-2 text-sm ${s.slug === chapter.slug ? 'bg-[#eee2cf] font-bold text-[#242019]' : 'text-[#51483c]'}`}>{i + 1}. {s.title}</Link></li>)}</ol></details></div></div>

    <header className="border-b border-[#e5d9c8] bg-[#f3eadb]"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_0.65fr] lg:items-center"><div><p className="editorial-eyebrow">Step {step} · {chapter.estimatedMinutes ?? 3} minutes</p><h1 className="editorial-title mt-3 text-4xl sm:text-5xl">{chapter.title}</h1>{chapter.summary && <p className="mt-5 max-w-3xl text-lg leading-8 text-[#51483c]">{chapter.summary}</p>}<div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold text-[#51483c]"><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#80571b]" aria-hidden="true" /> Short guided step</span><span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#80571b]" aria-hidden="true" /> Sources included</span></div></div><figure><div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-[#d7c5ad] bg-[#173b68]"><Image src={chapter.artworkPath ?? chapter.course.artworkPath ?? '/timeline/patriarchal.jpg'} alt={chapter.artworkAlt ?? chapter.course.artworkAlt ?? ''} fill className="object-cover" sizes="(min-width:1024px) 35vw, 100vw" /></div><figcaption className="mt-2 text-xs leading-5 text-[#655a4b]">Artwork: {chapter.artworkCredit ?? chapter.course.artworkCredit ?? 'Abrahamic Texts project artwork'} · {(chapter.artworkLicense ?? chapter.course.artworkLicense) === 'PROJECT' ? 'Project-created' : chapter.artworkLicense ?? chapter.course.artworkLicense ?? 'Project-created'} · <Link href={chapter.artworkSourceUrl ?? chapter.course.artworkSourceUrl ?? '/licensing'} className="editorial-link">source and licence</Link></figcaption></figure></div></header>

    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[220px_1fr]">
      <aside className="hidden h-fit lg:sticky lg:top-24 lg:block"><p className="editorial-eyebrow mb-3">Journey steps</p><ol className="space-y-1">{steps.map((s, i) => <li key={s.slug}><Link href={`/learn/${courseSlug}/${s.slug}`} aria-current={s.slug === chapter.slug ? 'step' : undefined} className={`flex gap-3 rounded-xl px-3 py-3 text-sm focus-visible:outline-3 focus-visible:outline-[#a67222] ${s.slug === chapter.slug ? 'bg-[#eee2cf] font-bold text-[#242019]' : 'text-[#51483c] hover:bg-[#fffdf9]'}`}><span>{i + 1}</span><span>{s.title}</span></Link></li>)}</ol></aside>
      <article className="min-w-0">
        {chapter.learningObjective && <section className="editorial-card mb-8 flex gap-4 p-5"><Target className="mt-0.5 h-6 w-6 shrink-0 text-[#80571b]" aria-hidden="true" /><div><h2 className="font-bold text-[#242019]">What you’ll learn</h2><p className="mt-1 leading-7 text-[#51483c]">{chapter.learningObjective}</p></div></section>}
        {hasContested && <div className="mb-8"><ControversialBanner /></div>}
        <ol className="space-y-5">{safeItems.map((item) => <li key={item.id}><ChapterItemCard item={item} /></li>)}</ol>
        {chapter.takeaway && <section className="editorial-card mt-8 p-6"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#315526]" aria-hidden="true" /><div><h2 className="text-xl font-bold text-[#242019]">Take this with you</h2><p className="mt-2 leading-7 text-[#51483c]">{chapter.takeaway}</p></div></div></section>}
        {chapter.questions.length > 0 && <div className="editorial-card mt-8 p-6 sm:p-8"><h2 className="editorial-title text-2xl">Review the evidence</h2><p className="mt-2 max-w-2xl leading-7 text-[#51483c]">Five sourced questions ask what each tradition teaches—never which tradition is right.</p><Link href={`/learn/${courseSlug}/${chapter.slug}/quiz`} className="editorial-button mt-5">Start the final quiz <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>}
        <nav aria-label="Journey step navigation" className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#e5d9c8] pt-6">{previous ? <Link href={`/learn/${courseSlug}/${previous.slug}`} className="editorial-link inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> {previous.title}</Link> : <span />}{next ? <CompleteStepLink courseSlug={courseSlug} chapterSlug={chapter.slug} next={{ slug: next.slug, title: next.title, href: `/learn/${courseSlug}/${next.slug}` }} /> : <Link href={`/learn/${courseSlug}`} className="editorial-button">Journey overview <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}</nav>
      </article>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5d9c8] bg-[#fffdf9]/95 p-3 backdrop-blur lg:hidden"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3">{previous ? <Link href={`/learn/${courseSlug}/${previous.slug}`} aria-label={`Previous: ${previous.title}`} className="editorial-control p-3"><ArrowLeft className="h-5 w-5" /></Link> : <span />}{next ? <CompleteStepLink courseSlug={courseSlug} chapterSlug={chapter.slug} next={{ slug: next.slug, title: next.title, href: `/learn/${courseSlug}/${next.slug}` }} /> : <Link href={`/learn/${courseSlug}/${chapter.slug}/quiz`} className="editorial-button">Take quiz</Link>}</div></div>
  </div>
}
