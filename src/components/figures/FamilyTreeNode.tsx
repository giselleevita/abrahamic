'use client'

import type { Figure } from '@prisma/client'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface FamilyTreeNodeProps {
  figure: Figure & {
    relationsFrom?: Array<{
      toFigure: Figure
      relationType: string
      notes?: string | null
      source?: { id: number; key: string; title: string } | null
      verse?: { id: number; book: string; chapter: number; verse: number; referenceKey: string } | null
    }>
  }
  depth?: number
  isRoot?: boolean
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  PARENT: '→',
  CHILD: '↓',
  SPOUSE: '♥',
  SIBLING: '∞',
  DESCENDANT: '↓↓',
}

const SOURCE_COLORS: Record<string, { badge: string; dot: string }> = {
  TORAH: { badge: 'bg-jewish-700 text-jewish-50 border border-jewish-600', dot: 'bg-jewish-500' },
  HEBREW_BIBLE: { badge: 'bg-jewish-700 text-jewish-50 border border-jewish-600', dot: 'bg-jewish-500' },
  NEW_TESTAMENT: { badge: 'bg-christian-700 text-christian-50 border border-christian-600', dot: 'bg-christian-500' },
  QURAN: { badge: 'bg-islamic-700 text-islamic-50 border border-islamic-600', dot: 'bg-islamic-500' },
}

function VerseReference({
  verse,
  source,
}: {
  verse: { book: string; chapter: number; verse: number }
  source?: { key: string; title: string } | null
}) {
  const sourceKey = source?.key || 'QURAN'
  const colors = SOURCE_COLORS[sourceKey] || SOURCE_COLORS.ISLAMIC

  return (
    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap inline-flex items-center gap-1 ${colors.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {verse.book} {verse.chapter}:{verse.verse}
    </span>
  )
}

export function FamilyTreeNode({ figure, depth = 0, isRoot = false }: FamilyTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(isRoot)
  const children = figure.relationsFrom?.filter(r => r.relationType === 'PARENT') || []
  const hasRelations = children.length > 0

  return (
    <div className={`${depth > 0 ? 'ml-8' : ''}`}>
      <div className="flex items-start gap-2 py-2">
        {hasRelations && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0 hover:bg-gray-100 rounded flex-shrink-0"
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
        {!hasRelations && <div className="w-6 flex-shrink-0" />}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`/figures/${figure.slug}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              {figure.canonicalName}
            </a>
            {children.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                {children.length} {children.length === 1 ? 'child' : 'children'}
              </span>
            )}
          </div>
          {figure.legacy && <p className="text-sm text-gray-600 mt-1">{figure.legacy}</p>}
        </div>
      </div>

      {isExpanded && children.length > 0 && (
        <div>
          {children.map(relation => (
            <div key={relation.toFigure.id}>
              {relation.verse && (
                <div className="ml-6 py-1 flex items-center gap-2">
                  <VerseReference verse={relation.verse} source={relation.source} />
                </div>
              )}
              {relation.notes && (
                <div className="ml-6 text-xs text-gray-500 italic py-1">{relation.notes}</div>
              )}
              <FamilyTreeNode
                figure={relation.toFigure}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
