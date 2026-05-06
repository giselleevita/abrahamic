import prisma from '@/lib/prisma'
import Link from 'next/link'
import { TRADITION_COLORS } from '@/lib/constants'

async function getRootFigures() {
  const figures = await prisma.figure.findMany({
    take: 12,
    orderBy: { canonicalName: 'asc' },
    include: {
      aliases: {
        take: 1,
      },
      relationsFrom: {
        where: { relationType: 'PARENT' },
        take: 3,
        include: { toFigure: true },
      },
    },
  })

  return figures
}

export async function HorizontalFamilyTree() {
  const figures = await getRootFigures()

  return (
    <div className="overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-stone-600 scrollbar-track-stone-900">
      <div className="inline-flex gap-2 px-2 py-1.5">
        {figures.map(figure => {
          const tradition = figure.aliases?.[0]?.tradition || 'SHARED'
          const color = TRADITION_COLORS[tradition as keyof typeof TRADITION_COLORS]

          return (
            <Link
              key={figure.id}
              href={`/figures/${figure.slug}`}
              className="flex-shrink-0 inline-flex flex-col items-center gap-1 px-2 py-1 rounded hover:bg-stone-800 transition-colors group"
              title={figure.canonicalName}
            >
              <div
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                style={{ borderColor: color, backgroundColor: color + '20' }}
              >
                {figure.canonicalName.charAt(0)}
              </div>
              <span className="text-xs text-stone-400 group-hover:text-stone-200 max-w-12 truncate text-center">
                {figure.canonicalName.split(' ')[0]}
              </span>
              {figure.relationsFrom && figure.relationsFrom.length > 0 && (
                <div className="flex gap-0.5">
                  {figure.relationsFrom.slice(0, 2).map((rel, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {figure.relationsFrom.length > 2 && (
                    <span className="text-xs text-stone-500">+</span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
