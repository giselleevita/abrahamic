import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { VerseReader } from '@/components/sources/VerseReader'
import { ScriptText } from '@/components/ui/ScriptText'
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
  const currentBook = bookOptions.find((item) => item.book === book)?.book ?? bookOptions[0]?.book
  const reportTitle = `Source correction: ${source.title}${book ? ` — ${book} ${activeChapter}` : ''}`
  const reportBody = `Source: ${source.title}\nPassage: ${book ? `${book} ${activeChapter}` : 'Please add the passage'}\nPage: https://abrahamic.vercel.app/sources/${encodeURIComponent(sourceKey)}/read${book ? `?book=${encodeURIComponent(book)}&chapter=${activeChapter}` : ''}\n\nWhat appears incorrect?\n\nWhat source supports the correction?\n`
  const reportHref = `https://github.com/giselleevita/abrahamic/issues/new?title=${encodeURIComponent(reportTitle)}&body=${encodeURIComponent(reportBody)}`

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-stone-500">
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
          <div className="mb-6 mt-8 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-stone-900">{book} {activeChapter}</h1>
            <div className="flex gap-2 text-xs">
              {chapterNum && chapterNum > (allChapters[0]?.chapter ?? 1) && (
                <Link
                  href={`/sources/${sourceKey}/read?book=${encodeURIComponent(book)}&chapter=${chapterNum - 1}`}
                  className="rounded border border-stone-200 bg-white px-2.5 py-1 hover:bg-stone-50"
                >
                  ← {chapterNum - 1}
                </Link>
              )}
              {chapterNum && chapterNum < (allChapters[allChapters.length - 1]?.chapter ?? 1) && (
                <Link
                  href={`/sources/${sourceKey}/read?book=${encodeURIComponent(book)}&chapter=${chapterNum + 1}`}
                  className="rounded border border-stone-200 bg-white px-2.5 py-1 hover:bg-stone-50"
                >
                  {chapterNum + 1} →
                </Link>
              )}
            </div>
          </div>

          {masoretic.length > 0 && <nav aria-label="Editions on this page" className="mb-6 flex flex-wrap gap-2 text-sm"><a href="#translated-edition" className="rounded-full border border-stone-300 bg-white px-4 py-2 font-semibold text-stone-800 hover:bg-stone-50">Translated edition</a><a href="#hebrew-edition" className="rounded-full border border-jewish-200 bg-jewish-50 px-4 py-2 font-semibold text-stone-800 hover:bg-jewish-100">Hebrew edition ↓</a></nav>}
          {verses.length > 0 ? <section id="translated-edition" className="scroll-mt-24"><p className="mb-4 text-sm leading-relaxed text-stone-600">Read one edition at a time, or compare editions of this same numbered passage. Linked passages from other traditions are references, not equivalent translations.</p><VerseReader verses={filterVersesWithTranslations(verses) as any} /></section> : <p id="translated-edition" className="rounded-xl bg-stone-50 p-4 text-sm text-stone-700">No translated verses are available for this chapter in the current numbering. The Hebrew edition may use a different chapter division.</p>}

          {masoretic.length > 0 && (
            <section id="hebrew-edition" className="mt-10 scroll-mt-24 rounded-xl border border-jewish-200 bg-jewish-50 p-5">
              <h2 className="font-semibold text-stone-900">
                Hebrew text — Masoretic numbering
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-700">
                This is the complete Hebrew edition in its own traditional numbering.
                Some chapters and verses differ from the English division above, so the
                two editions are shown separately rather than paired without a verified mapping.
              </p>
              <ol className="mt-4 space-y-2">
                {masoretic.map((v) => {
                  const text = v.translations[0]?.text
                  if (!text) return null
                  return (
                    <li key={v.id} className="flex gap-3">
                      <span className="w-8 shrink-0 pt-0.5 text-right font-mono text-xs text-stone-500">
                        {v.verse}
                      </span>
                      <ScriptText text={text} className="flex-1 leading-relaxed text-stone-800" />
                    </li>
                  )
                })}
              </ol>
            </section>
          )}

          <nav aria-label="Continue reading" className="mt-8 flex flex-wrap justify-between gap-3 border-t border-stone-200 pt-6 text-sm font-semibold">
            {chapterNum > (allChapters[0]?.chapter ?? 1) ? <Link href={`/sources/${sourceKey}/read?book=${encodeURIComponent(book)}&chapter=${chapterNum - 1}`} className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-50">← Previous chapter</Link> : <span />}
            {chapterNum < (allChapters[allChapters.length - 1]?.chapter ?? 1) ? <Link href={`/sources/${sourceKey}/read?book=${encodeURIComponent(book)}&chapter=${chapterNum + 1}`} className="rounded-lg bg-stone-900 px-4 py-2 text-white hover:bg-stone-700">Next chapter →</Link> : <span />}
          </nav>
        </>
      )}

      <aside className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
        <h2 className="font-semibold text-stone-900">Keep exploring or suggest a correction</h2>
        <p className="mt-1 text-sm leading-relaxed text-stone-700">Our <Link href="/learn" className="font-semibold text-blue-800 underline underline-offset-2">guided journeys</Link> explain context and cite their sources. If a passage, label, or explanation seems wrong, please <a href={reportHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-800 underline underline-offset-2">report a source issue</a>. The report opens on GitHub and requires a free GitHub account.</p>
      </aside>
    </div>
  )
}
