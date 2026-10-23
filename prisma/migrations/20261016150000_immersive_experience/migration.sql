-- The correction_reports table that used to be created here now comes from
-- 20261022170000_add_reports_and_proposals (one correction system, not two).
ALTER TABLE "comparisons" ADD COLUMN "sharedGround" TEXT, ADD COLUMN "keyDifferences" TEXT;
