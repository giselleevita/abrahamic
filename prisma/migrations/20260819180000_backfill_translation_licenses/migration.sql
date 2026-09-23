-- Backfill licences onto seeded translations.
--
-- Permission is now driven by `licenseCode` rather than by a hardcoded list of
-- translation names, so that importing a public-domain text is a data decision.
-- Rows created before that change carry no licence and would fall back to name
-- matching; recording their licence puts seeded and imported rows under the
-- same rule.
--
-- Masoretic Hebrew and Quranic Arabic are public-domain source texts. Reader
-- notes are written by this project.

UPDATE "verse_translations" SET "licenseCode" = 'PD'
WHERE "licenseCode" IS NULL AND "name" IN ('Hebrew (MT)', 'Arabic');

UPDATE "verse_translations" SET "licenseCode" = 'PROJECT'
WHERE "licenseCode" IS NULL AND "name" = 'Reader note (original)';
