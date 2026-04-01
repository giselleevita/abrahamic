import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Figures' }
export const dynamic = 'force-dynamic'

export default async function FiguresPage() {
  const figures = await prisma.figure.findMany({
    include: {
      aliases: { orderBy: { tradition: 'asc' } },
      _count: { select: { claims: true } },
    },
    orderBy: { canonicalName: 'asc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900">Figures</h1>
      <p className="mb-10 text-stone-500">
        Key persons mentioned across the Abrahamic scriptures, with their names in each tradition.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((figure) => (
          <Link
            key={figure.slug}
            href={`/figures/${figure.slug}`}
            className="rounded-xl border border-stone-200 bg-white p-5 hover:border-stone-400 hover:shadow-sm transition-all"
          >
            <h2 className="text-lg font-semibold text-stone-900">{figure.canonicalName}</h2>

            {figure.description && (
              <p className="mt-2 line-clamp-3 text-sm text-stone-500">{figure.description}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-1.5">
              {figure.aliases.map((alias) => (
                <Badge key={alias.id} className={TRADITION_BG[alias.tradition]}>
                  {alias.name}
                </Badge>
              ))}
            </div>

            <p className="mt-3 text-xs text-stone-400">
              {figure._count.claims} claim{figure._count.claims !== 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
