import prisma from '@/lib/prisma'
import { ComparisonForm } from '@/components/admin/ComparisonForm'

export default async function NewComparisonPage() {
  const claims = await prisma.claim.findMany({
    include: { source: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold text-stone-900">New Comparison</h1>
      <ComparisonForm claims={claims} />
    </div>
  )
}
