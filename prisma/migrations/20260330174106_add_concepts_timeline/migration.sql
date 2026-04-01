-- CreateEnum
CREATE TYPE "ConceptCategory" AS ENUM ('THEOLOGY', 'SOTERIOLOGY', 'ESCHATOLOGY', 'PROPHETHOOD', 'PRACTICE', 'LAW', 'COSMOLOGY');

-- CreateEnum
CREATE TYPE "TraditionPresence" AS ENUM ('AFFIRMED', 'MODIFIED', 'SILENT', 'REJECTED');

-- CreateEnum
CREATE TYPE "TimelineEra" AS ENUM ('PRIMORDIAL', 'PATRIARCHAL', 'EXODUS', 'KINGDOM', 'GOSPEL', 'EARLY_ISLAM');

-- CreateTable
CREATE TABLE "concepts" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ConceptCategory" NOT NULL,
    "summary" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_traditions" (
    "id" SERIAL NOT NULL,
    "conceptId" INTEGER NOT NULL,
    "tradition" "Tradition" NOT NULL,
    "definition" TEXT NOT NULL,
    "nuances" TEXT,

    CONSTRAINT "concept_traditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_claims" (
    "conceptId" INTEGER NOT NULL,
    "claimId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "concept_claims_pkey" PRIMARY KEY ("conceptId","claimId")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "era" "TimelineEra" NOT NULL,
    "position" INTEGER NOT NULL,
    "summary" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_event_traditions" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "tradition" "Tradition" NOT NULL,
    "presence" "TraditionPresence" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "timeline_event_traditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_event_verses" (
    "eventId" INTEGER NOT NULL,
    "verseId" INTEGER NOT NULL,

    CONSTRAINT "timeline_event_verses_pkey" PRIMARY KEY ("eventId","verseId")
);

-- CreateTable
CREATE TABLE "timeline_event_figures" (
    "eventId" INTEGER NOT NULL,
    "figureId" INTEGER NOT NULL,

    CONSTRAINT "timeline_event_figures_pkey" PRIMARY KEY ("eventId","figureId")
);

-- CreateIndex
CREATE UNIQUE INDEX "concepts_slug_key" ON "concepts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "concepts_name_key" ON "concepts"("name");

-- CreateIndex
CREATE INDEX "concepts_category_idx" ON "concepts"("category");

-- CreateIndex
CREATE INDEX "concepts_isPublished_idx" ON "concepts"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "concept_traditions_conceptId_tradition_key" ON "concept_traditions"("conceptId", "tradition");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_events_slug_key" ON "timeline_events"("slug");

-- CreateIndex
CREATE INDEX "timeline_events_era_position_idx" ON "timeline_events"("era", "position");

-- CreateIndex
CREATE INDEX "timeline_events_isPublished_idx" ON "timeline_events"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_event_traditions_eventId_tradition_key" ON "timeline_event_traditions"("eventId", "tradition");

-- AddForeignKey
ALTER TABLE "concept_traditions" ADD CONSTRAINT "concept_traditions_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_claims" ADD CONSTRAINT "concept_claims_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_claims" ADD CONSTRAINT "concept_claims_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_event_traditions" ADD CONSTRAINT "timeline_event_traditions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "timeline_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_event_verses" ADD CONSTRAINT "timeline_event_verses_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "timeline_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_event_verses" ADD CONSTRAINT "timeline_event_verses_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_event_figures" ADD CONSTRAINT "timeline_event_figures_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "timeline_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_event_figures" ADD CONSTRAINT "timeline_event_figures_figureId_fkey" FOREIGN KEY ("figureId") REFERENCES "figures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
