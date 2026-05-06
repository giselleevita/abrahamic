import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Tabs } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { ClaimCard } from '@/components/claims/ClaimCard'
import { TRADITION_BG } from '@/lib/constants'
import type { ClaimWithRelations } from '@/types'

const CATEGORY_LABEL: Record<string, string> = {
  THEOLOGY: 'Theology',
  SOTERIOLOGY: 'Soteriology',
  ESCHATOLOGY: 'Eschatology',
  PROPHETHOOD: 'Prophethood',
  PRACTICE: 'Practice',
  LAW: 'Law & Covenant',
  COSMOLOGY: 'Cosmology',
}

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const concepts = await prisma.concept.findMany({ where: { isPublished: true }, select: { slug: true } })
    return concepts.map((c) => ({ slug: c.slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const concept = await prisma.concept.findUnique({ where: { slug }, select: { name: true } })
  if (!concept) return {}
  return { title: concept.name }
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const concept = await prisma.concept.findUnique({
    where: { slug },
    include: {
      traditions: { orderBy: { tradition: 'asc' } },
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
        orderBy: { position: 'asc' },
      },
    },
  })

  if (!concept || !concept.isPublished) notFound()

  const overviewContent = (
    <div className="space-y-8">
      {concept.summary && (
        <p className="text-lg leading-relaxed text-stone-700">{concept.summary}</p>
      )}

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-600">
          Definition across traditions
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {concept.traditions.map((tradition) => (
            <div key={tradition.id} className="rounded-lg border border-stone-200 bg-white p-4">
              <Badge className={TRADITION_BG[tradition.tradition]}>
                {tradition.tradition}
              </Badge>
              <p className="mt-3 text-sm font-medium text-stone-900">{tradition.definition}</p>
              {tradition.nuances && (
                <p className="mt-2 text-xs text-stone-500">{tradition.nuances}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const claimsContent = concept.claims.length === 0 ? (
    <p className="text-stone-500">No claims yet for this concept.</p>
  ) : (
    <div className="space-y-4">
      {concept.claims.map((cc) => (
        <ClaimCard key={cc.claim.id} claim={cc.claim as unknown as ClaimWithRelations} />
      ))}
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-stone-500">
        <Link href="/concepts" className="hover:text-stone-700">Concepts</Link>
        <span>/</span>
        <span className="text-stone-900">{concept.name}</span>
      </nav>

      <div className="mb-8">
        <div className="mb-3 inline-block">
          <Badge className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
            {CATEGORY_LABEL[concept.category] || concept.category}
          </Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">{concept.name}</h1>
      </div>

      <Tabs
        tabs={[
          { label: 'Overview', content: overviewContent },
          { label: `Claims (${concept.claims.length})`, content: claimsContent },
        ]}
      />
    </div>
  )
}
