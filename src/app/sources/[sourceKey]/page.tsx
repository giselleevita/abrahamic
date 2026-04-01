import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const sources = await prisma.source.findMany({ select: { slug: true } })
    return sources.map((s) => ({ sourceKey: s.slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: Promise<{ sourceKey: string }> }): Promise<Metadata> {
  const { sourceKey } = await params
  const source = await prisma.source.findUnique({ where: { slug: sourceKey }, select: { title: true } })
  if (!source) return {}
  return { title: source.title }
}

export default async function SourcePage({ params }: { params: Promise<{ sourceKey: string }> }) {
  const { sourceKey } = await params

  const source = await prisma.source.findUnique({
    where: { slug: sourceKey },
    include: { _count: { select: { verses: true } } },
  })
  if (!source) notFound()

  const books = await prisma.verse.groupBy({
    by: ['book', 'bookNumber'],
    where: { sourceId: source.id },
    orderBy: { bookNumber: 'asc' },
  })

  const chaptersByBook = await Promise.all(
    books.map(async (b) => {
      const chapters = await prisma.verse.groupBy({
        by: ['chapter'],
        where: { sourceId: source.id, book: b.book },
        orderBy: { chapter: 'asc' },
        _count: { verse: true },
      })
      return { book: b.book, bookNumber: b.bookNumber, chapters }
    })
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">{source.title}</h1>
          <Badge className={TRADITION_BG[source.tradition]}>{source.tradition}</Badge>
        </div>
        <p className="mt-1 text-sm text-stone-400">
          {source.language} · {source._count.verses} verses in database
        </p>
        {source.description && (
          <p className="mt-4 text-stone-600 leading-relaxed">{source.description}</p>
        )}
      </div>

      <div className="space-y-8">
        {chaptersByBook.map(({ book, chapters }) => (
          <div key={book}>
            <h2 className="mb-3 text-base font-semibold text-stone-800">{book}</h2>
            <div className="flex flex-wrap gap-2">
              {chapters.map(({ chapter }) => (
                <Link
                  key={chapter}
                  href={`/sources/${sourceKey}/read?book=${encodeURIComponent(book)}&chapter=${chapter}`}
                  className="rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm hover:border-stone-400 hover:bg-stone-50 transition-colors"
                >
                  {book} {chapter}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
