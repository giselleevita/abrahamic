import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Sources' }
export const dynamic = 'force-dynamic'

export default async function SourcesPage() {
  const sources = await prisma.source.findMany({
    include: { _count: { select: { verses: true, claims: true } } },
    orderBy: { id: 'asc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900">Sources</h1>
      <p className="mb-10 text-stone-500">
        The four canonical scriptures of the Abrahamic traditions.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {sources.map((source) => (
          <Link
            key={source.slug}
            href={`/sources/${source.slug}`}
            className="rounded-xl border border-stone-200 bg-white p-6 hover:border-stone-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-stone-900">{source.title}</h2>
              <Badge className={TRADITION_BG[source.tradition]}>{source.tradition}</Badge>
            </div>

            <p className="mt-1 text-sm text-stone-400">{source.language}</p>

            {source.description && (
              <p className="mt-3 line-clamp-4 text-sm text-stone-600 leading-relaxed">
                {source.description}
              </p>
            )}

            <div className="mt-4 flex gap-4 text-xs text-stone-400">
              <span>{source._count.verses} verses</span>
              <span>{source._count.claims} claims</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
