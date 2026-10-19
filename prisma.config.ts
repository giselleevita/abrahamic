import 'dotenv/config'
import { defineConfig } from 'prisma/config'

function resolveMigrationUrl(): string {
  if (process.env.VERCEL_ENV === 'preview') {
    const direct = process.env.PREVIEW_DIRECT_URL || process.env.PREVIEW_DATABASE_URL_UNPOOLED
    if (process.env.PREVIEW_DATABASE_ISOLATED !== 'true' || !direct) throw new Error('An isolated preview database is required')
    return direct
  }
  return (
    process.env.NEON_DATABASE_URL_UNPOOLED ??
    process.env.NEON_DATABASE_URL ??
    process.env.DIRECT_URL ??
    process.env.POSTGRES_URL ??
    process.env.storage_POSTGRES_URL ??
    process.env.PRISMA_DATABASE_URL ??
    process.env.storage_PRISMA_DATABASE_URL ??
    process.env.DATABASE_URL ??
    process.env.storage_PRISMA_DATABASE_URL ??
    process.env.storage_POSTGRES_URL ??
    process.env.storage_DATABASE_URL ??
    'postgresql://localhost:5432/abrahamic'
  )
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed/index.ts',
  },
  datasource: {
    url: resolveMigrationUrl(),
  },
})
