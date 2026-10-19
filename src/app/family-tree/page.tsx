import { PUBLIC_FAMILY_RELATIONS } from '@/lib/queries/family-relations'
import prisma from '@/lib/prisma'
import { FamilyExplorer } from '@/components/figures/FamilyExplorer'
import { PageIntro } from '@/components/layout/PageIntro'
export const revalidate = 3600
export default async function FamilyTreePage() {
  const [figures, edges] = await Promise.all([
    prisma.figure.findMany({ select: { id: true, canonicalName: true, slug: true, aliases: { select: { name: true, tradition: true } } }, orderBy: { canonicalName: 'asc' } }),
    prisma.figureRelation.findMany({ where: PUBLIC_FAMILY_RELATIONS, select: { id: true, fromFigureId: true, toFigureId: true, relationType: true, notes: true, source: { select: { slug: true, title: true, tradition: true } }, verse: { select: { book: true, chapter: true, verse: true, versification: true } } }, orderBy: { id: 'asc' } }),
  ])
  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><PageIntro eyebrow="People & connections" title="Abrahamic Genealogy" description="Trace the families that connect these stories. Explore one lineage, compare recorded traditions, and follow each relationship back to its source." /><p className="mb-6 text-sm text-[var(--text-muted)]">These are project-curated relationships with recorded references. Connections awaiting source or identity verification are withheld from this view.</p><FamilyExplorer figures={figures} edges={edges} /></div>
}
