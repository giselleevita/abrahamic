import { ConceptForm } from '@/components/admin/ConceptForm'

export default function NewConceptPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">New Concept</h1>
      <ConceptForm />
    </div>
  )
}
