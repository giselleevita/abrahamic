import { PassageFocus } from '@/components/sources/PassageFocus'
import { CorrectionForm } from '@/components/corrections/CorrectionForm'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { VerseReader } from '@/components/sources/VerseReader'
import { filterVersesWithTranslations } from '@/lib/filter-public-translations'
import Link from 'next/link'
import { ReaderNavigation } from '@/components/sources/ReaderNavigation'

// Cached content. Editors' changes appear immediately: mutating routes
// invalidate the matching tag via revalidateContent().
export const revalidate = 3600

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ sourceKey: string }>
  searchParams: Promise<{ book?: string; chapter?: string }>
}): Promise<Metadata> {
  const { sourceKey } = await params
  const { book, chapter } = await searchParams
  const source = await prisma.source.findUnique({ where: { slug: sourceKey }, select: { title: true } })
  if (!source) return {}
  return { title: book ? `${book} ${chapter ?? 1} — ${source.title}` : source.title }
}

export default async function VerseReaderPage({
  params,
  searchParams,
}: {
  params: Promise<{ sourceKey: string }>
  searchParams: Promise<{ book?: string; chapter?: string }>
}) {
  const { sourceKey } = await params
  const { book, chapter } = await searchParams

  const source = await prisma.source.findUnique({ where: { slug: sourceKey } })
  if (!source) notFound()

  // A book request with no chapter used to load the *entire* book — 1,533
  // verses for Genesis, each with its translations and verse links, against 31
  // for a single chapter. Harmless when the corpus was 94 verses; a 49x payload
  // now. Defaulting to chapter 1 is also the better reading experience: opening
  // a book should land you at its beginning, not dump it in one page.
  const requestedChapter = chapter ? Number.parseInt(chapter, 10) : 1
  const activeChapter = Number.isFinite(requestedChapter) && requestedChapter > 0
    ? requestedChapter
    : 1

  // Christian numbering is the primary view used by existing citations.
  // The full Hebrew edition keeps its own Masoretic numbering below; matching
  // verse numbers alone do not prove that two texts divide a passage alike.
  const verses = book
    ? await prisma.verse.findMany({
        where: {
          sourceId: source.id,
          book,
          chapter: activeChapter,
          versification: 'CHRISTIAN',
        },
        include: {
          translations: true,
          linksAsA: {
            include: {
              verseB: {
                include: {
                  source: true,
                  translations: { where: { isDefault: true } },
                },
              },
            },
          },
          linksAsB: {
            include: {
              verseA: {
                include: {
                  source: true,
                  translations: { where: { isDefault: true } },
                },
              },
            },
          },
        },
        orderBy: [{ chapter: 'asc' }, { verse: 'asc' }],
      })
    : []

  const masoretic = book
    ? await prisma.verse.findMany({
        where: {
          sourceId: source.id,
          book,
          chapter: activeChapter,
          versification: 'MASORETIC',
        },
        include: { translations: true },
        orderBy: { verse: 'asc' },
      })
    : []

  // Navigation: prev/next chapter
  // Always a real chapter now, so prev/next navigation works on a bare book
  // link too — previously it silently disappeared without a ?chapter param.
  const chapterNum = activeChapter
  const allChapters = book
    ? await prisma.verse.groupBy({
        by: ['chapter'],
        where: { sourceId: source.id, book },
        orderBy: { chapter: 'asc' },
      })
    : []

  const bookChapters = await prisma.verse.groupBy({
    by: ['book', 'bookNumber', 'chapter'],
    where: { sourceId: source.id },
    orderBy: [{ bookNumber: 'asc' }, { chapter: 'asc' }],
  })
  const bookOptions = Array.from(bookChapters.reduce((byBook, item) => {
    const chapters = byBook.get(item.book) ?? []
    chapters.push(item.chapter)
    byBook.set(item.book, chapters)
    return byBook
  }, new Map<string, number[]>()), ([bookName, chapters]) => ({ book: bookName, chapters }))
  const selectedBook = bookOptions.find((item) => item.book === book)
  if (book && (!selectedBook || !selectedBook.chapters.includes(activeChapter))) notFound()
  const currentBook = selectedBook?.book ?? bookOptions[0]?.book
  const reportPath = `/sources/${sourceKey}/read${book ? `?${new URLSearchParams({ book, chapter: String(activeChapter) })}` : ''}`

  return (
    <div className="editorial-page min-h-screen px-4 py-10 sm:px-6"><PassageFocus key={reportPath} /><div className="mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#655a4b]">
        <Link href="/sources" className="hover:text-stone-700">Sources</Link>
        <span>/</span>
        <Link href={`/sources/${sourceKey}`} className="hover:text-stone-700">{source.title}</Link>
        {book && (
          <>
            <span>/</span>
            <span className="text-stone-900">{book} {activeChapter}</span>
          </>
        )}
      </nav>

      {currentBook && <ReaderNavigation sourceKey={sourceKey} books={bookOptions} currentBook={currentBook} currentChapter={currentBook === book ? activeChapter : 1} />}

      {!book ? (
        <p className="mt-6 text-stone-600">Choose a book and chapter above to begin reading.</p>
      ) : (
        <>
          <div className="mb-6 mt-8 flex flex-wrap items-center justify-between gap-4">
            <div><p className="editorial-eyebrow">{source.title} · Reader</p><h1 className="editorial-title mt-2 text-4xl">{book} {activeChapter}</h1></div>
            <div className="flex gap-2 text-xs">
              {chapterNum && chapterNum > (allChapters[0]?.chapter ?? 1) && (
                <Link
                  href={`/sources/${sourceKey}/read?book=${encodeURIComponent(book)}&chapter=${chapterNum - 1}`}
                  className="editorial-control px-3 py-2 font-semibold"
                >
                  ← {chapterNum - 1}
                </Link>
              )}
              {chapterNum && chapterNum < (allChapters[allChapters.length - 1]?.chapter ?? 1) && (
                <Link
                  href={`/sources/${sourceKey}/read?book=${encodeURIComponent(book)}&chapter=${chapterNum + 1}`}
                  className="editorial-control px-3 py-2 font-semibold"
                >
                  {chapterNum + 1} →
                </Link>
              )}
            </div>
          </div>

          {masoretic.length > 0 && <nav aria-label="Editions on this page" className="mb-6 flex flex-wrap gap-2 text-sm"><a href="#translated-edition" className="editorial-control px-4 py-2 font-semibold">Translated edition</a><a href="#hebrew-edition" className="editorial-control px-4 py-2 font-semibold">Hebrew edition ↓</a></nav>}
          {verses.length > 0 ? <section id="translated-edition" className="editorial-card scroll-mt-24 p-5 sm:p-7"><h2 className="editorial-title mb-2 text-2xl">Available editions</h2><p className="mb-6 text-sm leading-relaxed text-[#51483c]">Compare editions of this same numbered passage. Linked passages from other traditions are references, not equivalent translations.</p><VerseReader key={`${sourceKey}:${book}:${activeChapter}`} sourceSlug={source.slug} sourceTitle={source.title} verses={filterVersesWithTranslations(verses) as any} /></section> : <p id="translated-edition" className="editorial-card p-5 text-sm text-[#51483c]">No translated verses are available for this chapter in the current numbering. The Hebrew edition may use a different chapter division.</p>}

          {masoretic.length > 0 && (
            <section id="hebrew-edition" className="editorial-card mt-10 scroll-mt-24 p-5 sm:p-7">
              <h2 className="editorial-title text-2xl">
                Hebrew text — Masoretic numbering
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-700">
                This is the complete Hebrew edition in its own traditional numbering.
                Some chapters and verses differ from the English division above, so the
                two editions are shown separately rather than paired without a verified mapping.
              </p>
              <div className="mt-5"><VerseReader key={`hebrew:${sourceKey}:${book}:${activeChapter}`} sourceSlug={source.slug} sourceTitle={`${source.title} · Masoretic numbering`} verses={filterVersesWithTranslations(masoretic).map((verse) => ({ ...verse, linksAsA: [], linksAsB: [] }))} /></div>
            </section>
          )}

          <nav aria-label="Continue reading" className="mt-8 flex flex-wrap justify-between gap-3 border-t border-stone-200 pt-6 text-sm font-semibold">
            {chapterNum > (allChapters[0]?.chapter ?? 1) ? <Link href={`/sources/${sourceKey}/read?book=${encodeURIComponent(book)}&chapter=${chapterNum - 1}`} className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-50">← Previous chapter</Link> : <span />}
            {chapterNum < (allChapters[allChapters.length - 1]?.chapter ?? 1) ? <Link href={`/sources/${sourceKey}/read?book=${encodeURIComponent(book)}&chapter=${chapterNum + 1}`} className="editorial-button">Next chapter →</Link> : <span />}
          </nav>
        </>
      )}

      <aside className="editorial-card mt-10 p-5">
        <h2 className="font-semibold text-stone-900">Keep exploring or suggest a correction</h2>
        <p className="mt-1 text-sm leading-relaxed text-[#51483c]">Our <Link href="/learn" className="editorial-link">guided journeys</Link> explain context and cite their sources. If a passage, label, or explanation seems wrong, share the details with our editorial team below.</p>
      </aside>
      <CorrectionForm pagePath={reportPath} reference={book ? `${source.title} · ${book} ${activeChapter}` : source.title} />
    </div></div>
  )
}
