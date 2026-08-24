import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { VerseReader } from '@/components/sources/VerseReader'
import { ScriptText } from '@/components/ui/ScriptText'
import Link from 'next/link'

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

  // The reader shows one scheme at a time. Christian numbering is the primary
  // view — it is what every claim, verse link and citation on the site uses.
  // Masoretic-numbered Hebrew, where a chapter's divisions differ, is shown
  // separately below rather than interleaved: the two number the same passage
  // differently, so mixing them would put two "verse 1"s in one list.
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
        where: { sourceId: source.id, book, versification: 'CHRISTIAN' },
        orderBy: { chapter: 'asc' },
      })
    : []

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
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

      {!book ? (
        <p className="text-stone-500">Select a book and chapter from the <Link href={`/sources/${sourceKey}`} className="underline">source page</Link>.</p>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
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

          <VerseReader verses={verses as any} />

          {masoretic.length > 0 && (
            <section className="mt-10 rounded-xl border border-jewish-200 bg-jewish-50 p-5">
              <h2 className="font-semibold text-stone-900">
                Hebrew text — Masoretic numbering
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-700">
                This chapter is divided differently in the Hebrew. The Masoretic text
                counts verses that the English translation numbers otherwise, so the verse
                numbers below do not line up with those above — they are shown separately
                rather than paired, because pairing them would assert a correspondence
                that does not hold.
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
        </>
      )}
    </div>
  )
}
