import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ComparisonBlock } from '@/components/claims/ComparisonBlock'
import { ControversialBanner } from '@/components/claims/ControversialBanner'
import type { ComparisonWithClaims } from '@/types'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const comp = await prisma.comparison.findUnique({ where: { id: parseInt(id) }, select: { title: true } })
  if (!comp) return {}
  return { title: comp.title }
}

export default async function ComparisonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const comparison = await prisma.comparison.findUnique({
    where: { id: parseInt(id), isPublished: true },
    include: {
      claims: {
        orderBy: { position: 'asc' },
        include: {
          claim: {
            include: {
              source: true,
              verses: {
                include: {
                  verse: { include: { translations: true } },
                },
              },
              figures: { include: { figure: true } },
              themes: { include: { theme: true } },
            },
          },
        },
      },
    },
  })

  if (!comparison) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/comparisons" className="hover:text-stone-700">Comparisons</Link>
        <span>/</span>
        <span className="text-stone-900">{comparison.title}</span>
      </nav>

      {comparison.isControversial && (
        <div className="mb-6">
          <ControversialBanner />
        </div>
      )}

      <ComparisonBlock comparison={comparison as unknown as ComparisonWithClaims} showSummary />

      {/* Attribution + editorial note */}
      <div className="mt-8 rounded-lg border border-stone-100 bg-stone-50 p-4 space-y-2">
        <p className="text-xs text-stone-500">
          This comparison was editorially authored and peer-reviewed. The tag ({comparison.tag.replace('_', ' ')}) is
          an editorial judgment, not an automated determination. All claims cite their source verses directly.
        </p>
        <p className="text-xs text-stone-400">
          Published{' '}
          {comparison.createdAt.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          {comparison.createdById && ` · ${comparison.createdById}`}
        </p>
      </div>
    </div>
  )
}
