-- Add legacy column to figures
ALTER TABLE "figures" ADD COLUMN "legacy" TEXT;

-- Create FigureRelationType enum
CREATE TYPE "public"."FigureRelationType" AS ENUM ('PARENT', 'CHILD', 'SPOUSE', 'SIBLING', 'DESCENDANT');

-- CreateTable figure_relations
CREATE TABLE "figure_relations" (
    "id" SERIAL NOT NULL,
    "fromFigureId" INTEGER NOT NULL,
    "toFigureId" INTEGER NOT NULL,
    "relationType" "public"."FigureRelationType" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "figure_relations_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint
CREATE UNIQUE INDEX "figure_relations_fromFigureId_toFigureId_relationType_key" ON "figure_relations"("fromFigureId", "toFigureId", "relationType");

-- Add foreign key constraints
ALTER TABLE "figure_relations" ADD CONSTRAINT "figure_relations_fromFigureId_fkey" FOREIGN KEY ("fromFigureId") REFERENCES "figures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "figure_relations" ADD CONSTRAINT "figure_relations_toFigureId_fkey" FOREIGN KEY ("toFigureId") REFERENCES "figures"("id") ON DELETE CASCADE ON UPDATE CASCADE;
