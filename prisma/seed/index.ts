import { PrismaClient } from '@prisma/client'
import { seedSources } from './sources'
import { seedThemes } from './themes'
import { seedFigures } from './figures'
import { seedFigureRelationships } from './relationships'
import { seedFigureLegacy } from './legacy'
import { seedVerses } from './verses'
import { seedClaims } from './claims'
import { seedComparisons } from './comparisons'
import { seedConcepts } from './concepts'
import { seedTimeline } from './timeline'
import { seedVerseLinks } from './verseLinks'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')
  await seedSources(prisma)
  await seedThemes(prisma)
  await seedFigures(prisma)
  await seedFigureRelationships(prisma)
  await seedFigureLegacy(prisma)
  await seedVerses(prisma)
  await seedClaims(prisma)
  await seedComparisons(prisma)
  await seedConcepts(prisma)
  await seedTimeline(prisma)
  await seedVerseLinks(prisma)   // ← must run after verses are seeded
  console.log('\n✅ Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
