import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminSourcesPage() {
  const sources = await prisma.source.findMany({
    include: { _count: { select: { verses: true, claims: true } } },
    orderBy: { id: 'asc' },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Sources</h1>
        <p className="mt-1 text-sm text-stone-500">
          The four canonical sources. Title, short name, language, and description can be edited.
          Tradition and key are fixed.
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white divide-y divide-stone-100">
        {sources.map((source) => (
          <div key={source.id} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-stone-900">{source.title}</p>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                  {source.tradition}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {source.language} · {source._count.verses} verses · {source._count.claims} claims
              </p>
            </div>
            <Link
              href={`/admin/sources/${source.key.toLowerCase()}`}
              className="rounded border border-stone-200 px-3 py-1 text-xs text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
