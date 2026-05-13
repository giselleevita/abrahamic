import prisma from '@/lib/prisma'
import Link from 'next/link'
import type { ConceptCategory } from '@prisma/client'

const CATEGORY_LABEL: Record<ConceptCategory, string> = {
  THEOLOGY: 'Theology', SOTERIOLOGY: 'Soteriology', ESCHATOLOGY: 'Eschatology',
  PROPHETHOOD: 'Prophethood', PRACTICE: 'Practice', LAW: 'Law & Covenant', COSMOLOGY: 'Cosmology',
}

export const dynamic = 'force-dynamic'

export default async function AdminConceptsPage() {
  const concepts = await prisma.concept.findMany({
    include: { _count: { select: { traditions: true } } },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Concepts</h1>
        <Link
          href="/admin/concepts/new"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          + New Concept
        </Link>
      </div>

      {concepts.length === 0 ? (
        <p className="text-stone-500 text-sm">No concepts yet.</p>
      ) : (
        <div className="space-y-2">
          {concepts.map((concept) => (
            <Link
              key={concept.id}
              href={`/admin/concepts/${concept.slug}`}
              className="flex items-center gap-4 rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400 transition-colors"
            >
              <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${concept.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                {concept.isPublished ? 'Published' : 'Draft'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900">{concept.name}</p>
                {concept.summary && (
                  <p className="mt-0.5 text-xs text-stone-500 truncate">{concept.summary}</p>
                )}
              </div>
              <span className="flex-shrink-0 text-xs text-stone-400 bg-stone-100 rounded px-2 py-0.5">
                {CATEGORY_LABEL[concept.category]}
              </span>
              <span className="flex-shrink-0 text-xs text-stone-400">
                {concept._count.traditions} tradition{concept._count.traditions !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
