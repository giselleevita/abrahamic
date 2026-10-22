import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../src/generated/prisma/client'

const describeDb = process.env.DATABASE_URL ? describe : describe.skip
const PROVIDER = 'testprov'
const STATEMENT = 's'.repeat(30)

describeDb('accounts (real database)', () => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
  let upsertOAuthUser: typeof import('@/lib/accounts').upsertOAuthUser
  let refreshTokenFromDb: typeof import('@/lib/accounts').refreshTokenFromDb
  let isSuspended: typeof import('@/lib/accounts').isSuspended

  const wipe = () => prisma.user.deleteMany({ where: { provider: PROVIDER } })
  beforeEach(async () => {
    ;({ upsertOAuthUser, refreshTokenFromDb, isSuspended } = await import('@/lib/accounts'))
    await wipe()
  })
  afterAll(async () => {
    await wipe()
    await prisma.$disconnect()
  })

  it('creates contributors by default and never promotes on sign-in', async () => {
    const first = await upsertOAuthUser({ provider: PROVIDER, providerAccountId: 'a1', email: 'a@example.test', name: 'A' })
    expect(first.role).toBe('CONTRIBUTOR')
    await prisma.user.update({ where: { id: first.id }, data: { role: 'EDITOR', status: 'SUSPENDED' } })
    const again = await upsertOAuthUser({ provider: PROVIDER, providerAccountId: 'a1', email: 'changed@example.test', name: 'A2' })
    expect(again.id).toBe(first.id)
    expect(again.role).toBe('EDITOR')
    expect(again.status).toBe('SUSPENDED')
    expect(again.email).toBe('changed@example.test')
  })

  it('identifies people by provider account, not by email', async () => {
    const one = await upsertOAuthUser({ provider: PROVIDER, providerAccountId: 'x1', email: 'same@example.test' })
    const two = await upsertOAuthUser({ provider: PROVIDER, providerAccountId: 'x2', email: 'same@example.test' })
    expect(two.id).not.toBe(one.id)
  })

  it('reports suspension for sign-in', async () => {
    const user = await upsertOAuthUser({ provider: PROVIDER, providerAccountId: 's1' })
    expect(await isSuspended(PROVIDER, 's1')).toBe(false)
    await prisma.user.update({ where: { id: user.id }, data: { status: 'SUSPENDED' } })
    expect(await isSuspended(PROVIDER, 's1')).toBe(true)
  })

  it('puts only APPROVED traditions on the token, and strips the role when suspended or deleted', async () => {
    const user = await upsertOAuthUser({ provider: PROVIDER, providerAccountId: 't1' })
    await prisma.reviewerProfile.create({
      data: { userId: user.id, tradition: 'ISLAMIC', affiliation: 'Test', statement: STATEMENT, status: 'APPROVED', decidedBy: 'admin', decidedAt: new Date() },
    })
    await prisma.reviewerProfile.create({ data: { userId: user.id, tradition: 'JEWISH', affiliation: 'Test', statement: STATEMENT } })

    const ok = await refreshTokenFromDb({ uid: user.id })
    expect(ok.role).toBe('CONTRIBUTOR')
    expect(ok.reviewerTraditions).toEqual(['ISLAMIC'])

    await prisma.user.update({ where: { id: user.id }, data: { status: 'SUSPENDED' } })
    const suspended = await refreshTokenFromDb({ uid: user.id, role: 'EDITOR' })
    expect(suspended.role).toBeUndefined()
    expect(suspended.reviewerTraditions).toEqual([])

    await prisma.user.delete({ where: { id: user.id } })
    expect((await refreshTokenFromDb({ uid: user.id, role: 'EDITOR' })).role).toBeUndefined()
  })

  it('refuses a SHARED reviewer profile at the database', async () => {
    const user = await upsertOAuthUser({ provider: PROVIDER, providerAccountId: 'c1' })
    await expect(
      prisma.reviewerProfile.create({ data: { userId: user.id, tradition: 'SHARED', affiliation: 'x', statement: STATEMENT } }),
    ).rejects.toThrow()
  })

  it('refuses a decided profile that does not record who decided it', async () => {
    const user = await upsertOAuthUser({ provider: PROVIDER, providerAccountId: 'c2' })
    await expect(
      prisma.reviewerProfile.create({ data: { userId: user.id, tradition: 'JEWISH', affiliation: 'x', statement: STATEMENT, status: 'APPROVED' } }),
    ).rejects.toThrow()
  })

  it('deletes applications together with the account', async () => {
    const user = await upsertOAuthUser({ provider: PROVIDER, providerAccountId: 'd1' })
    await prisma.reviewerProfile.create({ data: { userId: user.id, tradition: 'CHRISTIAN', affiliation: 'x', statement: STATEMENT } })
    await prisma.user.delete({ where: { id: user.id } })
    expect(await prisma.reviewerProfile.count({ where: { userId: user.id } })).toBe(0)
  })
})
