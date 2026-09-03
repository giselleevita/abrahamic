CREATE TYPE "EditorialStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED');

ALTER TABLE "claims"
ADD COLUMN "editorialStatus" "EditorialStatus" NOT NULL DEFAULT 'DRAFT';

UPDATE "claims"
SET "editorialStatus" = CASE
  WHEN "isPublished" THEN 'PUBLISHED'::"EditorialStatus"
  ELSE 'DRAFT'::"EditorialStatus"
END;

CREATE INDEX "claims_editorialStatus_idx" ON "claims"("editorialStatus");

ALTER TABLE "claims"
ADD CONSTRAINT "claims_publication_state_consistent"
CHECK (("editorialStatus" = 'PUBLISHED' AND "isPublished") OR ("editorialStatus" <> 'PUBLISHED' AND NOT "isPublished"));

CREATE TABLE "editorial_audit_events" (
  "id" SERIAL NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "actorRole" TEXT NOT NULL,
  "before" JSONB,
  "after" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "editorial_audit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "editorial_audit_events_entityType_entityId_createdAt_idx"
ON "editorial_audit_events"("entityType", "entityId", "createdAt");

CREATE INDEX "editorial_audit_events_actorId_createdAt_idx"
ON "editorial_audit_events"("actorId", "createdAt");
