import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sourceKey: string }> }
) {
  const { sourceKey } = await params
  const { searchParams } = req.nextUrl
  const book = searchParams.get('book')
  const chapter = searchParams.get('chapter')

  const source = await prisma.source.findUnique({
    where: { slug: sourceKey },
  })
  if (!source) return NextResponse.json({ error: 'Source not found' }, { status: 404 })

  const verses = await prisma.verse.findMany({
    where: {
      sourceId: source.id,
      ...(book ? { book } : {}),
      ...(chapter ? { chapter: parseInt(chapter) } : {}),
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
    },
    orderBy: [{ bookNumber: 'asc' }, { chapter: 'asc' }, { verse: 'asc' }],
  })

  // Get distinct books for navigation
  const books = await prisma.verse.groupBy({
    by: ['book', 'bookNumber'],
    where: { sourceId: source.id },
    orderBy: { bookNumber: 'asc' },
  })

  return NextResponse.json({ source, verses, books })
}
