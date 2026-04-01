import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ figures: [], themes: [], claims: [], verses: [] })
  }

  const search = { contains: q, mode: 'insensitive' as const }

  const [figures, themes, claims, verses] = await Promise.all([
    prisma.figure.findMany({
      where: {
        OR: [
          { canonicalName: search },
          { aliases: { some: { name: search } } },
          { description: search },
        ],
      },
      include: { aliases: true, _count: { select: { claims: true } } },
      take: 5,
    }),
    prisma.theme.findMany({
      where: { OR: [{ name: search }, { description: search }] },
      include: { _count: { select: { claims: true } } },
      take: 5,
    }),
    prisma.claim.findMany({
      where: {
        isPublished: true,
        OR: [{ statement: search }, { notes: search }],
      },
      include: {
        source: true,
        verses: {
          where: { isPrimary: true },
          include: {
            verse: { include: { translations: { where: { isDefault: true } } } },
          },
        },
      },
      take: 10,
    }),
    prisma.verse.findMany({
      where: {
        translations: { some: { text: search } },
      },
      include: {
        source: true,
        translations: { where: { isDefault: true } },
      },
      take: 5,
    }),
  ])

  return NextResponse.json({ figures, themes, claims, verses })
}
