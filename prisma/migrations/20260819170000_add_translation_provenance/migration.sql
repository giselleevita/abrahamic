-- Provenance for imported translations.
--
-- Recorded per row rather than per translation name so that "where did this
-- text come from, and under what licence" stays answerable after the importer
-- has moved on — and so a deployment can permit text by licence rather than by
-- a hardcoded list of names, which does not scale past a handful of imports.

ALTER TABLE "verse_translations" ADD COLUMN "licenseCode" TEXT;
ALTER TABLE "verse_translations" ADD COLUMN "sourceUrl"   TEXT;
ALTER TABLE "verse_translations" ADD COLUMN "attribution" TEXT;
ALTER TABLE "verse_translations" ADD COLUMN "retrievedAt" TIMESTAMP(3);

-- Supports "show me everything imported under licence X", which is the query a
-- takedown or a licence review actually needs.
CREATE INDEX "verse_translations_license_idx" ON "verse_translations" ("licenseCode");
