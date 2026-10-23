/**
 * Parses a human citation such as "Genesis 12:1", "Genesis 12:1-3" or "2:255" (Qur'an).
 *
 * Contributors cite passages as text; the server resolves each to verse rows inside the claim's
 * own source, so a citation can never point at a different corpus than the claim describes.
 */
export const MAX_RANGE = 10

export type ParsedRef = {
  /** Book name as typed; undefined when only "chapter:verse" was given. */
  book?: string
  chapter: number
  from: number
  to: number
}

const PATTERN = /^(?:(.+?)\s+)?(\d{1,3}):(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?$/

export function parseReference(input: string): ParsedRef | null {
  const match = PATTERN.exec(input.trim().replace(/\s+/g, ' '))
  if (!match) return null
  const [, book, chapter, from, to] = match
  const start = Number(from)
  const end = to === undefined ? start : Number(to)
  if (Number(chapter) < 1 || start < 1 || end < start || end - start + 1 > MAX_RANGE) return null
  return { book: book?.trim() || undefined, chapter: Number(chapter), from: start, to: end }
}

/** Verse numbers a parsed reference covers. */
export function versesIn(ref: ParsedRef): number[] {
  return Array.from({ length: ref.to - ref.from + 1 }, (_, i) => ref.from + i)
}
