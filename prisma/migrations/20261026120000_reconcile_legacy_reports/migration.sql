-- Keep legacy correction reports intact when moving from the earlier report schema.
ALTER TABLE "correction_reports"
  ADD COLUMN IF NOT EXISTS "reference" VARCHAR(300),
  ADD COLUMN IF NOT EXISTS "legacyCategory" VARCHAR(30),
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "correction_reports" ALTER COLUMN "pagePath" TYPE VARCHAR(2000);
ALTER TABLE "correction_reports" ALTER COLUMN "pagePath" DROP NOT NULL;

DO $$
BEGIN
  IF to_regclass('public.correction_reports_legacy_migration') IS NOT NULL THEN
    INSERT INTO "correction_reports" (
      "id", "kind", "claimId", "pagePath", "reference", "message", "legacyCategory",
      "contactEmail", "ipHash", "status", "handledBy", "handledAt", "createdAt", "updatedAt"
    )
    SELECT
      legacy."id",
      CASE legacy."category"::text
        WHEN 'SOURCE' THEN 'SOURCE_ERROR'::"ReportKind"
        WHEN 'INTERPRETATION' THEN 'CORRECTION'::"ReportKind"
        ELSE 'OTHER'::"ReportKind"
      END,
      NULL,
      legacy."pagePath",
      legacy."reference",
      legacy."description",
      legacy."category"::text,
      NULL,
      'legacy-migration',
      CASE legacy."status"::text
        WHEN 'IN_REVIEW' THEN 'SEEN'::"ReportStatus"
        WHEN 'RESOLVED' THEN 'ACTIONED'::"ReportStatus"
        WHEN 'DISMISSED' THEN 'DISMISSED'::"ReportStatus"
        ELSE 'NEW'::"ReportStatus"
      END,
      CASE WHEN legacy."status"::text = 'NEW' THEN NULL ELSE 'legacy-unrecorded' END,
      CASE WHEN legacy."status"::text = 'NEW' THEN NULL ELSE legacy."updatedAt" END,
      legacy."createdAt",
      legacy."updatedAt"
    FROM "correction_reports_legacy_migration" AS legacy;

    DROP TABLE "correction_reports_legacy_migration";
    DROP TYPE IF EXISTS "CorrectionCategory";
    DROP TYPE IF EXISTS "CorrectionStatus";

    PERFORM setval(
      pg_get_serial_sequence('correction_reports', 'id'),
      GREATEST(COALESCE((SELECT MAX("id") FROM "correction_reports"), 1), 1),
      EXISTS (SELECT 1 FROM "correction_reports")
    );
  END IF;
END $$;
