import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { ConceptFilter } from '@/components/claims/ConceptFilter'

export const metadata: Metadata = { title: 'Concepts' }
export const dynamic = 'force-dynamic'

export default async function ConceptsPage() {
  const concepts = await prisma.concept.findMany({
    where: { isPublished: true },
    include: { traditions: { select: { tradition: true, definition: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">Key Concepts</h1>
        <p className="mt-3 max-w-2xl text-stone-500 leading-relaxed">
          How do Judaism, Christianity, and Islam understand the same foundational ideas?
          Each entry presents the tradition's own definition — no tradition interprets for another.
        </p>
      </div>

      <ConceptFilter concepts={concepts} />
    </div>
  )
}
