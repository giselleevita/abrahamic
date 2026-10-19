// Preview URLs are mandatory and never fall back to production integration variables.
if (process.env.VERCEL_ENV === 'preview') {
  const direct = process.env.PREVIEW_DIRECT_URL || process.env.PREVIEW_DATABASE_URL_UNPOOLED
  if (process.env.PREVIEW_DATABASE_ISOLATED !== 'true' || !process.env.PREVIEW_DATABASE_URL || !direct) {
    throw new Error('An isolated preview database is required')
  }
  process.env.DATABASE_URL = process.env.PREVIEW_DATABASE_URL
  process.env.DIRECT_URL = direct
} else {
  if (process.env.NEON_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.NEON_DATABASE_URL
  } else if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL =
      process.env.PRISMA_DATABASE_URL ??
      process.env.POSTGRES_URL ??
      process.env.storage_PRISMA_DATABASE_URL ??
      process.env.storage_POSTGRES_URL ??
      process.env.storage_DATABASE_URL
  }

  if (process.env.NEON_DATABASE_URL_UNPOOLED) {
    process.env.DIRECT_URL = process.env.NEON_DATABASE_URL_UNPOOLED
  } else if (!process.env.DIRECT_URL) {
    process.env.DIRECT_URL =
      process.env.POSTGRES_URL ??
      process.env.storage_POSTGRES_URL ??
      process.env.PRISMA_DATABASE_URL ??
      process.env.storage_PRISMA_DATABASE_URL ??
      process.env.DATABASE_URL
  }
}
