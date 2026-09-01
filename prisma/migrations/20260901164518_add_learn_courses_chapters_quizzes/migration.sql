-- CreateEnum
CREATE TYPE "ChapterItemType" AS ENUM ('CONCEPT', 'COMPARISON', 'FIGURE', 'TIMELINE_EVENT', 'THEME');

-- CreateEnum
CREATE TYPE "QuestionKind" AS ENUM ('TRADITION_TEACHING', 'FIGURE_IDENTITY', 'SOURCE_TEXT', 'DIVERGENCE_MAP', 'TIMELINE_ORDER', 'TERMINOLOGY');

-- CreateEnum
CREATE TYPE "QuestionFormat" AS ENUM ('SINGLE_CHOICE', 'MULTI_SELECT', 'TRUE_FALSE_ATTRIBUTED', 'ORDERING');

-- CreateEnum
CREATE TYPE "QuestionSourceType" AS ENUM ('CLAIM', 'CONCEPT', 'COMPARISON', 'TIMELINE_EVENT');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('INTRO', 'CORE', 'DEEP');

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "neutralityReviewedAt" TIMESTAMP(3),
    "neutralityReviewNote" TEXT,
    "quizQuestionCount" INTEGER NOT NULL DEFAULT 5,
    "quizPassPercent" INTEGER NOT NULL DEFAULT 70,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter_items" (
    "id" SERIAL NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "itemType" "ChapterItemType" NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "conceptId" INTEGER,
    "comparisonId" INTEGER,
    "figureId" INTEGER,
    "timelineEventId" INTEGER,
    "themeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "kind" "QuestionKind" NOT NULL,
    "format" "QuestionFormat" NOT NULL DEFAULT 'SINGLE_CHOICE',
    "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'CORE',
    "position" INTEGER NOT NULL DEFAULT 0,
    "prompt" TEXT NOT NULL,
    "subjectTradition" "Tradition",
    "explanation" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sourceType" "QuestionSourceType" NOT NULL,
    "claimId" INTEGER,
    "conceptId" INTEGER,
    "comparisonId" INTEGER,
    "timelineEventId" INTEGER,
    "isContested" BOOLEAN NOT NULL DEFAULT false,
    "originCandidateId" INTEGER,
    "neutralityReviewedAt" TIMESTAMP(3),
    "neutralityReviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_answer_options" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "optionTradition" "Tradition",
    "presence" "TraditionPresence",
    "rationale" TEXT,

    CONSTRAINT "question_answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_verses" (
    "questionId" INTEGER NOT NULL,
    "verseId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "question_verses_pkey" PRIMARY KEY ("questionId","verseId")
);

