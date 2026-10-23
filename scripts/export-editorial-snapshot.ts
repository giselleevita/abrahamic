import prisma from '../src/lib/prisma'
import { writeFileSync } from 'node:fs'
async function main() {
const [course, comparisons] = await Promise.all([
  prisma.course.findUnique({ where: { slug: 'abraham-across-traditions' }, select: { slug: true, title: true, isPublished: true, chapters: { where: { isPublished: true }, orderBy: { position: 'asc' }, select: { slug: true, title: true, summary: true, learningObjective: true, takeaway: true } } } }),
  prisma.comparison.findMany({ where: { isPublished: true, claims: { some: { claim: { isPublished: true, figures: { some: { figure: { slug: 'abraham' } } } } } } }, orderBy: { id: 'asc' }, take: 3, select: { id: true, title: true, summary: true, sharedGround: true, keyDifferences: true, updatedAt: true, claims: { where: { claim: { isPublished: true } }, orderBy: { position: 'asc' }, select: { claim: { select: { id: true, statement: true, source: { select: { title: true, tradition: true, slug: true } }, verses: { select: { verse: { select: { referenceKey: true, book: true, chapter: true, verse: true, versification: true } } } } } } } } } }),
])
writeFileSync('docs/release/EDITORIAL_SNAPSHOT.json', JSON.stringify({ generatedAt: new Date().toISOString(), scope: 'Seeded local demonstration records; project publication flags are not independent scholarly review. No scripture excerpts included.', course, homepageComparisons: comparisons }, null, 2) + '\n')

}
main().catch(() => { console.error('Snapshot export failed'); process.exitCode = 1 }).finally(() => prisma.$disconnect())
