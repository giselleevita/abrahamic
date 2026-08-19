-- CreateEnum
CREATE TYPE "KidsAgeBand" AS ENUM ('AGE_6_8', 'AGE_9_12');

-- CreateTable
CREATE TABLE "kids_stories" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ageBand" "KidsAgeBand" NOT NULL,
    "body" TEXT NOT NULL,
    "glossary" JSONB,
    "aiModel" TEXT NOT NULL,
    "aiRationale" TEXT NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kids_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kids_story_claims" (
    "storyId" INTEGER NOT NULL,
    "claimId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "kids_story_claims_pkey" PRIMARY KEY ("storyId","claimId")
);

-- CreateTable
CREATE TABLE "kids_story_figures" (
    "storyId" INTEGER NOT NULL,
    "figureId" INTEGER NOT NULL,

    CONSTRAINT "kids_story_figures_pkey" PRIMARY KEY ("storyId","figureId")
);

-- CreateIndex
CREATE UNIQUE INDEX "kids_stories_slug_key" ON "kids_stories"("slug");

-- CreateIndex
CREATE INDEX "kids_stories_status_idx" ON "kids_stories"("status");

-- CreateIndex
CREATE INDEX "kids_stories_isPublished_ageBand_idx" ON "kids_stories"("isPublished", "ageBand");

-- AddForeignKey
ALTER TABLE "kids_story_claims" ADD CONSTRAINT "kids_story_claims_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "kids_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kids_story_claims" ADD CONSTRAINT "kids_story_claims_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kids_story_figures" ADD CONSTRAINT "kids_story_figures_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "kids_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kids_story_figures" ADD CONSTRAINT "kids_story_figures_figureId_fkey" FOREIGN KEY ("figureId") REFERENCES "figures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Child-facing content may never be published without an explicit approval.
-- Enforced in the database rather than in application code so that a bug, a
-- direct SQL write, or a future admin route cannot bypass the review step.
ALTER TABLE "kids_stories"
  ADD CONSTRAINT "kids_stories_publish_requires_approval"
  CHECK ("isPublished" = false OR "status" = 'APPROVED');
