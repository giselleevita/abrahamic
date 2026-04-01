-- CreateEnum
CREATE TYPE "InterpretationScope" AS ENUM ('LITERAL', 'MAJORITY_SCHOLARLY', 'SPECIFIC_TRADITION');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "claims" ADD COLUMN     "embedding" JSONB,
ADD COLUMN     "interpretationScope" "InterpretationScope",
ADD COLUMN     "specificTradition" TEXT;

-- AlterTable
ALTER TABLE "comparisons" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "isControversial" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "verse_link_candidates" (
    "id" SERIAL NOT NULL,
    "verseAId" INTEGER NOT NULL,
    "verseBId" INTEGER NOT NULL,
    "linkType" "VerseLinkType" NOT NULL,
    "aiRationale" TEXT NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verse_link_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verse_link_candidates_verseAId_verseBId_linkType_key" ON "verse_link_candidates"("verseAId", "verseBId", "linkType");

-- AddForeignKey
ALTER TABLE "verse_link_candidates" ADD CONSTRAINT "verse_link_candidates_verseAId_fkey" FOREIGN KEY ("verseAId") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verse_link_candidates" ADD CONSTRAINT "verse_link_candidates_verseBId_fkey" FOREIGN KEY ("verseBId") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
