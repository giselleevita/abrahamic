/** Verify the independent Masoretic corpus after a resumable Sefaria import. */
import 'dotenv/config'
import prisma from '../../src/lib/prisma'
import { TORAH_CANON } from './canon'
import { HEBREW_TANAKH_CANON } from './adapters/sefaria'

async function main() {
  let missing = 0
  let chaptersChecked = 0
  let versesChecked = 0

  for (const [sourceKey, books] of [
    ['TORAH', TORAH_CANON],
    ['HEBREW_BIBLE', HEBREW_TANAKH_CANON],
  ] as const) {
    const source = await prisma.source.findUnique({ where: { key: sourceKey }, select: { id: true } })
    if (!source) throw new Error(`Missing seeded source: ${sourceKey}`)

    for (const book of books) {
      const rows = await prisma.verse.findMany({
        where: {
          sourceId: source.id,
          book: book.book,
          versification: 'MASORETIC',
          translations: { some: { name: 'Hebrew (MT)' } },
        },
        select: { chapter: true, verse: true },
        orderBy: [{ chapter: 'asc' }, { verse: 'asc' }],
      })
      const byChapter = new Map<number, number[]>()
      for (const row of rows) {
        const verses = byChapter.get(row.chapter) ?? []
        verses.push(row.verse)
        byChapter.set(row.chapter, verses)
      }

      for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
        chaptersChecked += 1
        const verses = byChapter.get(chapter) ?? []
        if (verses.length === 0 || verses.some((verse, index) => verse !== index + 1)) {
          missing += 1
          console.error(`Incomplete: ${sourceKey} ${book.book} ${chapter}`)
        }
        versesChecked += verses.length
      }
      for (const chapter of byChapter.keys()) {
        if (chapter > book.chapters) {
          missing += 1
          console.error(`Unexpected chapter: ${sourceKey} ${book.book} ${chapter}`)
        }
      }
    }
  }

  console.log(`Hebrew: ${versesChecked} verses across ${chaptersChecked} expected chapters`)
  if (missing) throw new Error(`${missing} Hebrew chapter(s) missing, gapped, or unexpected`)
  console.log('The Masoretic corpus is complete by chapter coverage and contiguous verse numbering.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
}).finally(() => prisma.$disconnect())
