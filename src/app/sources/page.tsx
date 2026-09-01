import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { PageIntro } from '@/components/layout/PageIntro'

export const metadata: Metadata = { title: 'Sources' }
export const dynamic = 'force-dynamic'

export default async function SourcesPage() {
  const sources = await prisma.source.findMany({
    include: { _count: { select: { verses: true, claims: true } } },
    orderBy: { id: 'asc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <PageIntro eyebrow="Read" title="Source library" description="Choose a scripture or historical source. Each collection shows its language, available passages, and related comparisons." />

      <div className="grid gap-5 sm:grid-cols-2">
        {sources.map((source) => (
          <Link
            key={source.slug}
            href={`/sources/${source.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="mb-5 flex h-1.5 overflow-hidden rounded-full" aria-hidden="true"><span className="flex-1 bg-blue-500" /><span className="flex-1 bg-rose-500" /><span className="flex-1 bg-emerald-500" /></div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-950 group-hover:text-blue-800">{source.title}</h2>
              <Badge className={TRADITION_BG[source.tradition]}>{source.tradition}</Badge>
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-500">Language: {source.language}</p>

            {source.description && (
              <p className="mt-4 line-clamp-4 text-base text-slate-600 leading-7">
                {source.description}
              </p>
            )}

            <div className="mt-5 flex gap-4 text-sm font-semibold text-blue-700">
              <span>{source._count.verses} verses</span>
              <span>{source._count.claims} claims</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
