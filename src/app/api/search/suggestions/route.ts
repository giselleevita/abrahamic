import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim().slice(0, 100) ?? ''
  if (query.length < 2) return Response.json([], { headers: { 'Cache-Control': 'no-store' } })
  try {
    const contains = { contains: query, mode: 'insensitive' as const }
    const [figures, themes, concepts] = await Promise.all([
      prisma.figure.findMany({ where: { OR: [{ canonicalName: contains }, { aliases: { some: { name: contains } } }], claims: { some: { claim: { isPublished: true } } } }, select: { canonicalName: true, slug: true }, orderBy: { canonicalName: 'asc' }, take: 2 }),
      prisma.theme.findMany({ where: { name: contains, claims: { some: { claim: { isPublished: true } } } }, select: { name: true, slug: true }, orderBy: { name: 'asc' }, take: 2 }),
      prisma.concept.findMany({ where: { name: contains, isPublished: true }, select: { name: true, slug: true }, orderBy: { name: 'asc' }, take: 2 }),
    ])
    return Response.json([
      ...figures.map((f) => ({ kind: 'Figure', label: f.canonicalName, href: `/figures/${f.slug}` })),
      ...themes.map((t) => ({ kind: 'Theme', label: t.name, href: `/themes/${t.slug}` })),
      ...concepts.map((c) => ({ kind: 'Concept', label: c.name, href: `/concepts/${c.slug}` })),
    ].slice(0, 6), { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ error: 'Suggestions are temporarily unavailable. You can still search.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
