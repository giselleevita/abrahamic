import { FigureForm } from '@/components/admin/FigureForm'
import Link from 'next/link'

export default function NewFigurePage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/figures" className="text-sm text-stone-500 hover:text-stone-700">← Figures</Link>
        <h1 className="text-2xl font-bold text-stone-900">New Figure</h1>
      </div>
      <div className="max-w-2xl">
        <FigureForm />
      </div>
    </div>
  )
}
