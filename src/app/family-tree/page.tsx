import { PUBLIC_FAMILY_RELATIONS } from '@/lib/queries/family-relations'
import prisma from '@/lib/prisma'
import { BigPictureDiagram } from '@/components/figures/BigPictureDiagram'
import { FamilyTreeDiagram } from '@/components/figures/FamilyTreeDiagram'
import { FamilyExplorer } from '@/components/figures/FamilyExplorer'
import { PageIntro } from '@/components/layout/PageIntro'
export const revalidate = 3600
export default async function FamilyTreePage() {
  const [figures, edges] = await Promise.all([
    prisma.figure.findMany({ select: { id: true, canonicalName: true, slug: true, aliases: { select: { name: true, tradition: true } } }, orderBy: { canonicalName: 'asc' } }),
    prisma.figureRelation.findMany({ where: PUBLIC_FAMILY_RELATIONS, select: { id: true, fromFigureId: true, toFigureId: true, relationType: true, notes: true, source: { select: { slug: true, title: true, tradition: true } }, verse: { select: { book: true, chapter: true, verse: true, versification: true } } }, orderBy: { id: 'asc' } }),
  ])
  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><PageIntro plainWords="The top diagram shows how the three traditions grew from the same roots. Below it, the family tree shows who was whose parent." eyebrow="People & connections" title="Abrahamic Genealogy" description="Trace the families that connect these stories. Explore one lineage, compare recorded traditions, and follow each relationship back to its source." /><p className="mb-6 text-sm text-[var(--text-muted)]">These are project-curated relationships with recorded references. Connections awaiting source or identity verification are withheld from this view.</p><BigPictureDiagram /><div className="mt-14 border-t border-primary-200 pt-10"><FamilyTreeDiagram figures={figures} edges={edges} /></div><div className="mt-12 border-t border-primary-200 pt-10"><h2 className="mb-2 font-serif text-2xl text-primary-950">Explore the connections</h2><p className="mb-6 text-sm text-primary-700">Search, filter by tradition, or focus on one lineage. Every relationship is listed with its source.</p><FamilyExplorer figures={figures} edges={edges} /></div></div>
}
