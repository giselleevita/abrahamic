-- Full-text search.
--
-- Search was `ILIKE '%q%'` across six tables with no index of any kind. At 37k
-- rows a rare or absent term cost a full sequential scan (~55ms at the database,
-- 61-111ms end-to-end) and results came back in arbitrary order, because there
-- was nothing to rank them by.
--
-- Generated tsvector columns keep the index in lockstep with the source text —
-- there is no trigger to forget and no application code that can write a stale
-- vector. Weights let one query rank a title match above a body match.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── Verse translations: the largest table, and the main search target ────────
ALTER TABLE "verse_translations"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce("text", ''))) STORED;

CREATE INDEX "verse_translations_search_idx"
  ON "verse_translations" USING GIN ("search_vector");

-- ── Claims: statement carries more weight than editorial notes ──────────────
ALTER TABLE "claims"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("statement", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("notes", '')), 'B')
  ) STORED;

CREATE INDEX "claims_search_idx" ON "claims" USING GIN ("search_vector");

-- ── Concepts ────────────────────────────────────────────────────────────────
ALTER TABLE "concepts"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("summary", '')), 'B')
  ) STORED;

CREATE INDEX "concepts_search_idx" ON "concepts" USING GIN ("search_vector");

-- ── Timeline events ─────────────────────────────────────────────────────────
ALTER TABLE "timeline_events"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("summary", '')), 'B')
  ) STORED;

CREATE INDEX "timeline_events_search_idx" ON "timeline_events" USING GIN ("search_vector");

-- ── Figures and themes: short names, so trigram similarity beats FTS here.
--    It also tolerates the misspellings people actually type for these names.
CREATE INDEX "figures_name_trgm_idx"
  ON "figures" USING GIN ("canonicalName" gin_trgm_ops);

CREATE INDEX "figure_aliases_name_trgm_idx"
  ON "figure_aliases" USING GIN ("name" gin_trgm_ops);

CREATE INDEX "themes_name_trgm_idx"
  ON "themes" USING GIN ("name" gin_trgm_ops);

-- Supports ordering verse results by their canonical position.
CREATE INDEX IF NOT EXISTS "verses_book_chapter_verse_idx"
  ON "verses" ("book", "chapter", "verse");
