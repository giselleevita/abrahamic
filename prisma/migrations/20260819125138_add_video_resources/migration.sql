-- CreateTable
CREATE TABLE "video_resources" (
    "id" SERIAL NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "editorNote" TEXT NOT NULL,
    "perspectiveTradition" "Tradition",
    "durationSeconds" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isKidsSafe" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_resource_concepts" (
    "videoId" INTEGER NOT NULL,
    "conceptId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "video_resource_concepts_pkey" PRIMARY KEY ("videoId","conceptId")
);

-- CreateTable
CREATE TABLE "video_resource_figures" (
    "videoId" INTEGER NOT NULL,
    "figureId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "video_resource_figures_pkey" PRIMARY KEY ("videoId","figureId")
);

-- CreateTable
CREATE TABLE "video_resource_themes" (
    "videoId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "video_resource_themes_pkey" PRIMARY KEY ("videoId","themeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "video_resources_youtubeId_key" ON "video_resources"("youtubeId");

-- CreateIndex
CREATE INDEX "video_resources_isPublished_idx" ON "video_resources"("isPublished");

-- AddForeignKey
ALTER TABLE "video_resource_concepts" ADD CONSTRAINT "video_resource_concepts_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "video_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_resource_concepts" ADD CONSTRAINT "video_resource_concepts_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_resource_figures" ADD CONSTRAINT "video_resource_figures_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "video_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_resource_figures" ADD CONSTRAINT "video_resource_figures_figureId_fkey" FOREIGN KEY ("figureId") REFERENCES "figures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_resource_themes" ADD CONSTRAINT "video_resource_themes_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "video_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_resource_themes" ADD CONSTRAINT "video_resource_themes_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
