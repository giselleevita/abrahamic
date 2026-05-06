import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { ClaimCard } from '@/components/claims/ClaimCard'
import type { ClaimWithRelations } from '@/types'

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

  const theme = await prisma.theme.findUnique({
    where: { slug },
    include: {
      claims: {
        include: {
          claim: {
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
          },
        },
        orderBy: { claim: { createdAt: 'desc' } },
      },
    },
  })

  if (!theme) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
        <a href="/search" className="hover:text-stone-700">Search</a>
        <span>/</span>
        <span className="text-stone-900">{theme.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">{theme.name}</h1>
        {theme.color && (
          <div className="mt-4 h-3 w-20 rounded-full" style={{ backgroundColor: theme.color }}></div>
        )}
        {theme.description && (
          <p className="mt-4 text-lg text-stone-700">{theme.description}</p>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-stone-900">
          Claims ({theme.claims.length})
        </h2>
        {theme.claims.length === 0 ? (
          <p className="text-stone-500">No claims tagged with this theme yet.</p>
        ) : (
          <div className="space-y-4">
            {theme.claims.map((tc) => (
              <ClaimCard key={tc.claim.id} claim={tc.claim as unknown as ClaimWithRelations} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
