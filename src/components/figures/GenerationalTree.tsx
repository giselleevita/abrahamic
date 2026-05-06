'use client'

import type { Figure } from '@prisma/client'
import Link from 'next/link'

interface FigureWithRelations extends Figure {
  relationsFrom?: Array<{
    toFigure: Figure
    relationType: string
    notes?: string | null
    source?: { id: number; key: string; title: string } | null
    verse?: { id: number; book: string; chapter: number; verse: number; referenceKey: string } | null
  }>
}

interface GenerationalTreeProps {
  figures: FigureWithRelations[]
  tradition: string
}

interface FigureNode {
  figure: FigureWithRelations
  generation: number
  children: FigureNode[]
}

function calculateGenerations(
  figures: FigureWithRelations[],
  figureId: number,
  generations: Map<number, number> = new Map(),
  gen: number = 0
): Map<number, number> {
  const existing = generations.get(figureId)
  if (existing !== undefined && existing >= gen) return generations

  generations.set(figureId, gen)

  const figure = figures.find(f => f.id === figureId)
  if (!figure?.relationsFrom) return generations

  figure.relationsFrom
    .filter(r => r.relationType === 'PARENT')
    .forEach(relation => {
      calculateGenerations(figures, relation.toFigure.id, generations, gen + 1)
    })

  return generations
}

function buildFamilyTree(
  figure: FigureWithRelations,
  generations: Map<number, number>
): FigureNode {
  const children = (figure.relationsFrom?.filter(r => r.relationType === 'PARENT') || []).map(
    relation => buildFamilyTree(relation.toFigure, generations)
  )

  return {
    figure,
    generation: generations.get(figure.id) ?? 0,
    children,
  }
}

function FigureCard({ node }: { node: FigureNode }) {
  return (
    <div className="bg-white rounded-lg border border-primary-800 p-4 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/figures/${node.figure.slug}`} className="block">
        <h3 className="font-semibold text-primary-50 hover:text-gold-400 transition-colors">
          {node.figure.canonicalName}
        </h3>
      </Link>
      {node.figure.legacy && <p className="text-xs text-primary-400 mt-1 line-clamp-2">{node.figure.legacy}</p>}
    </div>
  )
}

function GenerationRow({
  generation,
  figuresInGen,
  spine,
}: {
  generation: number
  figuresInGen: FigureNode[]
  spine: { x: string; color: string }
}) {
  return (
    <div className="relative mb-12">
      {/* Generation label and spine connector */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`flex-shrink-0 w-20 ${spine.color} border-r-2 border-primary-700 pt-2`}>
          <div className="text-xs font-semibold text-gold-500 text-right pr-3 tracking-wider">
            GEN {generation}
          </div>
        </div>

        {/* Timeline spine */}
        <div className="absolute left-[4.5rem] top-0 w-0.5 h-full bg-gradient-to-b from-gold-500 to-gold-500/20" />
      </div>

      {/* Figures grid */}
      <div className="ml-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {figuresInGen.map(node => (
          <FigureCard key={node.figure.id} node={node} />
        ))}
      </div>
    </div>
  )
}

export function GenerationalTree({ figures, tradition }: GenerationalTreeProps) {
  const traditions = {
    JEWISH: { color: 'bg-jewish-900/20', label: 'Jewish lineage' },
    CHRISTIAN: { color: 'bg-christian-900/20', label: 'Christian lineage' },
    ISLAMIC: { color: 'bg-islamic-900/20', label: 'Islamic lineage' },
  } as const

  const config = traditions[tradition as keyof typeof traditions] || traditions.JEWISH

  // Find root figures (those with no parent in this tradition)
  const rootFigures = figures.filter(f => {
    const hasParent = figures.some(other => {
      if (!other.relationsFrom) return false
      return other.relationsFrom.some(r => r.toFigureId === f.id && r.relationType === 'PARENT')
    })
    return !hasParent
  })

  // Calculate generations for all figures
  const generations = new Map<number, number>()
  rootFigures.forEach(root => {
    calculateGenerations(figures, root.id, generations, 0)
  })

  // Group figures by generation
  const figuresByGen = new Map<number, FigureNode[]>()
  rootFigures.forEach(root => {
    const tree = buildFamilyTree(root, generations)
    const queue: FigureNode[] = [tree]

    while (queue.length > 0) {
      const node = queue.shift()!
      const gen = node.generation

      if (!figuresByGen.has(gen)) {
        figuresByGen.set(gen, [])
      }
      figuresByGen.get(gen)!.push(node)

      queue.push(...node.children)
    }
  })

  // Sort generations
  const sortedGens = Array.from(figuresByGen.keys()).sort((a, b) => a - b)

  return (
    <div className={`rounded-lg p-8 ${config.color}`}>
      <h2 className="text-2xl font-bold mb-8 capitalize text-primary-50">{config.label}</h2>

      <div className="space-y-0">
        {sortedGens.map(gen => (
          <GenerationRow
            key={gen}
            generation={gen}
            figuresInGen={figuresByGen.get(gen) ?? []}
            spine={{ x: '4.5rem', color: config.color }}
          />
        ))}
      </div>
    </div>
  )
}
