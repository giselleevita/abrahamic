import prisma from '@/lib/prisma'
import { parseReference, versesIn } from '@/lib/verse-ref'

export type ResolveResult = { ok: true; verseIds: number[] } | { ok: false; error: string }

/**
 * Turns typed citations into verse ids INSIDE the claim's own source, so a proposal can never
 * cite a different corpus than the one it claims to describe. Fails with a message naming the
 * citation that could not be resolved, so the contributor can fix it.
 */
export async function resolveReferences(sourceId: number, references: readonly string[]): Promise<ResolveResult> {
  const ids = new Set<number>()
  for (const text of references) {
    const ref = parseReference(text)
    if (!ref) return { ok: false, error: `"${text}" is not a citation we can read. Use a form like "Genesis 12:1" or "Genesis 12:1-3".` }

    const rows = await prisma.verse.findMany({
      where: {
        sourceId,
        chapter: ref.chapter,
        verse: { in: versesIn(ref) },
        ...(ref.book ? { book: { equals: ref.book, mode: 'insensitive' as const } } : {}),
      },
      select: { id: true, book: true, verse: true },
      orderBy: { id: 'asc' },
    })

    if (!ref.book && new Set(rows.map((row) => row.book)).size > 1) {
      return { ok: false, error: `"${text}" matches more than one book. Include the book name.` }
    }
    // One row per verse number: a verse may exist under two versifications.
    const byVerse = new Map<number, number>()
    for (const row of rows) if (!byVerse.has(row.verse)) byVerse.set(row.verse, row.id)
    const missing = versesIn(ref).filter((verse) => !byVerse.has(verse))
    if (missing.length > 0) {
      return { ok: false, error: `We could not find ${text} in that source${missing.length < versesIn(ref).length ? ` (missing verse ${missing.join(', ')})` : ''}.` }
    }
    for (const id of byVerse.values()) ids.add(id)
  }
  return { ok: true, verseIds: [...ids] }
}
