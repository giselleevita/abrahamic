import { randomUUID } from 'node:crypto'
import { describe, it, expect, afterAll } from 'vitest'
import prisma from '@/lib/prisma'
import { search } from '@/lib/search'
import { exactPassages } from '@/lib/search-references'
import { GET } from '@/app/api/search/suggestions/route'
const enabled = Boolean(process.env.DATABASE_URL)
describe.skipIf(!enabled)('seeded search integration', () => {
  afterAll(async () => { await prisma.$disconnect() })
  it('applies tradition, source and type before limits and displayed counts', async () => {
    const result = await search('Ibrahim', 2, { tradition: 'ISLAMIC', source: 'QURAN', type: 'claims' })
    expect(result.claims.length).toBeGreaterThan(0)
    expect(result.claims.every((claim) => claim.sourceKey === 'QURAN')).toBe(true)
    expect(result.claims.length).toBeLessThanOrEqual(2)
    expect(result.total).toBe(result.claims.length)
    expect((await search('Abraham', 2, { tradition: 'CHRISTIAN', source: 'QURAN' })).claims).toHaveLength(0)
    const all = await search('Abraham', 2)
    expect(all.total).toBeGreaterThan(0)
    expect((await search('zzzznothingmatcheszzzz')).total).toBe(0)
  })
  it('exposes ambiguous sources, exact canonical anchors and permitted editions only', async () => {
    const genesis = await exactPassages('Genesis 22:2')
    expect(genesis.length).toBeGreaterThan(0)
    expect(genesis.some((passage) => passage.href.includes('book=Genesis&chapter=22#v-2'))).toBe(true)
    expect(JSON.stringify(genesis)).not.toMatch(/KJV|JPS 1985|ESV|Sahih International/)
    for (const passage of genesis.filter((row) => row.numbering === 'Masoretic numbering')) expect(passage.href).toMatch(/#h-2$/)
    expect((await exactPassages('John 3:16')).some((row) => row.href.endsWith('#v-16'))).toBe(true)
    expect(await exactPassages('Quran 2:255', { source: 'TORAH' })).toEqual([])
    const quran = await exactPassages('Quran 2:255')
    expect(quran.some((row) => row.href.includes('chapter=2#v-255'))).toBe(true)
  })
  it('returns at most six published suggestions with safe destinations and no excerpts', async () => {
    const response = await GET(new Request('http://localhost/api/search/suggestions?q=Ab'))
    expect(response.status).toBe(200)
    const rows = await response.json()
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.length).toBeLessThanOrEqual(6)
    expect(rows.every((row: object) => Object.keys(row).sort().join() === 'href,kind,label')).toBe(true)
    expect(await (await GET(new Request('http://localhost/api/search/suggestions?q=a'))).json()).toEqual([])
  })
  it('excludes unpublished metadata and licensed excerpts before the result limit', async () => {
    const token = `release${randomUUID().replaceAll('-', '')}`
    const source = await prisma.source.findUniqueOrThrow({ where: { key: 'TORAH' }, select: { id: true } })
    const verse = await prisma.verse.create({ data: { sourceId: source.id, book: 'Release test fixture', chapter: 1, verse: 1, referenceKey: token, translations: { create: [
      { name: 'ESV', label: 'MODERN', licenseCode: 'PD', text: `${token} ${token} ${token}` },
      { name: 'Fixture permitted edition', label: 'CLASSIC', licenseCode: 'PD', text: token },
    ] } } })
    const draft = await prisma.concept.create({ data: { name: token, slug: token, category: 'THEOLOGY', isPublished: false } })
    const figure = await prisma.figure.create({ data: { canonicalName: token, slug: token } })
    const theme = await prisma.theme.create({ data: { name: token, slug: token } })
    try {
      const result = await search(token, 1)
      expect(result.verses).toHaveLength(1)
      expect(result.verses[0].translationName).toBe('Fixture permitted edition')
      expect(result.concepts).toEqual([])
      expect(result.figures).toEqual([])
      expect(result.themes).toEqual([])
      expect(await (await GET(new Request(`http://localhost/api/search/suggestions?q=${token}`))).json()).toEqual([])
    } finally {
      await prisma.verse.delete({ where: { id: verse.id } })
      await prisma.concept.delete({ where: { id: draft.id } })
      await prisma.figure.delete({ where: { id: figure.id } })
      await prisma.theme.delete({ where: { id: theme.id } })
    }
  })

})
