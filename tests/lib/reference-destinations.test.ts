import { expect, it, vi } from 'vitest'
const findMany = vi.hoisted(() => vi.fn())
vi.mock('@/lib/prisma', () => ({ default: { verse: { findMany } } }))
import { exactPassages } from '@/lib/search-references'
it('keeps ambiguous source choices and Masoretic verse destinations separate without licensed editions', async () => {
  findMany.mockResolvedValue([
    { id: 1, book: 'Genesis', chapter: 22, verse: 2, versification: 'CHRISTIAN', source: { slug: 'torah', title: 'Torah' }, translations: [{ name: 'ESV', licenseCode: 'PD' }, { name: 'Reader note (original)', licenseCode: 'PROJECT' }] },
    { id: 2, book: 'Genesis', chapter: 22, verse: 2, versification: 'MASORETIC', source: { slug: 'hebrew-bible', title: 'Hebrew Bible' }, translations: [{ name: 'Hebrew (MT)', licenseCode: 'PD' }] },
  ])
  const results = await exactPassages('Genesis 22:2')
  expect(results.map((row) => row.href)).toEqual(['/sources/torah/read?book=Genesis&chapter=22#v-2', '/sources/hebrew-bible/read?book=Genesis&chapter=22#h-2'])
  expect(results[0].editions).toEqual(['Reader note (original)'])
  expect(results[1].numbering).toBe('Masoretic numbering')
})
