-- Drop the pre-versification uniqueness on (sourceId, book, chapter, verse).
--
-- The previous migration tried to remove it with DROP CONSTRAINT IF EXISTS and
-- silently did nothing: Prisma had created it as a unique *index*, not a table
-- constraint, so it is absent from pg_constraint and the IF EXISTS matched
-- nothing. The index kept enforcing the old rule, and importing Masoretic rows
-- failed on it.
--
-- Dropping it is safe: the replacement key
-- (sourceId, book, chapter, verse, versification) is strictly narrower, and the
-- same citation under two schemes is exactly what must now be allowed.

DROP INDEX IF EXISTS "verses_sourceId_book_chapter_verse_key";
