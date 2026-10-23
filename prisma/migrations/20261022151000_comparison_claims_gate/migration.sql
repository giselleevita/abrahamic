-- A published comparison may only contain published claims.
--
-- comparisons_publish_gate checks the claims a comparison has WHEN IT GOES LIVE. But an update that
-- publishes a comparison and replaces its claims in the same request writes the comparison row
-- first and the claim links afterwards, so the gate would only see the old set. This trigger checks
-- each claim as it is attached to an already-published comparison, closing that gap.
CREATE OR REPLACE FUNCTION comparison_claims_require_published() RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM "comparisons" cmp WHERE cmp."id" = NEW."comparisonId" AND cmp."isPublished")
     AND EXISTS (SELECT 1 FROM "claims" c WHERE c."id" = NEW."claimId" AND c."editorialStatus" <> 'PUBLISHED')
  THEN
    RAISE EXCEPTION 'signoff: a published comparison can only contain published claims' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comparison_claims_publish_gate
  BEFORE INSERT ON "comparison_claims"
  FOR EACH ROW EXECUTE FUNCTION comparison_claims_require_published();
