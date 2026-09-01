import type { MetadataRoute } from 'next'
import { hasDatabaseUrl } from '@/lib/db-ready'
import prisma from '@/lib/prisma'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/learn`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/comparisons`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/figures`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/themes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/sources`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/concepts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/timeline`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/verse-links`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/licensing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  if (!hasDatabaseUrl()) {
    return staticRoutes
  }

  const [figures, themes, sources, comparisons, concepts, timelineEvents] = await Promise.all([
    prisma.figure.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.theme.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.source.findMany({ select: { key: true, updatedAt: true } }),
    prisma.comparison.findMany({ where: { isPublished: true }, select: { id: true, updatedAt: true } }),
    prisma.concept.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.timelineEvent.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ])

  const chapters = await prisma.chapter.findMany({
    where: { isPublished: true, course: { isPublished: true } },
    select: { slug: true, updatedAt: true, course: { select: { slug: true } } },
  })

  return [
    ...staticRoutes,
    ...chapters.map((c) => ({
      url: `${base}/learn/${c.course.slug}/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
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
