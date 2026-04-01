import { unstable_cache } from 'next/cache'
import prisma from './prisma'

// These caches revalidate on a time-based schedule.
// API mutation routes call revalidatePath('/comparisons', 'layout') to bust the comparisons cache immediately.

export const getCachedSources = unstable_cache(
  async () => {
    return prisma.source.findMany({
      include: { _count: { select: { verses: true, claims: true } } },
      orderBy: { title: 'asc' },
    })
  },
  ['sources'],
  { revalidate: 3600 }
)

export const getCachedFigures = unstable_cache(
  async () => {
    return prisma.figure.findMany({
      include: {
        aliases: true,
        _count: { select: { claims: true } },
      },
      orderBy: { canonicalName: 'asc' },
    })
  },
  ['figures'],
  { revalidate: 3600 }
)

export const getCachedThemes = unstable_cache(
  async () => {
    return prisma.theme.findMany({
      include: { _count: { select: { claims: true } } },
      orderBy: { name: 'asc' },
    })
  },
  ['themes'],
  { revalidate: 3600 }
)

export const getCachedComparisons = unstable_cache(
  async () => {
    return prisma.comparison.findMany({
      where: { isPublished: true },
      include: {
        claims: {
          orderBy: { position: 'asc' },
          include: {
            claim: {
              include: {
                source: true,
                verses: {
                  where: { isPrimary: true },
                  include: {
                    verse: { include: { translations: { where: { isDefault: true } } } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },
  ['comparisons'],
  { revalidate: 60 }
)
