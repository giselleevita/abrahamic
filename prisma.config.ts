import 'dotenv/config'
import { defineConfig } from 'prisma/config'

function resolveMigrationUrl(): string {
  return (
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
