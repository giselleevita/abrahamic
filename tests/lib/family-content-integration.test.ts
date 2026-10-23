import { readFileSync } from 'node:fs'
import { describe, it, expect, afterAll } from 'vitest'
import prisma from '@/lib/prisma'
import { PUBLIC_FAMILY_RELATIONS } from '@/lib/queries/family-relations'
import { seedFamilyReferences } from '../../prisma/seed/family-references'

const migration = readFileSync('prisma/migrations/20261019173000_family_content_corrections/migration.sql', 'utf8')
describe.skipIf(!process.env.DATABASE_URL)('legacy family content migration', () => {
  afterAll(async () => { await prisma.$disconnect() })
  it('repairs known mother rows, preserves edited notes and hides held records', async () => {
    const rollback = new Error('rollback content fixture')
    try {
      await prisma.$transaction(async (tx) => {
        const hagar = await tx.figure.findUniqueOrThrow({ where: { slug: 'hagar' } })
        const ishmael = await tx.figure.findUniqueOrThrow({ where: { slug: 'ishmael' } })
        const jesus = await tx.figure.findUniqueOrThrow({ where: { slug: 'jesus' } })
        const peter = await tx.figure.upsert({ where: { slug: 'peter' }, create: { slug: 'peter', canonicalName: 'Peter' }, update: {} })
        const motherKey = { fromFigureId: hagar.id, toFigureId: ishmael.id, relationType: 'SPOUSE' as const }
        await tx.figureRelation.upsert({ where: { fromFigureId_toFigureId_relationType: motherKey }, create: { ...motherKey, notes: 'Mother of Ishmael' }, update: { notes: 'Mother of Ishmael' } })
        await tx.figureRelation.deleteMany({ where: { fromFigureId: hagar.id, toFigureId: ishmael.id, relationType: 'PARENT' } })
        const editedKey = { fromFigureId: jesus.id, toFigureId: peter.id, relationType: 'CHILD' as const }
        const edited = await tx.figureRelation.upsert({ where: { fromFigureId_toFigureId_relationType: editedKey }, create: { ...editedKey, notes: 'Editor-authored fixture; preserve verbatim.' }, update: { notes: 'Editor-authored fixture; preserve verbatim.' } })
        for (const sql of migration.split(';\n').filter((part) => part.trim())) await tx.$executeRawUnsafe(sql)
        const old = await tx.figureRelation.findUniqueOrThrow({ where: { fromFigureId_toFigureId_relationType: motherKey } })
        expect(old.notes).toBe('[EDITORIAL HOLD] Mother of Ishmael')
        const parent = await tx.figureRelation.findUniqueOrThrow({ where: { fromFigureId_toFigureId_relationType: { ...motherKey, relationType: 'PARENT' } } })
        expect(parent.notes).toContain('Genesis 16:15')
        expect((await tx.figureRelation.findUniqueOrThrow({ where: { id: edited.id } })).notes).toBe('Editor-authored fixture; preserve verbatim.')
        expect(await tx.figureRelation.count({ where: { AND: [PUBLIC_FAMILY_RELATIONS, { id: old.id }] } })).toBe(0)
        expect(await tx.figureRelation.count({ where: { AND: [PUBLIC_FAMILY_RELATIONS, { id: parent.id }] } })).toBe(1)
        throw rollback
      }, { timeout: 15000 })
    } catch (error) { if (error !== rollback) throw error }
  })
  it('adds reference-only destinations idempotently without replacing existing editions', async () => {
    await seedFamilyReferences(prisma)
    const before = await prisma.verse.findFirstOrThrow({ where: { source: { key: 'TORAH' }, book: 'Genesis', chapter: 16, verse: 15, versification: 'CHRISTIAN' }, include: { translations: true } })
    await seedFamilyReferences(prisma)
    const after = await prisma.verse.findFirstOrThrow({ where: { source: { key: 'TORAH' }, book: 'Genesis', chapter: 16, verse: 15, versification: 'CHRISTIAN' }, include: { translations: true } })
    expect(after).toEqual(before)
    expect(after.translations.length).toBeGreaterThan(0)
  })
})
