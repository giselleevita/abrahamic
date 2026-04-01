import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { ComparisonBlock } from '@/components/claims/ComparisonBlock'
import { COMPARISON_TAG_LABEL } from '@/lib/constants'
import type { ComparisonWithClaims } from '@/types'

export const metadata: Metadata = { title: 'Comparisons' }
export const dynamic = 'force-dynamic'

export default async function ComparisonsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const validTags = ['SHARED', 'SIMILAR_DIFFERENT', 'CONTRADICTION'] as const

  const comparisons = await prisma.comparison.findMany({
    where: {
      isPublished: true,
      ...(tag && validTags.includes(tag as any) ? { tag: tag as any } : {}),
    },
    include: {
      claims: {
        orderBy: { position: 'asc' },
        include: {
          claim: {
            include: {
              source: true,
              verses: {
                where: { isPrimary: true },
                include: {
                  verse: { include: { translations: { where: { isDefault: true } } } },
                },
              },
              figures: { include: { figure: true } },
              themes: { include: { theme: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900">Comparisons</h1>
      <p className="mb-6 text-stone-500">
        Editorially authored comparisons of claims across traditions.
      </p>

      {/* Tag filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/comparisons"
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            !tag ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
          }`}
        >
          All
        </Link>
        {validTags.map((t) => (
          <Link
            key={t}
            href={`/comparisons?tag=${t}`}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              tag === t ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
            }`}
          >
            {COMPARISON_TAG_LABEL[t]}
          </Link>
        ))}
      </div>

      {comparisons.length === 0 ? (
        <p className="text-stone-500">No comparisons found.</p>
      ) : (
        <div className="space-y-8">
          {comparisons.map((comp) => (
            <div key={comp.id} className="rounded-xl border border-stone-200 bg-white p-6">
              <ComparisonBlock
                comparison={comp as unknown as ComparisonWithClaims}
                showSummary={false}
              />
              <div className="mt-4">
                <Link
                  href={`/comparisons/${comp.id}`}
                  className="text-xs text-stone-400 hover:text-stone-600"
                >
                  Full comparison with summary →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
