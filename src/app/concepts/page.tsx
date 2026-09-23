import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { ConceptFilter } from '@/components/claims/ConceptFilter'
import { PageIntro } from '@/components/layout/PageIntro'

export const metadata: Metadata = { title: 'Concepts' }
// Cached content. Editors' changes appear immediately: mutating routes
// invalidate the matching tag via revalidateContent().
export const revalidate = 3600

export default async function ConceptsPage() {
  const concepts = await prisma.concept.findMany({
    where: { isPublished: true },
    include: { traditions: { select: { tradition: true, definition: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <PageIntro eyebrow="Learn" title="Beliefs & concepts" description="Choose an idea and see how Judaism, Christianity, and Islam describe it in their own terms. Filters help you narrow the list." />

      <ConceptFilter concepts={concepts} />
    </div>
  )
}
