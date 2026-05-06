'use client'

import type { Figure } from '@prisma/client'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface FamilyTreeNodeProps {
  figure: Figure & {
    relationsFrom?: Array<{ toFigure: Figure; relationType: string; notes?: string }>
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
