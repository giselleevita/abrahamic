import Link from 'next/link'
import prisma from '@/lib/prisma'

const BOOK: Record<string, string> = { JEWISH: 'the Torah and Hebrew Bible', CHRISTIAN: 'the Bible', ISLAMIC: 'the Quran' }

/** Whole days since the epoch; module-level so the component itself stays pure. */
function today(): number {
  return Math.floor(Date.now() / 86_400_000)
}

/**
 * One fact a day, drawn from names that differ between traditions. Rotates by
 * calendar day, so the page can be cached and a returning visitor still sees
 * something new.
 */
export async function DidYouKnow() {
  const figures = await prisma.figure.findMany({
    where: { aliases: { some: { tradition: 'JEWISH' } } },
    select: { slug: true, canonicalName: true, aliases: { select: { name: true, tradition: true } } },
    orderBy: { id: 'asc' },
  })
  const usable = figures.filter((f) => new Set(f.aliases.map((a) => a.name.toLowerCase())).size >= 2)
  if (usable.length === 0) return null
  const pick = usable[today() % usable.length]
  const names = new Map<string, string>()
  for (const a of pick.aliases) if (!names.has(a.tradition)) names.set(a.tradition, a.name)
  const parts = [...names.entries()].filter(([t]) => BOOK[t])

  return (
    <section aria-labelledby="dyk-title" className="mx-auto max-w-[1376px] px-6 pb-4 sm:px-12">
      <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-rose-50 p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-amber-900">💡 Did you know?</p>
        <h2 id="dyk-title" className="mt-2 font-serif text-2xl text-slate-950 sm:text-3xl">
          {pick.canonicalName} has more than one name
        </h2>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-800">
          {parts.map(([t, n], i) => (
            <span key={t}>
              {i > 0 && (i === parts.length - 1 ? ' and ' : ', ')}
              <strong>{n}</strong> in {BOOK[t]}
            </span>
          ))}
          . Same person, different names. A new one every day.
        </p>
        <Link href={`/figures/${pick.slug}`} className="mt-4 inline-block font-bold text-[#173b68] hover:underline">
          Read about {pick.canonicalName} →
        </Link>
      </div>
    </section>
  )
}
