-- CreateEnum
CREATE TYPE "SourceKey" AS ENUM ('TORAH', 'HEBREW_BIBLE', 'NEW_TESTAMENT', 'QURAN');

-- CreateEnum
CREATE TYPE "Tradition" AS ENUM ('JEWISH', 'CHRISTIAN', 'ISLAMIC', 'SHARED');

-- CreateEnum
CREATE TYPE "ComparisonTag" AS ENUM ('SHARED', 'SIMILAR_DIFFERENT', 'CONTRADICTION');

-- CreateEnum
CREATE TYPE "VerseLinkType" AS ENUM ('PARALLEL', 'CONTRAST', 'ELABORATION', 'FULFILLMENT_CLAIM');

-- CreateEnum
CREATE TYPE "TranslationLabel" AS ENUM ('ORIGINAL', 'CLASSIC', 'MODERN', 'SCHOLARLY');

-- CreateTable
CREATE TABLE "sources" (
    "id" SERIAL NOT NULL,
    "key" "SourceKey" NOT NULL,
    "title" TEXT NOT NULL,
    "tradition" "Tradition" NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verses" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "book" TEXT NOT NULL,
    "bookNumber" INTEGER,
    "chapter" INTEGER NOT NULL,
    "verse" INTEGER NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verse_translations" (
    "id" SERIAL NOT NULL,
    "verseId" INTEGER NOT NULL,
    "label" "TranslationLabel" NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "verse_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "figures" (
    "id" SERIAL NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "figures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "figure_aliases" (
    "id" SERIAL NOT NULL,
    "figureId" INTEGER NOT NULL,
    "tradition" "Tradition" NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT,
    "notes" TEXT,

    CONSTRAINT "figure_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "statement" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "notes" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_verses" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER NOT NULL,
    "verseId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "claim_verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_figures" (
    "claimId" INTEGER NOT NULL,
    "figureId" INTEGER NOT NULL,

    CONSTRAINT "claim_figures_pkey" PRIMARY KEY ("claimId","figureId")
);

-- CreateTable
CREATE TABLE "claim_themes" (
    "claimId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,

    CONSTRAINT "claim_themes_pkey" PRIMARY KEY ("claimId","themeId")
);

-- CreateTable
CREATE TABLE "comparisons" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tag" "ComparisonTag" NOT NULL,
    "summary" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_claims" (
    "comparisonId" INTEGER NOT NULL,
    "claimId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "comparison_claims_pkey" PRIMARY KEY ("comparisonId","claimId")
);

-- CreateTable
CREATE TABLE "verse_links" (
    "id" SERIAL NOT NULL,
    "verseAId" INTEGER NOT NULL,
    "verseBId" INTEGER NOT NULL,
    "linkType" "VerseLinkType" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "verse_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sources_key_key" ON "sources"("key");

-- CreateIndex
CREATE UNIQUE INDEX "sources_slug_key" ON "sources"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "verses_referenceKey_key" ON "verses"("referenceKey");

-- CreateIndex
CREATE INDEX "verses_sourceId_book_chapter_idx" ON "verses"("sourceId", "book", "chapter");

-- CreateIndex
CREATE UNIQUE INDEX "verses_sourceId_book_chapter_verse_key" ON "verses"("sourceId", "book", "chapter", "verse");

-- CreateIndex
CREATE UNIQUE INDEX "verse_translations_verseId_label_name_key" ON "verse_translations"("verseId", "label", "name");

-- CreateIndex
CREATE UNIQUE INDEX "figures_slug_key" ON "figures"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "figure_aliases_figureId_tradition_name_key" ON "figure_aliases"("figureId", "tradition", "name");

-- CreateIndex
CREATE UNIQUE INDEX "themes_name_key" ON "themes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "themes_slug_key" ON "themes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "claims_contentHash_key" ON "claims"("contentHash");

-- CreateIndex
CREATE INDEX "claims_sourceId_idx" ON "claims"("sourceId");

-- CreateIndex
CREATE INDEX "claims_isPublished_idx" ON "claims"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "claim_verses_claimId_verseId_key" ON "claim_verses"("claimId", "verseId");

-- CreateIndex
CREATE UNIQUE INDEX "comparisons_slug_key" ON "comparisons"("slug");

-- CreateIndex
CREATE INDEX "comparisons_tag_idx" ON "comparisons"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "verse_links_verseAId_verseBId_linkType_key" ON "verse_links"("verseAId", "verseBId", "linkType");

-- AddForeignKey
ALTER TABLE "verses" ADD CONSTRAINT "verses_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verse_translations" ADD CONSTRAINT "verse_translations_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "verses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "figure_aliases" ADD CONSTRAINT "figure_aliases_figureId_fkey" FOREIGN KEY ("figureId") REFERENCES "figures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_verses" ADD CONSTRAINT "claim_verses_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_verses" ADD CONSTRAINT "claim_verses_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_figures" ADD CONSTRAINT "claim_figures_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_figures" ADD CONSTRAINT "claim_figures_figureId_fkey" FOREIGN KEY ("figureId") REFERENCES "figures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_themes" ADD CONSTRAINT "claim_themes_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_themes" ADD CONSTRAINT "claim_themes_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_claims" ADD CONSTRAINT "comparison_claims_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "comparisons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_claims" ADD CONSTRAINT "comparison_claims_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verse_links" ADD CONSTRAINT "verse_links_verseAId_fkey" FOREIGN KEY ("verseAId") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verse_links" ADD CONSTRAINT "verse_links_verseBId_fkey" FOREIGN KEY ("verseBId") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
