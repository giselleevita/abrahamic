import prisma from '@/lib/prisma'
import { FamilyTreeNode } from '@/components/figures/FamilyTreeNode'
import { CrossTraditionFigures } from '@/components/figures/CrossTraditionFigures'
import { TRADITION_BG } from '@/lib/constants'
import type { Tradition } from '@prisma/client'

const TRADITIONS: Tradition[] = ['JEWISH', 'CHRISTIAN', 'ISLAMIC']

async function getFiguresWithRelations(tradition: Tradition) {
  const figures = await prisma.figure.findMany({
    where: {
      aliases: {
        some: { tradition },
      },
    },
    include: {
      relationsFrom: {
        include: {
          toFigure: true,
        },
      },
    },
    orderBy: { canonicalName: 'asc' },
  })
  return figures
}

async function getAllFiguresWithAliases() {
  const figures = await prisma.figure.findMany({
    include: {
      aliases: true,
    },
    orderBy: { canonicalName: 'asc' },
  })
  return figures
}

interface FigureWithRelations {
  id: number
  canonicalName: string
  slug: string
  description: string | null
  imageUrl: string | null
  legacy: string | null
  createdAt: Date
  updatedAt: Date
  relationsFrom?: Array<{
    toFigure: {
      id: number
      canonicalName: string
      slug: string
      description: string | null
      imageUrl: string | null
      legacy: string | null
      createdAt: Date
      updatedAt: Date
    }
    relationType: string
    toFigureId: number
  }>
}

function FamilyTreeSection({ tradition, figures }: { tradition: Tradition; figures: FigureWithRelations[] }) {
  const rootFigures = figures.filter(f => {
    const hasParent = figures.some(other => {
      if (!other.relationsFrom) return false
      return other.relationsFrom.some(
        (r) => r.toFigureId === f.id && r.relationType === 'PARENT'
      )
    })
    return !hasParent
  })

  return (
    <section className={`rounded-lg p-6 ${TRADITION_BG[tradition]}`}>
      <h2 className="text-2xl font-bold mb-6 capitalize">{tradition.toLowerCase()} lineage</h2>

      {rootFigures.length > 0 ? (
        <div className="space-y-4">
          {rootFigures.map(figure => (
            <FamilyTreeNode key={figure.id} figure={figure} isRoot />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No figures found for this tradition.</p>
      )}
    </section>
  )
}

export default async function FamilyTreePage() {
  const [figuresByTradition, allFigures] = await Promise.all([
    Promise.all(
      TRADITIONS.map(async tradition => ({
        tradition,
        figures: await getFiguresWithRelations(tradition),
      }))
    ),
    getAllFiguresWithAliases(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Abrahamic Genealogy</h1>
          <p className="text-lg text-slate-600">
            A comprehensive family tree of key figures across Judaism, Christianity, and Islam,
            showing relationships, lineages, and contributions to religious thought.
          </p>
        </header>

        <div className="mb-12">
          <CrossTraditionFigures figures={allFigures} />
        </div>

        <div className="space-y-8">
          {figuresByTradition.map(({ tradition, figures }) => (
            <FamilyTreeSection key={tradition} tradition={tradition} figures={figures} />
          ))}
        </div>
      </div>
    </div>
  )
}
