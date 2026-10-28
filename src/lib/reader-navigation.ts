export type BookChapterRow = { book: string; bookNumber: number | null; chapter: number }
export type BookOption = { book: string; chapters: number[]; bookNumber: number }

/** Merge duplicate imported book metadata and sort each book's available chapters. */
export function buildBookOptions(rows: BookChapterRow[]): BookOption[] {
  const groups = new Map<string, { book: string; bookNumber: number; chapters: Set<number> }>()
  for (const row of rows) {
    const label = row.book.trim()
    const bookNumber = row.bookNumber ?? Number.MAX_SAFE_INTEGER
    const key = label.toLocaleLowerCase('en-US')
    const existing = groups.get(key)
    if (existing) {
      if (bookNumber < existing.bookNumber) {
        existing.bookNumber = bookNumber
        existing.book = label
      }
      existing.chapters.add(row.chapter)
    } else {
      groups.set(key, { book: label, bookNumber, chapters: new Set([row.chapter]) })
    }
  }
  return [...groups.values()]
    .sort((a, b) => a.bookNumber - b.bookNumber || a.book.localeCompare(b.book))
    .map(({ book, bookNumber, chapters }) => ({ book, bookNumber, chapters: [...chapters].sort((a, b) => a - b) }))
}
