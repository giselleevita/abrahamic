import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  empty: vi.fn().mockResolvedValue([]),
  courses: vi.fn().mockResolvedValue([{ slug: 'abraham', updatedAt: new Date('2026-01-01') }]),
  chapters: vi.fn().mockResolvedValue([{ slug: 'meet', updatedAt: new Date('2026-01-01'), course: { slug: 'abraham' } }]),
}))
vi.mock('@/lib/db-ready', () => ({ hasDatabaseUrl: () => true }))
vi.mock('@/lib/site-url', () => ({ getSiteUrl: () => 'https://example.test' }))
vi.mock('@/lib/prisma', () => ({ default: {
  figure: { findMany: mocks.empty }, theme: { findMany: mocks.empty }, source: { findMany: mocks.empty },
  comparison: { findMany: mocks.empty }, concept: { findMany: mocks.empty }, timelineEvent: { findMany: mocks.empty },
  course: { findMany: mocks.courses }, chapter: { findMany: mocks.chapters },
} }))

import sitemap from '@/app/sitemap'

describe('sitemap', () => {
  it('includes published journey maps as well as chapter pages', async () => {
    const result = await sitemap()
    expect(mocks.courses).toHaveBeenCalledWith({ where: { isPublished: true }, select: { slug: true, updatedAt: true } })
    expect(result.some((entry) => entry.url === 'https://example.test/learn/abraham')).toBe(true)
    expect(result.some((entry) => entry.url === 'https://example.test/learn/abraham/meet')).toBe(true)
  })
})
