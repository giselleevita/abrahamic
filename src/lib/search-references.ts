import prisma from '@/lib/prisma'
import { verseReaderHref } from '@/lib/verse-links'
import { filterPublicDemoTranslations } from '@/lib/public-demo-policy'
import type { SearchOptions } from '@/lib/search-options'

export function parseReference(query: string) {
  const match = /^(.*?)\s+(\d{1,3}):(\d{1,3})$/u.exec(query.trim())
  if (!match || !Number(match[2]) || !Number(match[3])) return null
  const book = match[1].trim()
  if (!book || book.length > 80) return null
  return { book, chapter: Number(match[2]), verse: Number(match[3]), quran: /^(qur['’]?an|koran)$/i.test(book) }
}
export async function exactPassages(query: string, filters: SearchOptions = {}) {
  const ref = parseReference(query)
  if (!ref || (filters.type && filters.type !== 'verses')) return []
  if (ref.quran && filters.source && filters.source !== 'QURAN') return []
  const rows = await prisma.verse.findMany({
    where: {
      chapter: ref.chapter, verse: ref.verse,
      ...(!ref.quran ? { book: { equals: ref.book, mode: 'insensitive' as const } } : {}),
      source: { ...(filters.source ? { key: filters.source } : ref.quran ? { key: 'QURAN' as const } : {}), ...(filters.tradition ? { tradition: filters.tradition } : {}) },
    },
    select: { id: true, book: true, chapter: true, verse: true, versification: true, source: { select: { slug: true, title: true } }, translations: { select: { name: true, licenseCode: true }, orderBy: [{ isDefault: 'desc' }, { name: 'asc' }] } },
    orderBy: [{ sourceId: 'asc' }, { versification: 'asc' }], take: 20,
  })
  return rows.map((row) => ({
    href: verseReaderHref(row.source.slug, row),
    label: `${row.source.title} · ${row.book} ${row.chapter}:${row.verse}`,
    numbering: row.versification === 'MASORETIC' ? 'Masoretic numbering' : 'Chapter and verse numbering',
    editions: filterPublicDemoTranslations(row.translations).map((t) => t.name),
  }))
}
