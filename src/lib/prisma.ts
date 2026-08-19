import './prisma-env'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { isPublicDemoMode, stripLicensedTranslations } from '@/lib/queries/translation-guard'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  if (!isPublicDemoMode()) return client

  // Enforce the public-demo translation policy on every read, at every nesting
  // depth, so no query can surface licensed text by omitting a filter helper.
  return client.$extends({
    query: {
      async $allOperations({ args, query }) {
        return stripLicensedTranslations(await query(args))
      },
    },
  }) as unknown as PrismaClient
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
