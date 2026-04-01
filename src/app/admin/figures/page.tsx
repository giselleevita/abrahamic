import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminFiguresPage() {
  const figures = await prisma.figure.findMany({
    include: {
      aliases: { orderBy: { tradition: 'asc' } },
      _count: { select: { claims: true } },
    },
    orderBy: { canonicalName: 'asc' },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Figures</h1>
        <Link
          href="/admin/figures/new"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          + New Figure
        </Link>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white divide-y divide-stone-100">
        {figures.length === 0 && (
          <p className="p-6 text-sm text-stone-400">No figures yet.</p>
        )}
        {figures.map((figure) => (
          <div key={figure.id} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-900">{figure.canonicalName}</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {figure.aliases.map((a) => `${a.name} (${a.tradition})`).join(' · ') || 'No aliases'}
              </p>
            </div>
            <span className="text-xs text-stone-400">{figure._count.claims} claims</span>
            <Link
              href={`/admin/figures/${figure.slug}`}
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
