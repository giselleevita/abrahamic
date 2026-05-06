-- Add source and verse citations to figure_relations
ALTER TABLE "figure_relations" ADD COLUMN "sourceId" INTEGER;
ALTER TABLE "figure_relations" ADD COLUMN "verseId" INTEGER;

-- Add foreign key constraints
ALTER TABLE "figure_relations" ADD CONSTRAINT "figure_relations_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "figure_relations" ADD CONSTRAINT "figure_relations_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "verses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
