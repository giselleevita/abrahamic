CREATE TABLE "correction_rate_buckets" (
  "keyDigest" CHAR(64) NOT NULL,
  "windowStart" TIMESTAMP(3) NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 1 CHECK ("count" BETWEEN 1 AND 5),
  PRIMARY KEY ("keyDigest", "windowStart")
);
CREATE INDEX "correction_rate_buckets_windowStart_idx" ON "correction_rate_buckets"("windowStart");
