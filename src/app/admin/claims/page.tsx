import prisma from '@/lib/prisma'
import Link from 'next/link'
import { TRADITION_BG } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export default async function AdminClaimsPage() {
  const claims = await prisma.claim.findMany({
    include: {
      source: true,
      verses: {
        where: { isPrimary: true },
        include: { verse: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Claims ({claims.length})</h1>
        <Link
          href="/admin/claims/new"
          className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          + New Claim
        </Link>
      </div>

      <div className="space-y-2">
        {claims.map((claim) => {
          const primaryVerse = claim.verses[0]?.verse
          return (
            <Link
              key={claim.id}
              href={`/admin/claims/${claim.id}`}
              className="flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
            >
              <div className="flex flex-col gap-1 flex-shrink-0">
                <Badge className={TRADITION_BG[claim.source.tradition]}>
                  {claim.source.title}
                </Badge>
                <span className={`rounded-full px-2 py-0.5 text-xs text-center ${claim.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                  {claim.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-800 line-clamp-2">{claim.statement}</p>
                {primaryVerse && (
                  <p className="mt-1 text-xs text-stone-400">
                    {primaryVerse.book} {primaryVerse.chapter}:{primaryVerse.verse}
                  </p>
                )}
              </div>
              <span className="text-xs text-stone-300 flex-shrink-0">#{claim.id}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
