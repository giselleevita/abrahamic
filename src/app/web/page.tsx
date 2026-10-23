import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { PageIntro } from '@/components/layout/PageIntro'
import { forceLayout } from '@/lib/force-layout'
import { ConceptWeb, type WebLink, type WebNode } from '@/components/web/ConceptWeb'

export const revalidate = 3600
export const metadata: Metadata = {
  title: 'Web of ideas',
  description: 'Explore how beliefs and people connect through the sourced statements on this site.',
}

export default async function WebPage() {
  const themes = await prisma.theme.findMany({
    select: { id: true, slug: true, name: true, claims: { select: { claim: { select: { isPublished: true, figures: { select: { figure: { select: { id: true, slug: true, canonicalName: true } } } } } } } } },
    orderBy: { id: 'asc' },
  })
  const nodes = new Map<string, WebNode>()
  const weights = new Map<string, WebLink>()
  for (const t of themes) {
    const tid = `c:${t.id}`
    let linked = false
    for (const { claim } of t.claims) {
      if (!claim.isPublished) continue
      for (const { figure } of claim.figures) {
        const fid = `f:${figure.id}`
        nodes.set(fid, { id: fid, kind: 'figure', label: figure.canonicalName, href: `/figures/${figure.slug}` })
        const key = `${tid}|${fid}`
        weights.set(key, { a: tid, b: fid, weight: (weights.get(key)?.weight ?? 0) + 1 })
        linked = true
      }
    }
    if (linked) nodes.set(tid, { id: tid, kind: 'concept', label: t.name, href: `/themes/${t.slug}` })
  }
  // Laid out once, on the server: the layout is chaotic enough that two machines would disagree in the last decimals and then diverge.
  const nodeList = [...nodes.values()]
  const linkList = [...weights.values()]
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageIntro
        eyebrow="Explore"
        title="Web of ideas"
        description="A map of how beliefs and people are connected through the sourced statements on this site."
        plainWords="Everything here is linked to something else. Select an idea or a person to light up what they connect to, then hop to the next."
      />
      <p className="mb-4 text-sm text-slate-700">Built from themes, not the full list of ideas: a line means a theme and a person appear together in the same sourced statements. It shows where to look next, not that anyone agrees or disagrees.</p>
      <ConceptWeb nodes={nodeList} links={linkList} placed={forceLayout(nodeList, linkList, 1000, 680)} />
    </div>
  )
}
