import { Prisma } from '@/generated/prisma/client'
import { searchOptions, type SearchOptions } from '@/lib/search-options'
import prisma from '@/lib/prisma'
import { REMOVED_TRANSLATION_NAMES, PUBLIC_DEMO_TRANSLATION_NAMES, PERMITTED_LICENSE_CODES, filterPublicDemoTranslations } from '@/lib/public-demo-policy'
import type { SourceKey, ConceptCategory, TimelineEra, Tradition } from '@/generated/prisma/client'

export interface VerseHit {
  id: number
  referenceKey: string
  book: string
  chapter: number
  verse: number
  sourceKey: SourceKey
  sourceTitle: string
  sourceSlug: string
  versification: string
  licenseCode?: string | null
  translationName: string
  text: string
  rank: number
}

export interface ClaimHit {
  citation?: { sourceSlug: string; book: string; chapter: number; verse: number; versification?: string }
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
export async function search(rawQuery: string, limit = 10, rawFilters: SearchOptions = {}): Promise<SearchResults> {
  const query = rawQuery.trim().slice(0, 300)
  const filters = searchOptions(rawFilters)
  limit = Math.max(1, Math.min(50, Math.floor(limit)))
  const source = (alias: string) => Prisma.sql`${filters.source ? Prisma.sql`AND ${Prisma.raw(alias)}.key::text = ${filters.source}` : Prisma.empty} ${filters.tradition ? Prisma.sql`AND ${Prisma.raw(alias)}.tradition::text = ${filters.tradition}` : Prisma.empty}`
  const selected = <T>(type: keyof typeof EMPTY, run: () => PromiseLike<T[]>): PromiseLike<T[]> => !filters.type || filters.type === type ? run() : Promise.resolve([])
  const permitted = Prisma.sql`AND t.name NOT IN (${Prisma.join([...REMOVED_TRANSLATION_NAMES])}) AND (t."licenseCode" IN (${Prisma.join([...PERMITTED_LICENSE_CODES])}) OR t.name IN (${Prisma.join([...PUBLIC_DEMO_TRANSLATION_NAMES])}))`
  if (query.length < 2) return EMPTY

  const [verses, claims, figures, themes, concepts, timelineEvents] = await Promise.all([
    selected('verses', () => prisma.$queryRaw<VerseHit[]>`
      SELECT
        v.id,
        v."referenceKey" AS "referenceKey",
        v.book, v.chapter, v.verse, v.versification,
        s.key  AS "sourceKey",
        s.title AS "sourceTitle",
        s.slug AS "sourceSlug",
        t.name AS "translationName",
        t.text, t."licenseCode",
        ts_rank(t.search_vector, websearch_to_tsquery('english', ${query})) AS rank
      FROM verse_translations t
      JOIN verses  v ON v.id = t."verseId"
      JOIN sources s ON s.id = v."sourceId"
      WHERE t.search_vector @@ websearch_to_tsquery('english', ${query})
      ${source('s')} ${permitted}
      ORDER BY rank DESC, v."sourceId", v.book, v.chapter, v.verse
      LIMIT ${limit}
    `),

    selected('claims', () => prisma.$queryRaw<ClaimHit[]>`
      SELECT
        c.id, c.statement,
        s.key   AS "sourceKey",
        s.title AS "sourceTitle",
        ts_rank(c.search_vector, websearch_to_tsquery('english', ${query})) AS rank
      FROM claims c
      JOIN sources s ON s.id = c."sourceId"
      WHERE c."isPublished" = true
        ${source('s')}
        AND c.search_vector @@ websearch_to_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `),

    // Trigram rather than FTS: these are short proper nouns, and users misspell
    // them. similarity() also gives a usable ordering that FTS would not.
    selected('figures', () => prisma.$queryRaw<FigureHit[]>`
      SELECT * FROM (SELECT DISTINCT ON (f.slug)
        f.slug, f."canonicalName" AS "canonicalName",
        GREATEST(
          similarity(f."canonicalName", ${query}),
          COALESCE(MAX(similarity(a.name, ${query})) OVER (PARTITION BY f.id), 0)
        ) AS similarity
      FROM figures f
      LEFT JOIN figure_aliases a ON a."figureId" = f.id
      WHERE (f."canonicalName" % ${query} OR a.name % ${query})
        AND EXISTS (SELECT 1 FROM claim_figures cf JOIN claims c ON c.id = cf."claimId" JOIN sources s ON s.id = c."sourceId" WHERE cf."figureId" = f.id AND c."isPublished" = true ${filters.source ? Prisma.sql`AND s.key::text = ${filters.source}` : Prisma.empty})
        ${filters.tradition ? Prisma.sql`AND EXISTS (SELECT 1 FROM figure_aliases fa WHERE fa."figureId" = f.id AND fa.tradition::text = ${filters.tradition})` : Prisma.empty}
        AND (similarity(f."canonicalName", ${query}) >= ${NAME_SIMILARITY_FLOOR} OR similarity(a.name, ${query}) >= ${NAME_SIMILARITY_FLOOR})
      ORDER BY f.slug, similarity DESC) matches
      ORDER BY similarity DESC, slug
      LIMIT ${limit}
    `),

    selected('themes', () => prisma.$queryRaw<ThemeHit[]>`
      SELECT slug, name, similarity(name, ${query}) AS similarity
      FROM themes t
      WHERE name % ${query} AND similarity(name, ${query}) >= ${NAME_SIMILARITY_FLOOR}
        AND EXISTS (SELECT 1 FROM claim_themes ct JOIN claims c ON c.id = ct."claimId" JOIN sources s ON s.id = c."sourceId" WHERE ct."themeId" = t.id AND c."isPublished" = true ${source('s')})
      ORDER BY similarity DESC
      LIMIT ${limit}
    `),

    selected('concepts', () => prisma.$queryRaw<ConceptHit[]>`
      SELECT slug, name, category, summary,
             ts_rank(search_vector, websearch_to_tsquery('english', ${query})) AS rank
      FROM concepts co
      WHERE "isPublished" = true
        ${filters.tradition ? Prisma.sql`AND EXISTS (SELECT 1 FROM concept_traditions ct WHERE ct."conceptId" = co.id AND ct.tradition::text = ${filters.tradition})` : Prisma.empty}
        ${filters.source ? Prisma.sql`AND EXISTS (SELECT 1 FROM concept_claims cc JOIN claims c ON c.id = cc."claimId" JOIN sources s ON s.id = c."sourceId" WHERE cc."conceptId" = co.id AND c."isPublished" = true AND s.key::text = ${filters.source})` : Prisma.empty}
        AND search_vector @@ websearch_to_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `),

    selected('timelineEvents', () => prisma.$queryRaw<TimelineHit[]>`
      SELECT slug, name, era, summary,
             ts_rank(search_vector, websearch_to_tsquery('english', ${query})) AS rank
      FROM timeline_events e
      WHERE "isPublished" = true
        ${filters.tradition ? Prisma.sql`AND EXISTS (SELECT 1 FROM timeline_event_traditions et WHERE et."eventId" = e.id AND et.tradition::text = ${filters.tradition})` : Prisma.empty}
        ${filters.source ? Prisma.sql`AND EXISTS (SELECT 1 FROM timeline_event_verses ev JOIN verses v ON v.id = ev."verseId" JOIN sources s ON s.id = v."sourceId" WHERE ev."eventId" = e.id AND s.key::text = ${filters.source})` : Prisma.empty}
        AND search_vector @@ websearch_to_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT ${limit}
    `),
  ])

  // $queryRaw bypasses the Prisma client extension that enforces the public-demo
  // translation policy, so it is reapplied here explicitly. Without this, raw
  // search would be the one hole in an otherwise airtight guard.
  const publicVerses = verses.filter((v) =>
    filterPublicDemoTranslations([{ name: v.translationName, licenseCode: v.licenseCode }]).length > 0,
  )

  const supports = claims.length ? await prisma.claim.findMany({
    where: { id: { in: claims.map((c) => c.id) }, isPublished: true },
    select: { id: true, source: { select: { slug: true } }, verses: { orderBy: [{ isPrimary: 'desc' }, { verseId: 'asc' }], take: 1, select: { verse: { select: { book: true, chapter: true, verse: true, versification: true } } } } },
  }) : []
  const claimsWithCitations = claims.map((claim) => {
    const support = supports.find((s) => s.id === claim.id)
    const verse = support?.verses[0]?.verse
    return { ...claim, ...(verse && support ? { citation: { sourceSlug: support.source.slug, ...verse } } : {}) }
  })
  const strongFigures = figures.filter((f) => f.similarity >= NAME_SIMILARITY_FLOOR)
  const strongThemes = themes.filter((t) => t.similarity >= NAME_SIMILARITY_FLOOR)

  return {
    verses: publicVerses,
    claims: claimsWithCitations,
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
