import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminThemesPage() {
  const themes = await prisma.theme.findMany({
    include: { _count: { select: { claims: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Themes</h1>
        <Link
          href="/admin/themes/new"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          + New Theme
        </Link>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white divide-y divide-stone-100">
        {themes.length === 0 && (
          <p className="p-6 text-sm text-stone-400">No themes yet.</p>
        )}
        {themes.map((theme) => (
          <div key={theme.id} className="flex items-center gap-4 px-5 py-4">
            <div
              className="h-4 w-4 flex-shrink-0 rounded-full"
              style={{ backgroundColor: theme.color ?? '#888' }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-900">{theme.name}</p>
              {theme.description && (
                <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{theme.description}</p>
              )}
            </div>
            <span className="text-xs text-stone-400">{theme._count.claims} claims</span>
            <Link
              href={`/admin/themes/${theme.slug}`}
              className="rounded border border-stone-200 px-3 py-1 text-xs text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
