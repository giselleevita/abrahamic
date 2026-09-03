ALTER TABLE "sources"
  ADD COLUMN "licenseName" TEXT,
  ADD COLUMN "attribution" TEXT,
  ADD COLUMN "sourceUrl" TEXT;

UPDATE "sources"
SET
  "licenseName" = 'Public domain (original-language source text)',
  "attribution" = 'Original-language scripture source with project-authored descriptive metadata; no proprietary modern translation is included.',
  "sourceUrl" = 'https://github.com/giselleevita/abrahamic/blob/main/docs/ENGINEERING_CASE_STUDY.md';

ALTER TABLE "sources"
  ALTER COLUMN "licenseName" SET NOT NULL,
  ALTER COLUMN "attribution" SET NOT NULL,
  ALTER COLUMN "sourceUrl" SET NOT NULL;
