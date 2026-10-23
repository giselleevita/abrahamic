import type { PrismaClient } from '@/generated/prisma/client'
import { MOTHER_REFERENCES } from './family-policy'
import { readerNoteForVerse } from '../../src/lib/public-demo-policy'

/** Add verified citation destinations, without replacing existing scripture or editorial text. */
export async function seedFamilyReferences(prisma: PrismaClient) {
  for (const ref of MOTHER_REFERENCES) {
    const source = await prisma.source.findUnique({ where: { key: ref.source }, select: { id: true } })
    if (!source) continue
    await prisma.verse.upsert({
      where: { sourceId_book_chapter_verse_versification: { sourceId: source.id, book: ref.book, chapter: ref.chapter, verse: ref.verse, versification: 'CHRISTIAN' } }, update: {},
      create: {
        sourceId: source.id, book: ref.book, bookNumber: ref.book === 'Genesis' ? 1 : 3,
        chapter: ref.chapter, verse: ref.verse, referenceKey: `${ref.source}.${ref.book}.${ref.chapter}.${ref.verse}`,
        translations: { create: { name: 'Reader note (original)', label: 'MODERN', licenseCode: 'PROJECT', isDefault: true, text: readerNoteForVerse({ sourceKey: ref.source, ...ref }) } },
      },
    })
  }
  // The content migration may run before the small demo has these references.
  for (const ref of MOTHER_REFERENCES) {
    const verse = await prisma.verse.findFirst({ where: { source: { key: ref.source }, book: ref.book, chapter: ref.chapter, verse: ref.verse, versification: 'CHRISTIAN' }, select: { id: true } })
    if (!verse) continue
    await prisma.figureRelation.updateMany({ where: { relationType: 'PARENT', fromFigure: { slug: ref.from }, toFigure: { slug: ref.to }, notes: `${ref.note} Recorded reference: ${ref.book} ${ref.chapter}:${ref.verse}.` }, data: { verseId: verse.id } })
  }
}
