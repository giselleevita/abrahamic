import { seedFamilyReferences } from '../prisma/seed/family-references'
import prisma from '../src/lib/prisma'
import { seedJourneys } from '../prisma/seed/journeys'

async function main() {
  if (await prisma.source.count() === 0) {
    console.log('New database detected; loading initial demo content...')
    const { spawnSync } = await import('node:child_process')
    const result = spawnSync('npx', ['prisma', 'db', 'seed'], {
      env: process.env,
      stdio: 'inherit',
    })
    if (result.status !== 0) process.exit(result.status ?? 1)
    return
  }

  if (process.env.VERCEL_ENV === 'preview') await seedFamilyReferences(prisma)

  console.log('Seeding deployment-owned journey content only...')
  await seedJourneys(prisma)
  console.log('Journey seed complete')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
