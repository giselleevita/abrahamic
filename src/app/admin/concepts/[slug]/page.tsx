import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ConceptForm } from '@/components/admin/ConceptForm'

export default async function EditConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const concept = await prisma.concept.findUnique({
    where: { slug },
    include: { traditions: true },
  })
  if (!concept) notFound()

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Edit Concept — {concept.name}</h1>
      <ConceptForm initialData={concept} />
    </div>
  )
}
