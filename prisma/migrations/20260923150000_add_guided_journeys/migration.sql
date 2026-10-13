ALTER TYPE "ChapterItemType" ADD VALUE 'VERSE';

ALTER TABLE "courses"
  ADD COLUMN "estimatedMinutes" INTEGER,
  ADD COLUMN "artworkPath" TEXT,
  ADD COLUMN "artworkAlt" TEXT,
  ADD COLUMN "artworkCredit" TEXT,
  ADD COLUMN "artworkSourceUrl" TEXT,
  ADD COLUMN "artworkLicense" TEXT;

ALTER TABLE "chapters"
  ADD COLUMN "estimatedMinutes" INTEGER,
  ADD COLUMN "artworkPath" TEXT,
  ADD COLUMN "artworkAlt" TEXT,
  ADD COLUMN "artworkCredit" TEXT,
  ADD COLUMN "artworkSourceUrl" TEXT,
  ADD COLUMN "artworkLicense" TEXT,
  ADD COLUMN "learningObjective" TEXT,
  ADD COLUMN "takeaway" TEXT;

ALTER TABLE "chapter_items" ADD COLUMN "verseId" INTEGER;
ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_verseId_fkey"
  FOREIGN KEY ("verseId") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "chapter_items_verseId_idx" ON "chapter_items"("verseId");

ALTER TABLE "chapter_items" DROP CONSTRAINT "chapter_items_exactly_one_ref";
ALTER TABLE "chapter_items" DROP CONSTRAINT "chapter_items_type_matches_ref";

ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_exactly_one_ref" CHECK (
  (("conceptId" IS NOT NULL)::int + ("comparisonId" IS NOT NULL)::int
   + ("figureId" IS NOT NULL)::int + ("timelineEventId" IS NOT NULL)::int
   + ("themeId" IS NOT NULL)::int + ("verseId" IS NOT NULL)::int) = 1
);

ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_type_matches_ref" CHECK (
  ("itemType" = 'CONCEPT'        AND "conceptId"       IS NOT NULL) OR
  ("itemType" = 'COMPARISON'     AND "comparisonId"    IS NOT NULL) OR
  ("itemType" = 'FIGURE'         AND "figureId"        IS NOT NULL) OR
  ("itemType" = 'TIMELINE_EVENT' AND "timelineEventId" IS NOT NULL) OR
  ("itemType" = 'THEME'          AND "themeId"         IS NOT NULL) OR
  ("itemType" = 'VERSE'          AND "verseId"         IS NOT NULL)
);
