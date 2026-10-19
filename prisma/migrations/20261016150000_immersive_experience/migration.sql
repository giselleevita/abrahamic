ALTER TABLE "comparisons" ADD COLUMN "sharedGround" TEXT, ADD COLUMN "keyDifferences" TEXT;
CREATE TYPE "CorrectionStatus" AS ENUM ('NEW', 'IN_REVIEW', 'RESOLVED', 'DISMISSED');
CREATE TYPE "CorrectionCategory" AS ENUM ('SOURCE', 'INTERPRETATION', 'LABEL', 'OTHER');
CREATE TABLE "correction_reports" (
  "id" SERIAL PRIMARY KEY,
  "pagePath" VARCHAR(2000) NOT NULL,
  "reference" VARCHAR(300),
  "category" "CorrectionCategory" NOT NULL,
  "description" VARCHAR(3000) NOT NULL,
  "status" "CorrectionStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "correction_description_length" CHECK (char_length("description") BETWEEN 20 AND 3000)
);
CREATE INDEX "correction_reports_status_createdAt_idx" ON "correction_reports"("status", "createdAt");
