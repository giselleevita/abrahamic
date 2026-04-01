import type { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  const [figures, themes, sources, comparisons, concepts, timelineEvents] = await Promise.all([
    prisma.figure.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.theme.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.source.findMany({ select: { key: true, updatedAt: true } }),
    prisma.comparison.findMany({ where: { isPublished: true }, select: { id: true, updatedAt: true } }),
    prisma.concept.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.timelineEvent.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/comparisons`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/figures`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/themes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/sources`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/concepts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/timeline`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/verse-links`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  return [
    ...staticRoutes,
    ...comparisons.map((c) => ({
      url: `${base}/comparisons/${c.id}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...figures.map((f) => ({
      url: `${base}/figures/${f.slug}`,
      lastModified: f.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...themes.map((t) => ({
      url: `${base}/themes/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...sources.map((s) => ({
      url: `${base}/sources/${s.key.toLowerCase()}`,
      lastModified: s.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...concepts.map((c) => ({
      url: `${base}/concepts/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...timelineEvents.map((e) => ({
      url: `${base}/timeline#${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
