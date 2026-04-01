import prisma from '@/lib/prisma'
import Link from 'next/link'
import { COMPARISON_TAG_LABEL, COMPARISON_TAG_STYLE } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'

export default async function AdminComparisonsPage() {
  const comparisons = await prisma.comparison.findMany({
    include: {
      claims: {
        include: { claim: { include: { source: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Comparisons ({comparisons.length})</h1>
        <Link
          href="/admin/comparisons/new"
          className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          + New Comparison
        </Link>
      </div>

      <div className="space-y-2">
        {comparisons.map((comp) => (
          <Link
            key={comp.id}
            href={`/admin/comparisons/${comp.id}`}
            className="flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
          >
            <div className="flex flex-col gap-1 flex-shrink-0">
              <Badge className={COMPARISON_TAG_STYLE[comp.tag]}>
                {COMPARISON_TAG_LABEL[comp.tag]}
              </Badge>
              <span className={`rounded-full px-2 py-0.5 text-xs text-center ${comp.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                {comp.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-900">{comp.title}</p>
              <p className="mt-0.5 text-xs text-stone-400">
                {comp.claims.length} claims ·{' '}
                {comp.claims.map((cc) => cc.claim.source.title).join(', ')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
