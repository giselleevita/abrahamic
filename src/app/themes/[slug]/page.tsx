import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ClaimCard } from '@/components/claims/ClaimCard'
import { ComparisonTagFilter } from '@/components/claims/ComparisonTagFilter'
import { Tabs } from '@/components/ui/Tabs'
import { SOURCE_ORDER } from '@/lib/constants'
import type { ClaimWithRelations, ComparisonWithClaims } from '@/types'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const themes = await prisma.theme.findMany({ select: { slug: true } })
    return themes.map((t) => ({ slug: t.slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const theme = await prisma.theme.findUnique({ where: { slug }, select: { name: true } })
  if (!theme) return {}
  return { title: theme.name }
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const theme = await prisma.theme.findUnique({ where: { slug } })
  if (!theme) notFound()

  const publishedClaims = await prisma.claim.findMany({
    where: { isPublished: true, themes: { some: { theme: { slug } } } },
    include: {
      source: true,
      verses: {
        include: {
          verse: { include: { translations: { where: { isDefault: true } } } },
        },
      },
      figures: { include: { figure: true } },
      themes: { include: { theme: true } },
    },
  }) as unknown as ClaimWithRelations[]

  const claimsBySource = SOURCE_ORDER.reduce<Record<string, ClaimWithRelations[]>>((acc, key) => {
    acc[key] = publishedClaims.filter((c) => c.source.key === key)
    return acc
  }, {})

  // Fetch comparisons that contain at least one claim in this theme
  const themeComparisons = await prisma.comparison.findMany({
    where: {
      isPublished: true,
      claims: {
        some: {
          claim: { themes: { some: { theme: { slug } } } },
        },
      },
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
  }) as unknown as ComparisonWithClaims[]

  const claimsContent = publishedClaims.length === 0 ? (
    <p className="text-stone-500">No published claims yet for this theme.</p>
  ) : (
    <div className="space-y-10">
      {SOURCE_ORDER.map((key) => {
        const claims = claimsBySource[key]
        if (!claims || claims.length === 0) return null
        return (
          <section key={key}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
              {claims[0].source.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {claims.map((claim) => (
                <ClaimCard key={claim.id} claim={claim} showSource={false} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )

  const comparisonsContent = themeComparisons.length === 0 ? (
    <p className="text-stone-500">No comparisons yet for this theme.</p>
  ) : (
    <ComparisonTagFilter comparisons={themeComparisons} basePath="/comparisons" />
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div
          className="mb-1 inline-block rounded-full px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: theme.color + '22', color: theme.color ?? undefined }}
        >
          Theme
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">{theme.name}</h1>
        {theme.description && (
          <p className="mt-3 text-stone-600 leading-relaxed">{theme.description}</p>
        )}
      </div>

      <Tabs
        tabs={[
          { label: `Claims (${publishedClaims.length})`, content: claimsContent },
          { label: `Comparisons (${themeComparisons.length})`, content: comparisonsContent },
        ]}
      />
    </div>
  )
}
