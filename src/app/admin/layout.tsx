import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 flex-shrink-0 border-r border-stone-200 bg-white px-4 py-6">
        <Link href="/admin" className="block text-base font-semibold text-stone-900 mb-6">
          Admin CMS
        </Link>
        <nav className="space-y-1 text-sm">
          <Link href="/admin" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Dashboard
          </Link>
          <p className="px-2 pt-1 text-xs font-semibold uppercase tracking-wider text-stone-400">Content</p>
          <Link href="/admin/claims" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Claims
          </Link>
          <Link href="/admin/comparisons" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Comparisons
          </Link>
          <Link href="/admin/figures" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Figures
          </Link>
          <Link href="/admin/themes" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Themes
          </Link>
          <Link href="/admin/sources" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Sources
          </Link>
          <Link href="/admin/translations" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Translations
          </Link>
          <Link href="/admin/concepts" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Concepts
          </Link>
          <Link href="/admin/timeline" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Timeline
          </Link>
          <hr className="my-2 border-stone-200" />
          <p className="px-2 pt-1 text-xs font-semibold uppercase tracking-wider text-stone-400">AI tools</p>
          <Link href="/admin/verse-link-candidates" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Link Candidates ✦
          </Link>
          <Link href="/admin/verse-links" className="block rounded px-2 py-1.5 text-stone-700 hover:bg-stone-100">
            Approved Links
          </Link>
          <hr className="my-2 border-stone-200" />
          <Link href="/" className="block rounded px-2 py-1.5 text-stone-500 hover:bg-stone-100">
            ← View site
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-stone-50 p-8">{children}</main>
    </div>
  )
}
