import { ThemeForm } from '@/components/admin/ThemeForm'
import Link from 'next/link'

export default function NewThemePage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/themes" className="text-sm text-stone-500 hover:text-stone-700">← Themes</Link>
        <h1 className="text-2xl font-bold text-stone-900">New Theme</h1>
      </div>
      <div className="max-w-2xl">
        <ThemeForm />
      </div>
    </div>
  )
}
