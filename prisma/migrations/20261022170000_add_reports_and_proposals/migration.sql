-- CreateEnum
CREATE TYPE "ReportKind" AS ENUM ('CORRECTION', 'UNFAIR_TO_TRADITION', 'SOURCE_ERROR', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('NEW', 'SEEN', 'ACTIONED', 'DISMISSED');

-- AlterTable
ALTER TABLE "claims" ADD COLUMN     "proposedById" TEXT;

-- CreateTable
CREATE TABLE "correction_reports" (
    "id" SERIAL NOT NULL,
    "kind" "ReportKind" NOT NULL,
    "claimId" INTEGER,
    "pagePath" VARCHAR(300),
    "message" TEXT NOT NULL,
    "contactEmail" VARCHAR(254),
    "ipHash" VARCHAR(64) NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'NEW',
    "handledBy" TEXT,
    "handledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "correction_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "correction_reports_status_createdAt_idx" ON "correction_reports"("status", "createdAt");

-- CreateIndex
CREATE INDEX "correction_reports_ipHash_createdAt_idx" ON "correction_reports"("ipHash", "createdAt");

-- AddForeignKey
ALTER TABLE "correction_reports" ADD CONSTRAINT "correction_reports_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- A handled report records who handled it and when (the same accountability rule as reviewer decisions).
ALTER TABLE "correction_reports"
  ADD CONSTRAINT "correction_reports_handling_recorded"
  CHECK ("status" = 'NEW' OR ("handledBy" IS NOT NULL AND "handledAt" IS NOT NULL));

-- Proposals are looked up per user per day to enforce the daily cap.
CREATE INDEX "claims_proposedById_createdAt_idx" ON "claims"("proposedById", "createdAt") WHERE "proposedById" IS NOT NULL;
