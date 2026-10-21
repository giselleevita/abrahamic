import { cache } from 'react'
import prisma from '@/lib/prisma'
import { findNameMatches, type NameFigure } from '@/lib/name-links'
import { NameTap } from '@/components/figures/NameTap'

const loadFigures = cache(async (): Promise<NameFigure[]> => {
  const rows = await prisma.figure.findMany({
    select: { slug: true, canonicalName: true, aliases: { select: { tradition: true, name: true, language: true } } },
  })
  return rows.map((r) => ({ slug: r.slug, name: r.canonicalName, aliases: r.aliases }))
})

/** Plain text in which the first mention of each known person can be tapped. */
export async function NamedText({ text, exclude = [] }: { text: string; exclude?: string[] }) {
  const segments = findNameMatches(text, await loadFigures(), exclude)
  return (
    <>
      {segments.map((s, i) => ('figure' in s ? <NameTap key={i} text={s.text} figure={s.figure} /> : <span key={i}>{s.text}</span>))}
    </>
  )
}
