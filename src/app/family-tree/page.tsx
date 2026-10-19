import prisma from '@/lib/prisma'
import { FamilyExplorer } from '@/components/figures/FamilyExplorer'
import { PageIntro } from '@/components/layout/PageIntro'
export const revalidate = 3600
export default async function FamilyTreePage() {
  const [figures, edges] = await Promise.all([
    prisma.figure.findMany({ select: { id: true, canonicalName: true, slug: true, aliases: { select: { name: true, tradition: true } } }, orderBy: { canonicalName: 'asc' } }),
    prisma.figureRelation.findMany({ select: { id: true, fromFigureId: true, toFigureId: true, relationType: true, notes: true, source: { select: { slug: true, title: true, tradition: true } }, verse: { select: { book: true, chapter: true, verse: true, versification: true } } }, orderBy: { id: 'asc' } }),
  ])
  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><PageIntro eyebrow="People & connections" title="Abrahamic Genealogy" description="Trace the families that connect these stories. Explore one lineage, compare recorded traditions, and follow each relationship back to its source." /><FamilyExplorer figures={figures} edges={edges} /></div>
}
