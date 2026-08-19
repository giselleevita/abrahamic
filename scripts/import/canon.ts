/**
 * Canonical verse counts.
 *
 * An import is not "done" because it exited zero — the upstream service
 * rate-limits, and a run can lose whole chapters while reporting no errors. The
 * only way to know a book is complete is to compare against a known total, so
 * those totals live here as data rather than in someone's memory.
 *
 * Counts follow the Masoretic verse divisions for the Hebrew Bible and the
 * standard divisions for the New Testament. Different traditions divide some
 * verses differently; where a source uses another division these numbers are
 * the wrong yardstick and should be adjusted per source rather than fudged.
 */

export interface CanonBook {
  book: string
  bookNumber: number
  chapters: number
  verses: number
}

export const TORAH_CANON: CanonBook[] = [
  { book: 'Genesis',     bookNumber: 1, chapters: 50, verses: 1533 },
  { book: 'Exodus',      bookNumber: 2, chapters: 40, verses: 1213 },
  { book: 'Leviticus',   bookNumber: 3, chapters: 27, verses: 859 },
  { book: 'Numbers',     bookNumber: 4, chapters: 36, verses: 1288 },
  { book: 'Deuteronomy', bookNumber: 5, chapters: 34, verses: 959 },
]

export const GOSPEL_CANON: CanonBook[] = [
  { book: 'Matthew', bookNumber: 40, chapters: 28, verses: 1071 },
  { book: 'Mark',    bookNumber: 41, chapters: 16, verses: 678 },
  { book: 'Luke',    bookNumber: 42, chapters: 24, verses: 1151 },
  { book: 'John',    bookNumber: 43, chapters: 21, verses: 879 },
]

export const CANON_BY_SOURCE: Record<string, CanonBook[]> = {
  TORAH: TORAH_CANON,
  NEW_TESTAMENT: GOSPEL_CANON,
}

export const TORAH_TOTAL = TORAH_CANON.reduce((n, b) => n + b.verses, 0)
export const GOSPEL_TOTAL = GOSPEL_CANON.reduce((n, b) => n + b.verses, 0)
