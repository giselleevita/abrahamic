import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/layout/PageIntro'
import { decodeShare } from '@/lib/experience/notebook'

export const metadata: Metadata = { title: 'A shared reading list', robots: { index: false } }

export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ i?: string | string[] }> }) {
  const { i } = await searchParams
  const items = decodeShare(Array.isArray(i) ? i[0] : i)
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <PageIntro
        eyebrow="Shared with you"
        title="A reading list"
        description="Someone put together these pages for you. Only page titles are in the link."
        plainWords="Open the pages in order, or pick the ones that interest you."
      />
      {items.length === 0 ? (
        <p className="rounded-2xl border border-[#d7c5ad] bg-white p-6">This link does not hold a valid reading list.</p>
      ) : (
        <ol className="space-y-2">
          {items.map((l, n) => (
            <li key={l.href}>
              <Link href={l.href} className="flex items-center gap-3 rounded-2xl border border-[#d7c5ad] bg-white px-4 py-3 font-semibold text-[#173b68] hover:border-[#b7791f]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fbf6ec] text-sm text-slate-900">{n + 1}</span>{l.label}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