-- CreateTable
CREATE TABLE "question_candidates" (
    "id" SERIAL NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "kind" "QuestionKind" NOT NULL,
    "format" "QuestionFormat" NOT NULL DEFAULT 'SINGLE_CHOICE',
    "prompt" TEXT NOT NULL,
    "subjectTradition" "Tradition",
    "explanation" TEXT NOT NULL,
    "sourceType" "QuestionSourceType" NOT NULL,
    "claimId" INTEGER,
    "conceptId" INTEGER,
    "comparisonId" INTEGER,
    "timelineEventId" INTEGER,
    "proposedOptions" JSONB NOT NULL,
    "aiRationale" TEXT NOT NULL,
    "aiModel" TEXT,
    "contentHash" TEXT NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "neutralityFlags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_isPublished_position_idx" ON "courses"("isPublished", "position");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_slug_key" ON "chapters"("slug");

-- CreateIndex
CREATE INDEX "chapters_courseId_position_idx" ON "chapters"("courseId", "position");

-- CreateIndex
CREATE INDEX "chapters_isPublished_idx" ON "chapters"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_courseId_position_key" ON "chapters"("courseId", "position");

-- CreateIndex
CREATE INDEX "chapter_items_chapterId_position_idx" ON "chapter_items"("chapterId", "position");

-- CreateIndex
CREATE INDEX "chapter_items_itemType_idx" ON "chapter_items"("itemType");

-- CreateIndex
CREATE UNIQUE INDEX "questions_originCandidateId_key" ON "questions"("originCandidateId");

-- CreateIndex
CREATE INDEX "questions_chapterId_position_idx" ON "questions"("chapterId", "position");

-- CreateIndex
CREATE INDEX "questions_isPublished_idx" ON "questions"("isPublished");

-- CreateIndex
CREATE INDEX "questions_kind_idx" ON "questions"("kind");

-- CreateIndex
CREATE INDEX "question_answer_options_questionId_position_idx" ON "question_answer_options"("questionId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "question_candidates_contentHash_key" ON "question_candidates"("contentHash");

-- CreateIndex
CREATE INDEX "question_candidates_chapterId_status_idx" ON "question_candidates"("chapterId", "status");

-- CreateIndex
CREATE INDEX "question_candidates_status_idx" ON "question_candidates"("status");

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "comparisons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_figureId_fkey" FOREIGN KEY ("figureId") REFERENCES "figures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_timelineEventId_fkey" FOREIGN KEY ("timelineEventId") REFERENCES "timeline_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "comparisons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_timelineEventId_fkey" FOREIGN KEY ("timelineEventId") REFERENCES "timeline_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_answer_options" ADD CONSTRAINT "question_answer_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_verses" ADD CONSTRAINT "question_verses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_verses" ADD CONSTRAINT "question_verses_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_candidates" ADD CONSTRAINT "question_candidates_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_candidates" ADD CONSTRAINT "question_candidates_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claims"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_candidates" ADD CONSTRAINT "question_candidates_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_candidates" ADD CONSTRAINT "question_candidates_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "comparisons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_candidates" ADD CONSTRAINT "question_candidates_timelineEventId_fkey" FOREIGN KEY ("timelineEventId") REFERENCES "timeline_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- Integrity constraints Prisma cannot express in schema.prisma.
--
-- These back the polymorphic ChapterItem/Question shapes and the editorial
-- neutrality rules. They are hand-written, so a future `migrate dev
-- --create-only` regeneration will NOT reproduce them — prisma/schema.check.test.ts
-- fails if any of them goes missing.
-- ─────────────────────────────────────────────────────────────────────────────

-- A chapter item points at exactly one entity...
ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_exactly_one_ref" CHECK (
  (("conceptId" IS NOT NULL)::int + ("comparisonId" IS NOT NULL)::int
   + ("figureId" IS NOT NULL)::int + ("timelineEventId" IS NOT NULL)::int
   + ("themeId" IS NOT NULL)::int) = 1
);

-- ...and the discriminator must agree with which FK is set.
ALTER TABLE "chapter_items" ADD CONSTRAINT "chapter_items_type_matches_ref" CHECK (
  ("itemType" = 'CONCEPT'        AND "conceptId"       IS NOT NULL) OR
  ("itemType" = 'COMPARISON'     AND "comparisonId"    IS NOT NULL) OR
  ("itemType" = 'FIGURE'         AND "figureId"        IS NOT NULL) OR
  ("itemType" = 'TIMELINE_EVENT' AND "timelineEventId" IS NOT NULL) OR
  ("itemType" = 'THEME'          AND "themeId"         IS NOT NULL)
);

-- Every question traces to exactly one source entity, so the answer can always
-- be shown with a citation.
ALTER TABLE "questions" ADD CONSTRAINT "questions_provenance_exactly_one" CHECK (
  (("claimId" IS NOT NULL)::int + ("conceptId" IS NOT NULL)::int
   + ("comparisonId" IS NOT NULL)::int + ("timelineEventId" IS NOT NULL)::int) = 1
);

ALTER TABLE "questions" ADD CONSTRAINT "questions_provenance_matches_type" CHECK (
  ("sourceType" = 'CLAIM'          AND "claimId"         IS NOT NULL) OR
  ("sourceType" = 'CONCEPT'        AND "conceptId"       IS NOT NULL) OR
  ("sourceType" = 'COMPARISON'     AND "comparisonId"    IS NOT NULL) OR
  ("sourceType" = 'TIMELINE_EVENT' AND "timelineEventId" IS NOT NULL)
);

-- NEUTRALITY: a question about what a tradition teaches must name that
-- tradition. Without this the kind could be used to smuggle in an
-- unattributed truth claim.
ALTER TABLE "questions" ADD CONSTRAINT "questions_subject_tradition_required" CHECK (
  "kind" NOT IN ('TRADITION_TEACHING', 'FIGURE_IDENTITY') OR "subjectTradition" IS NOT NULL
);

-- SHARED is not a teaching holder for an attributive question.
ALTER TABLE "questions" ADD CONSTRAINT "questions_subject_tradition_not_shared" CHECK (
  "subjectTradition" IS NULL OR "subjectTradition" <> 'SHARED'
);

-- NEUTRALITY: contested material (a controversial or CONTRADICTION-tagged
-- comparison) may only be asked in shapes that attribute every position.
ALTER TABLE "questions" ADD CONSTRAINT "questions_contested_kind_allowed" CHECK (
  "isContested" = false
  OR "kind" IN ('TRADITION_TEACHING', 'DIVERGENCE_MAP', 'SOURCE_TEXT')
);

-- A DIVERGENCE_MAP option represents one tradition's position, so it must say
-- which tradition — that is what stops any option reading as "simply wrong".
ALTER TABLE "question_answer_options" ADD CONSTRAINT "option_divergence_needs_tradition" CHECK (
  "optionTradition" IS NOT NULL OR "presence" IS NULL
);

ALTER TABLE "chapters" ADD CONSTRAINT "chapters_quiz_pass_percent_range" CHECK (
  "quizPassPercent" BETWEEN 0 AND 100
);

ALTER TABLE "chapters" ADD CONSTRAINT "chapters_quiz_question_count_positive" CHECK (
  "quizQuestionCount" > 0
);
