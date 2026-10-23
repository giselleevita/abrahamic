-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CONTRIBUTOR', 'EDITOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ReviewerStatus" AS ENUM ('PENDING', 'APPROVED', 'REVOKED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "provider" VARCHAR(20) NOT NULL,
    "providerAccountId" VARCHAR(100) NOT NULL,
    "email" TEXT,
    "displayName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CONTRIBUTOR',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSignInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviewer_profiles" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tradition" "Tradition" NOT NULL,
    "affiliation" VARCHAR(200) NOT NULL,
    "statement" TEXT NOT NULL,
    "status" "ReviewerStatus" NOT NULL DEFAULT 'PENDING',
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviewer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_providerAccountId_key" ON "users"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "reviewer_profiles_status_idx" ON "reviewer_profiles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "reviewer_profiles_userId_tradition_key" ON "reviewer_profiles"("userId", "tradition");

-- AddForeignKey
ALTER TABLE "reviewer_profiles" ADD CONSTRAINT "reviewer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;



-- A reviewer vouches for how ONE real tradition is described. SHARED is not a tradition
-- anyone belongs to, so it can never be a reviewer scope.
ALTER TABLE "reviewer_profiles"
  ADD CONSTRAINT "reviewer_profiles_tradition_not_shared" CHECK ("tradition" <> 'SHARED');

-- A decision must record who made it and when.
ALTER TABLE "reviewer_profiles"
  ADD CONSTRAINT "reviewer_profiles_decision_recorded"
  CHECK ("status" = 'PENDING' OR ("decidedBy" IS NOT NULL AND "decidedAt" IS NOT NULL));
