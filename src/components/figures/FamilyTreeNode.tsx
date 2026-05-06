'use client'

import type { Figure } from '@prisma/client'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface FamilyTreeNodeProps {
  figure: Figure & {
    relationsFrom?: Array<{ toFigure: Figure; relationType: string }>
  }
  depth?: number
  isRoot?: boolean
}

export function FamilyTreeNode({ figure, depth = 0, isRoot = false }: FamilyTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(isRoot)
  const children = figure.relationsFrom?.filter(r => r.relationType === 'PARENT') || []

  return (
    <div className={`${depth > 0 ? 'ml-8' : ''}`}>
      <div className="flex items-center gap-2 py-2">
        {children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0 hover:bg-gray-200 rounded"
          >
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
        {children.length === 0 && <div className="w-6" />}

        <div className="flex-1">
          <a
            href={`/figures/${figure.slug}`}
            className="font-semibold text-blue-600 hover:underline"
          >
            {figure.canonicalName}
          </a>
          {figure.legacy && <p className="text-sm text-gray-600">{figure.legacy}</p>}
        </div>
      </div>

      {isExpanded && children.length > 0 && (
        <div>
          {children.map(relation => (
            <FamilyTreeNode
              key={relation.toFigure.id}
              figure={relation.toFigure}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
