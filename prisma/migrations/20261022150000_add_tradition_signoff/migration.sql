-- CreateEnum
CREATE TYPE "ReviewVerdict" AS ENUM ('ACCURATE', 'NEEDS_CHANGES', 'OBJECTS');

-- CreateEnum
CREATE TYPE "ReviewerKind" AS ENUM ('TRADITION_MEMBER', 'PROJECT_EDITOR');

-- AlterTable
ALTER TABLE "claims" ADD COLUMN     "isContested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiredTraditions" "Tradition"[] DEFAULT ARRAY[]::"Tradition"[],
ADD COLUMN     "revision" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "signoffSummary" JSONB;

-- CreateTable
CREATE TABLE "claim_reviews" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER NOT NULL,
    "revision" INTEGER NOT NULL,
    "tradition" "Tradition" NOT NULL,
    "kind" "ReviewerKind" NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "verdict" "ReviewVerdict" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claim_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "claim_reviews_claimId_revision_idx" ON "claim_reviews"("claimId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "claim_reviews_claimId_revision_tradition_reviewerId_key" ON "claim_reviews"("claimId", "revision", "tradition", "reviewerId");

-- AddForeignKey
ALTER TABLE "claim_reviews" ADD CONSTRAINT "claim_reviews_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Backfill ───────────────────────────────────────────────────────────────
-- Existing claims describe the tradition of their source. SHARED (the Hebrew Bible) is read
-- by both Jews and Christians, so both must confirm. Existing claims stay published; they are
-- shown as "awaiting review" until a reviewer signs them off.
UPDATE "claims" c
SET "requiredTraditions" = CASE s."tradition"
    WHEN 'SHARED' THEN ARRAY['JEWISH', 'CHRISTIAN']::"Tradition"[]
    ELSE ARRAY[s."tradition"]::"Tradition"[]
  END
FROM "sources" s
WHERE s."id" = c."sourceId";

-- ─── Review integrity ───────────────────────────────────────────────────────
-- A review speaks for one real tradition, never SHARED.
ALTER TABLE "claim_reviews"
  ADD CONSTRAINT "claim_reviews_tradition_not_shared" CHECK ("tradition" <> 'SHARED');

-- The project-editor stand-in is the environment administrator only.
ALTER TABLE "claim_reviews"
  ADD CONSTRAINT "claim_reviews_editor_is_admin" CHECK ("kind" <> 'PROJECT_EDITOR' OR "reviewerId" = 'admin');

-- A review must be about a tradition the claim actually requires, at the claim's CURRENT
-- revision. This stops stale or irrelevant reviews being recorded, whatever code writes them.
CREATE OR REPLACE FUNCTION claim_reviews_validate() RETURNS trigger AS $$
DECLARE
  c RECORD;
BEGIN
  SELECT "revision", "requiredTraditions" INTO c FROM "claims" WHERE "id" = NEW."claimId";
  IF NOT FOUND THEN
    RAISE EXCEPTION 'signoff: claim % does not exist', NEW."claimId" USING ERRCODE = '23514';
  END IF;
  IF NEW."revision" <> c."revision" THEN
    RAISE EXCEPTION 'signoff: review is for revision %, but the claim is at revision %', NEW."revision", c."revision"
      USING ERRCODE = '23514';
  END IF;
  IF NOT (NEW."tradition" = ANY (COALESCE(c."requiredTraditions", ARRAY[]::"Tradition"[]))) THEN
    RAISE EXCEPTION 'signoff: % is not a tradition this claim requires', NEW."tradition" USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER claim_reviews_validate
  BEFORE INSERT OR UPDATE ON "claim_reviews"
  FOR EACH ROW EXECUTE FUNCTION claim_reviews_validate();

-- ─── Revision bump ──────────────────────────────────────────────────────────
-- Changing the statement starts a new revision and voids contested status and the cached
-- summary. Reviews recorded against older revisions simply stop counting.
-- (Named "a_" so it fires before the publish gate, which must see the new revision.)
CREATE OR REPLACE FUNCTION claims_bump_revision() RETURNS trigger AS $$
BEGIN
  IF NEW."statement" IS DISTINCT FROM OLD."statement" AND NEW."revision" = OLD."revision" THEN
    NEW."revision" := OLD."revision" + 1;
  END IF;
  IF NEW."revision" <> OLD."revision" THEN
    NEW."isContested" := false;
    NEW."signoffSummary" := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER claims_a_bump_revision
  BEFORE UPDATE ON "claims"
  FOR EACH ROW EXECUTE FUNCTION claims_bump_revision();

-- ─── Publish gate ───────────────────────────────────────────────────────────
-- Applies when a claim BECOMES published. Existing published claims are not touched, and the
-- seed's trusted INSERT path is unaffected; the API cannot create already-published claims.
--   * every required tradition needs an ACCURATE review at the current revision, or, for a
--     contested claim, at least some review from that tradition (it was reviewed and disagrees);
--   * any unresolved NEEDS_CHANGES / OBJECTS blocks publication unless the claim is contested.
CREATE OR REPLACE FUNCTION claims_require_signoff() RETURNS trigger AS $$
DECLARE
  t "Tradition";
  missing text[] := ARRAY[]::text[];
  required "Tradition"[] := COALESCE(NEW."requiredTraditions", ARRAY[]::"Tradition"[]);
BEGIN
  IF (NEW."editorialStatus" = 'PUBLISHED' AND OLD."editorialStatus" <> 'PUBLISHED')
     OR (NEW."isPublished" AND NOT OLD."isPublished") THEN

    IF cardinality(required) = 0 THEN
      RAISE EXCEPTION 'signoff: claim % has no required traditions, so it cannot be published', NEW."id"
        USING ERRCODE = '23514';
    END IF;

    FOREACH t IN ARRAY required LOOP
      IF NOT EXISTS (
           SELECT 1 FROM "claim_reviews" r
           WHERE r."claimId" = NEW."id" AND r."revision" = NEW."revision"
             AND r."tradition" = t AND r."verdict" = 'ACCURATE')
         AND NOT (NEW."isContested" AND EXISTS (
           SELECT 1 FROM "claim_reviews" r
           WHERE r."claimId" = NEW."id" AND r."revision" = NEW."revision"
             AND r."tradition" = t AND r."verdict" <> 'ACCURATE'))
      THEN
        missing := missing || t::text;
      END IF;
    END LOOP;

    IF cardinality(missing) > 0 THEN
      RAISE EXCEPTION 'signoff: missing sign-off for %', array_to_string(missing, ', ')
        USING ERRCODE = '23514';
    END IF;

    IF NOT NEW."isContested" AND EXISTS (
         SELECT 1 FROM "claim_reviews" r
         WHERE r."claimId" = NEW."id" AND r."revision" = NEW."revision" AND r."verdict" <> 'ACCURATE')
    THEN
      RAISE EXCEPTION 'signoff: an unresolved objection or change request blocks publication'
        USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER claims_b_publish_gate
  BEFORE UPDATE ON "claims"
  FOR EACH ROW EXECUTE FUNCTION claims_require_signoff();

-- ─── Comparison gate ────────────────────────────────────────────────────────
-- A comparison is made of claims, so it may only go live once every claim in it is published
-- (and therefore signed off). The comparison's own title and summary are framing text and are
-- not individually signed off.
CREATE OR REPLACE FUNCTION comparisons_require_published_claims() RETURNS trigger AS $$
BEGIN
  IF NEW."isPublished" AND NOT OLD."isPublished" THEN
    IF NOT EXISTS (SELECT 1 FROM "comparison_claims" cc WHERE cc."comparisonId" = NEW."id") THEN
      RAISE EXCEPTION 'signoff: a comparison with no claims cannot be published' USING ERRCODE = '23514';
    END IF;
    IF EXISTS (
         SELECT 1 FROM "comparison_claims" cc
         JOIN "claims" c ON c."id" = cc."claimId"
         WHERE cc."comparisonId" = NEW."id" AND c."editorialStatus" <> 'PUBLISHED')
    THEN
      RAISE EXCEPTION 'signoff: every claim in a comparison must be published first' USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comparisons_publish_gate
  BEFORE UPDATE ON "comparisons"
  FOR EACH ROW EXECUTE FUNCTION comparisons_require_published_claims();
