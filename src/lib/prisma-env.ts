if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.PRISMA_DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.storage_PRISMA_DATABASE_URL ??
    process.env.storage_POSTGRES_URL ??
    process.env.storage_DATABASE_URL
}

if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.POSTGRES_URL ?? process.env.storage_POSTGRES_URL
}
