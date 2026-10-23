-- CreateTable
-- Note: `prisma migrate dev` also proposed dropping the hand-written full-text and
-- trigram indexes (Prisma cannot see them). Those statements were removed on purpose.
CREATE TABLE "login_attempts" (
    "key" VARCHAR(64) NOT NULL,
    "failures" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "lockedUntil" TIMESTAMP(3),

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("key")
);
