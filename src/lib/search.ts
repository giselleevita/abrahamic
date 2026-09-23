import prisma from '@/lib/prisma'
import { filterPublicDemoTranslations } from '@/lib/public-demo-policy'
import type { SourceKey, ConceptCategory, TimelineEra, Tradition } from '@/generated/prisma/client'

/**
 * Ranked full-text search.
 *
 * Replaces `ILIKE '%q%'` across six unindexed tables. That approach could not
 * survive the corpus: a rare or absent term forced a full sequential scan
 * (~55ms at the database, 61–111ms end-to-end at 37k rows), and results came
 * back in arbitrary order because there was nothing to rank by.
 *
 * Queries run against generated tsvector columns with GIN indexes, so the same
 * absent-term query costs ~0.2ms. Short names (figures, themes) use trigram
 * similarity instead, which also tolerates the misspellings people actually
 * type for names like "Melchizedek".
 */

export interface VerseHit {
  id: number
  referenceKey: string
  book: string
  chapter: number
  verse: number
  sourceKey: SourceKey
  sourceTitle: string
  translationName: string
  text: string
  rank: number
}

export interface ClaimHit {
  id: number
  statement: string
  sourceKey: SourceKey
  sourceTitle: string
  rank: number
}

export interface FigureHit {
  slug: string
  canonicalName: string
  similarity: number
}

export interface ThemeHit {
  slug: string
  name: string
  similarity: number
}

export interface ConceptHit {
  slug: string
  name: string
  category: ConceptCategory
  summary: string | null
  rank: number
}

export interface TimelineHit {
  slug: string
  name: string
  era: TimelineEra
  summary: string | null
  rank: number
}

export interface SearchResults {
  verses: VerseHit[]
  claims: ClaimHit[]
  figures: FigureHit[]
  themes: ThemeHit[]
  concepts: ConceptHit[]
  timelineEvents: TimelineHit[]
  total: number
}

/** Minimum trigram similarity for a name to count as a match. */
const NAME_SIMILARITY_FLOOR = 0.25

const EMPTY: SearchResults = {
  verses: [], claims: [], figures: [], themes: [], concepts: [], timelineEvents: [], total: 0,
}

/**
 * `websearch_to_tsquery` is used rather than `plainto_tsquery` because it
 * accepts what people actually type — quoted phrases, OR, and leading minus for
 * exclusion — and, importantly, never throws on malformed input the way
 * `to_tsquery` does.
 */
export async function search(rawQuery: string, limit = 10): Promise<SearchResults> {
  const query = rawQuery.trim()
  if (query.length < 2) return EMPTY

  const [verses, claims, figures, themes, concepts, timelineEvents] = await Promise.all([
    prisma.$queryRaw<VerseHit[]>`
      SELECT
        v.id,
        v."referenceKey" AS "referenceKey",
        v.book, v.chapter, v.verse,
        s.key  AS "sourceKey",
        s.title AS "sourceTitle",
        t.name AS "translationName",
        t.text,
        ts_rank(t.search_vector, websearch_to_tsquery('english', ${query})) AS rank
      FROM verse_translations t
      JOIN verses  v ON v.id = t."verseId"
      JOIN sources s ON s.id = v."sourceId"
      WHERE t.search_vector @@ websearch_to_tsquery('english', ${query})
      ORDER BY rank DESC, v."sourceId", v.book, v.chapter, v.verse
      LIMIT ${limit}
    `,

    prisma.$queryRaw<ClaimHit[]>`
      SELECT
        c.id, c.statement,
        s.key   AS "sourceKey",
        s.title AS "sourceTitle",
        ts_rank(c.search_vector, websearch_to_tsquery('english', ${query})) AS rank
      FROM claims c
      JOIN sources s ON s.id = c."sourceId"
      WHERE c."isPublished" = true
        AND c.search_vector @@ websearch_to_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `,

    // Trigram rather than FTS: these are short proper nouns, and users misspell
    // them. similarity() also gives a usable ordering that FTS would not.
    prisma.$queryRaw<FigureHit[]>`
      SELECT DISTINCT ON (f.slug)
        f.slug, f."canonicalName" AS "canonicalName",
        GREATEST(
          similarity(f."canonicalName", ${query}),
          COALESCE(MAX(similarity(a.name, ${query})) OVER (PARTITION BY f.id), 0)
        ) AS similarity
      FROM figures f
      LEFT JOIN figure_aliases a ON a."figureId" = f.id
      WHERE f."canonicalName" % ${query} OR a.name % ${query}
      ORDER BY f.slug, similarity DESC
      LIMIT ${limit}
    `,

    prisma.$queryRaw<ThemeHit[]>`
      SELECT slug, name, similarity(name, ${query}) AS similarity
      FROM themes
      WHERE name % ${query}
      ORDER BY similarity DESC
      LIMIT ${limit}
    `,

    prisma.$queryRaw<ConceptHit[]>`
      SELECT slug, name, category, summary,
             ts_rank(search_vector, websearch_to_tsquery('english', ${query})) AS rank
      FROM concepts
      WHERE "isPublished" = true
        AND search_vector @@ websearch_to_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `,

    prisma.$queryRaw<TimelineHit[]>`
      SELECT slug, name, era, summary,
             ts_rank(search_vector, websearch_to_tsquery('english', ${query})) AS rank
      FROM timeline_events
      WHERE "isPublished" = true
        AND search_vector @@ websearch_to_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `,
  ])

  // $queryRaw bypasses the Prisma client extension that enforces the public-demo
  // translation policy, so it is reapplied here explicitly. Without this, raw
  // search would be the one hole in an otherwise airtight guard.
  const publicVerses = verses.filter((v) =>
    filterPublicDemoTranslations([{ name: v.translationName }]).length > 0,
  )

  const strongFigures = figures.filter((f) => f.similarity >= NAME_SIMILARITY_FLOOR)
  const strongThemes = themes.filter((t) => t.similarity >= NAME_SIMILARITY_FLOOR)

  return {
    verses: publicVerses,
    claims,
    figures: strongFigures,
    themes: strongThemes,
    concepts,
    timelineEvents,
    total:
      publicVerses.length + claims.length + strongFigures.length +
      strongThemes.length + concepts.length + timelineEvents.length,
  }
}

export type { Tradition }
