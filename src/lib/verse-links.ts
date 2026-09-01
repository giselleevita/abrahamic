/**
 * Deep links into the scripture reader.
 *
 * The reader lives at /sources/<source slug>/read?book=&chapter=, and each
 * verse row carries an id of `v-<verse number>` (see VerseReader). Claim
 * citations previously rendered as inert text, which left the reader
 * reachable only by browsing in from /sources.
 */

export type VerseRef = {
  book: string
  chapter: number
  verse: number
}

/** Anchor id for a verse row inside the reader. */
export function verseAnchorId(verse: number): string {
  return `v-${verse}`
}

/** URL of a chapter in the reader, optionally anchored to one verse. */
export function verseReaderHref(sourceSlug: string, ref: VerseRef): string {
  const params = new URLSearchParams({
    book: ref.book,
    chapter: String(ref.chapter),
  })
  return `/sources/${sourceSlug}/read?${params.toString()}#${verseAnchorId(ref.verse)}`
}

/** Human-readable citation, e.g. "Genesis 22:2". */
export function formatVerseRef(ref: VerseRef): string {
  return `${ref.book} ${ref.chapter}:${ref.verse}`
}
