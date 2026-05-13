import prisma from '@/lib/prisma'
import { GenerationalTree } from '@/components/figures/GenerationalTree'
import { CrossTraditionFigures } from '@/components/figures/CrossTraditionFigures'
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
          source: true,
          verse: true,
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
    source?: {
      id: number
      key: string
      title: string
    } | null
    verse?: {
      id: number
      book: string
      chapter: number
      verse: number
      referenceKey: string
    } | null
    notes?: string | null
  }>
}

function FamilyTreeSection({ tradition, figures }: { tradition: Tradition; figures: FigureWithRelations[] }) {
  return (
    <section>
      <GenerationalTree figures={figures} tradition={tradition} />
    </section>
  )
}

export default async function FamilyTreePage() {
  try {
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
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-serif font-bold text-primary-50 mb-2">Abrahamic Genealogy</h1>
            <p className="text-lg text-primary-400 max-w-2xl">
              A comprehensive family tree organized by generation, showing the lineages of key figures across Judaism, Christianity, and Islam. Each generation is marked by a timeline spine, with figures grouped horizontally for easy comparison across traditions.
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
  } catch (error) {
    console.error('Error loading family tree:', error)
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-primary-50 mb-4">Abrahamic Genealogy</h1>
          <p className="text-primary-300">Loading family tree data...</p>
        </div>
      </div>
    )
  }
}
