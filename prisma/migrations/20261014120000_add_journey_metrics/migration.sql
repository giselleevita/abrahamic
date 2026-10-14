CREATE TABLE "journey_metrics" (
  "day" DATE NOT NULL,
  "chapterSlug" VARCHAR(100) NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "journey_metrics_pkey" PRIMARY KEY ("day", "chapterSlug"),
  CONSTRAINT "journey_metrics_count_nonnegative" CHECK ("count" >= 0)
);
