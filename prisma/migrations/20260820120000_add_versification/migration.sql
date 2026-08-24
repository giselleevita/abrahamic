-- Verse-division schemes.
--
-- The Masoretic text and Christian translations divide verses differently.
-- Psalm 51:1 in Hebrew is the superscription, "For the choirmaster, a psalm of
-- David"; Psalm 51:1 in English is "Have mercy on me, God" — Hebrew verse 3.
-- Both were being stored on the same verse row, so the reader displayed them
-- side by side as though they corresponded. That affected 139 of 929 chapters,
-- Psalms worst at 62 of 150.
--
-- Adding the scheme to the row's identity lets Masoretic-numbered text live on
-- its own rows instead of falsely sharing Christian-numbered ones. Every
-- existing row is CHRISTIAN, which is what all current verses, claims and verse
-- links use, so nothing in the editorial layer moves.

CREATE TYPE "Versification" AS ENUM ('CHRISTIAN', 'MASORETIC');

ALTER TABLE "verses"
  ADD COLUMN "versification" "Versification" NOT NULL DEFAULT 'CHRISTIAN';

-- The scheme becomes part of a verse's identity: the same book, chapter and
-- verse number can legitimately exist once per scheme and mean different text.
ALTER TABLE "verses" DROP CONSTRAINT IF EXISTS "verses_sourceId_book_chapter_verse_key";

ALTER TABLE "verses"
  ADD CONSTRAINT "verses_sourceId_book_chapter_verse_versification_key"
  UNIQUE ("sourceId", "book", "chapter", "verse", "versification");

CREATE INDEX "verses_sourceId_book_chapter_versification_idx"
  ON "verses" ("sourceId", "book", "chapter", "versification");
