import Link from 'next/link'
import prisma from '@/lib/prisma'

type Current = { kind: 'figure' | 'concept' | 'comparison'; id: number }

/** The row after `id`, wrapping to the first, so every page leads somewhere new. */
function after<T extends { id: number }>(rows: T[], id: number): T | undefined {
  if (rows.length === 0) return undefined
  return rows.find((r) => r.id > id) ?? rows.find((r) => r.id !== id)
}

/**
 * "Where next?" for detail pages: one more person, one more idea, one more
 * comparison, and the two diagrams. Excludes the page the reader is on.
 */
export async function NextUp({ current }: { current: Current }) {
  const [figures, concepts, comparisons] = await Promise.all([
    prisma.figure.findMany({ select: { id: true, slug: true, canonicalName: true }, orderBy: { id: 'asc' } }),
    prisma.concept.findMany({ where: { isPublished: true }, select: { id: true, slug: true, name: true }, orderBy: { id: 'asc' } }),
    prisma.comparison.findMany({ where: { isPublished: true }, select: { id: true, title: true }, orderBy: { id: 'asc' } }),
  ])
  const fig = after(figures, current.kind === 'figure' ? current.id : 0)
  const con = after(concepts, current.kind === 'concept' ? current.id : 0)
  const cmp = after(comparisons, current.kind === 'comparison' ? current.id : 0)

  const cards = [
    fig && (current.kind !== 'figure' || figures.length > 1)
      ? { href: `/figures/${fig!.slug}`, label: 'Meet another person', title: fig!.canonicalName, icon: '👤' }
      : null,
    con && (current.kind !== 'concept' || concepts.length > 1)
      ? { href: `/concepts/${con.slug}`, label: 'Explore another idea', title: con.name, icon: '💭' }
      : null,
    cmp && (current.kind !== 'comparison' || comparisons.length > 1)
      ? { href: `/comparisons/${cmp.id}`, label: 'Compare another belief', title: cmp.title, icon: '⚖️' }
      : null,
    { href: '/family-tree#big-picture-title', label: 'See the big picture', title: 'How the traditions connect', icon: '🌳' },
    { href: '/timeline', label: 'Follow the timeline', title: 'From creation to early Islam', icon: '⏳' },
  ].filter(Boolean) as { href: string; label: string; title: string; icon: string }[]

  return (
    <nav aria-labelledby="next-up-title" className="mt-14 border-t border-[#e5d9c8] pt-8">
      <h2 id="next-up-title" className="font-serif text-2xl text-slate-950">Where to next?</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="flex h-full items-start gap-3 rounded-2xl border border-[#d7c5ad] bg-white p-4 transition-colors hover:border-[#b7791f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7791f]"
            >
              <span aria-hidden="true" className="text-2xl">{c.icon}</span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#80571b]">{c.label}</span>
                <span className="mt-1 block font-semibold text-slate-950">{c.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
