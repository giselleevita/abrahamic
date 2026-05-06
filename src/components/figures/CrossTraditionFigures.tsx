'use client'

import type { Figure } from '@prisma/client'
import { TRADITION_COLORS } from '@/lib/constants'

interface CrossTraditionFiguresProps {
  figures: Array<
    Figure & {
      aliases?: Array<{ tradition: string; name: string }>
    }
  >
}

export function CrossTraditionFigures({ figures }: CrossTraditionFiguresProps) {
  const crossTraditionFigures = figures.filter(f => {
    const traditionsCount = new Set(f.aliases?.map(a => a.tradition) || []).size
    return traditionsCount > 1
  })

  if (crossTraditionFigures.length === 0) {
    return null
  }

  return (
    <section className="rounded-lg border border-violet-300 bg-violet-50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-violet-900">Shared Figures</h2>
      <p className="mb-6 text-violet-800">
        These figures appear in multiple Abrahamic traditions, though sometimes with different names
        and roles.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {crossTraditionFigures.map(figure => (
          <div key={figure.id} className="rounded-lg bg-white p-4 shadow-sm">
            <a href={`/figures/${figure.slug}`} className="block">
              <h3 className="font-semibold text-gray-900 hover:text-blue-600">{figure.canonicalName}</h3>
            </a>

            <div className="mt-3 space-y-2">
              {figure.aliases?.map(alias => (
                <div key={`${figure.id}-${alias.tradition}`} className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: TRADITION_COLORS[alias.tradition as keyof typeof TRADITION_COLORS] }}
                  />
                  <span className="text-sm font-medium text-gray-700">{alias.name}</span>
                  <span className="text-xs text-gray-500">{alias.tradition}</span>
                </div>
              ))}
            </div>

            {figure.legacy && <p className="mt-3 text-sm text-gray-600">{figure.legacy}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
