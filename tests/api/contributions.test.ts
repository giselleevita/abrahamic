/**
 * Public correction reports and contributor proposals, through the real route handlers and the
 * real database. Only the session is faked.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const session = vi.hoisted(() => ({ current: null as null | { user: { id: string; role: string } } }))
vi.mock('next-auth', () => ({ getServerSession: vi.fn(async () => session.current) }))
vi.mock('@/lib/auth', () => ({ authOptions: {}, contributorSessionOptions: {} }))

const describeDb = process.env.DATABASE_URL ? describe : describe.skip
const TAG = 'contrib-test'
const USER = `${TAG}-user`

describeDb('public reports and contributor proposals', () => {
  let prisma: typeof import('@/lib/prisma').default
  let reports: typeof import('@/app/api/reports/route')
  let adminReport: typeof import('@/app/api/admin/reports/[id]/route')
  let proposals: typeof import('@/app/api/contributions/claims/route')
  let torahId = 0
  let ipCounter = 0

  const post = (route: { POST: (r: Request) => Promise<Response> }, url: string, body: unknown, headers: Record<string, string> = {}) =>
    route.POST(new Request(`http://x${url}`, { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json', ...headers } }))
  const freshIp = () => ({ 'x-forwarded-for': `203.0.113.${(ipCounter += 1)}` })
  const report = (over: Record<string, unknown> = {}, headers = freshIp()) =>
    post(reports, '/api/reports', { kind: 'CORRECTION', message: `${TAG} this passage is described unfairly to the tradition.`, ...over }, headers)
  const propose = (over: Record<string, unknown> = {}) =>
    post(proposals, '/api/contributions/claims', {
      sourceId: torahId, statement: `${TAG} Jewish tradition holds that Abraham was called to leave his home ${Math.random()}.`,
      references: ['Genesis 12:1'], ...over,
    })

  async function wipe() {
    await prisma.correctionReport.deleteMany({ where: { message: { startsWith: TAG } } })
    await prisma.claim.deleteMany({ where: { proposedById: USER } })
  }

  beforeAll(async () => {
    prisma = (await import('@/lib/prisma')).default
    reports = await import('@/app/api/reports/route')
    adminReport = await import('@/app/api/admin/reports/[id]/route')
    proposals = await import('@/app/api/contributions/claims/route')
    torahId = (await prisma.source.findFirstOrThrow({ where: { key: 'TORAH' } })).id
    await wipe()
  })
  beforeEach(() => { session.current = null })
  afterAll(async () => { await wipe() })

  describe('public reports', () => {
    it('accepts a report from anyone, with no account', async () => {
      const res = await report()
      expect(res.status).toBe(201)
      const stored = await prisma.correctionReport.findFirstOrThrow({ where: { message: { startsWith: TAG } } })
      expect(stored.status).toBe('NEW')
    })

    it('stores only a keyed hash of the sender’s IP', async () => {
      await report({ message: `${TAG} check the stored ip form please.` }, { 'x-forwarded-for': '198.51.100.77' })
      const stored = await prisma.correctionReport.findFirstOrThrow({ where: { message: `${TAG} check the stored ip form please.` } })
      expect(stored.ipHash).toMatch(/^[0-9a-f]{64}$/)
      expect(JSON.stringify(stored)).not.toContain('198.51.100.77')
    })

    it('silently drops a submission that fills the honeypot, storing nothing', async () => {
      const res = await report({ message: `${TAG} bot submission with honeypot`, website: 'http://spam.example' })
      expect(res.status).toBe(201)
      expect(await prisma.correctionReport.count({ where: { message: `${TAG} bot submission with honeypot` } })).toBe(0)
    })

    it('rejects a message that says nothing, a bad email, and a non-path page', async () => {
      expect((await report({ message: 'too short' })).status).toBe(400)
      expect((await report({ contactEmail: 'not-an-email' })).status).toBe(400)
      expect((await report({ pagePath: 'https://evil.example' })).status).toBe(400)
    })

    it('treats an empty email as no email', async () => {
      expect((await report({ contactEmail: '' })).status).toBe(201)
    })

    it('rejects a report about a claim that does not exist', async () => {
      expect((await report({ claimId: 2_000_000_000 })).status).toBe(400)
    })

    it('rejects an oversized body', async () => {
      const res = await post(reports, '/api/reports', { kind: 'OTHER', message: 'x' }, { ...freshIp(), 'content-length': '999999' })
      expect(res.status).toBe(413)
    })

    it('limits one sender to five reports a day, but not other senders', async () => {
      const sender = { 'x-forwarded-for': '192.0.2.200' }
      for (let i = 0; i < 5; i++) expect((await report({ message: `${TAG} repeated report number ${i} for the limit` }, sender)).status).toBe(201)
      const blocked = await report({ message: `${TAG} repeated report number 6 for the limit` }, sender)
      expect(blocked.status).toBe(429)
      expect(blocked.headers.get('retry-after')).toBeTruthy()
      expect((await report()).status).toBe(201)
    })

    it('blanks the sender hash on reports older than thirty days', async () => {
      const old = await prisma.correctionReport.create({
        data: { kind: 'OTHER', message: `${TAG} an old report that should be forgotten`, ipHash: 'a'.repeat(64), createdAt: new Date(Date.now() - 31 * 86_400_000) },
      })
      await report()
      expect((await prisma.correctionReport.findUniqueOrThrow({ where: { id: old.id } })).ipHash).toBe('expired')
    })

    it('lets staff handle a report, recording who and when, and rejects anonymous callers', async () => {
      await report({ message: `${TAG} report for staff handling test` })
      const row = await prisma.correctionReport.findFirstOrThrow({ where: { message: `${TAG} report for staff handling test` } })
      const patch = (status: string) =>
        adminReport.PATCH(new Request('http://x', { method: 'PATCH', body: JSON.stringify({ status }) }), { params: Promise.resolve({ id: String(row.id) }) })
      expect((await patch('ACTIONED')).status).toBe(401)
      session.current = { user: { id: 'editor', role: 'EDITOR' } }
      expect((await patch('NEW')).status).toBe(400)
      expect((await patch('ACTIONED')).status).toBe(200)
      const after = await prisma.correctionReport.findUniqueOrThrow({ where: { id: row.id } })
      expect(after).toMatchObject({ status: 'ACTIONED', handledBy: 'editor' })
      expect(after.handledAt).not.toBeNull()
    })

    it('refuses, in the database, a handled report with no handler recorded', async () => {
      await expect(
        prisma.correctionReport.create({ data: { kind: 'OTHER', message: `${TAG} bad`, ipHash: 'b'.repeat(64), status: 'ACTIONED' } }),
      ).rejects.toThrow()
    })
  })

  describe('contributor proposals', () => {
    beforeEach(() => { session.current = { user: { id: USER, role: 'CONTRIBUTOR' } } })

    it('requires a signed-in contributor', async () => {
      session.current = null
      expect((await propose()).status).toBe(401)
    })

    it('creates a DRAFT citing real verses, with the right review scope and an audit entry', async () => {
      const res = await propose()
      expect(res.status).toBe(201)
      const { id } = await res.json()
      const claim = await prisma.claim.findUniqueOrThrow({ where: { id }, include: { verses: true } })
      expect(claim).toMatchObject({ editorialStatus: 'DRAFT', isPublished: false, proposedById: USER, requiredTraditions: ['JEWISH'] })
      expect(claim.verses).toHaveLength(1)
      expect(await prisma.editorialAuditEvent.count({ where: { entityType: 'Claim', entityId: String(id), action: 'PROPOSE' } })).toBe(1)
    })

    it('never lets a proposal arrive published, whatever the caller sends', async () => {
      const res = await propose({ isPublished: true, editorialStatus: 'PUBLISHED' })
      const { id } = await res.json()
      expect(await prisma.claim.findUniqueOrThrow({ where: { id } })).toMatchObject({ editorialStatus: 'DRAFT', isPublished: false })
    })

    it('adds extra traditions to the review scope', async () => {
      const { id } = await (await propose({ extraTraditions: ['ISLAMIC'] })).json()
      expect((await prisma.claim.findUniqueOrThrow({ where: { id } })).requiredTraditions.sort()).toEqual(['ISLAMIC', 'JEWISH'])
    })

    it('rejects wording that takes sides, with a reason', async () => {
      const res = await propose({ statement: `${TAG} Obviously this is the one true religion of Abraham.` })
      expect(res.status).toBe(400)
      expect(JSON.stringify(await res.json())).toMatch(/takes a side/)
    })

    it('requires a citation, and resolves it inside the claim’s own source', async () => {
      expect((await propose({ references: [] })).status).toBe(400)
      expect((await propose({ references: ['not a citation'] })).status).toBe(400)
      const missing = await propose({ references: ['Genesis 999:1'] })
      expect(missing.status).toBe(400)
      expect((await missing.json()).error).toMatch(/could not find/)
      const quran = (await prisma.source.findFirstOrThrow({ where: { key: 'QURAN' } })).id
      // Genesis exists, but not in the Qur’an: a citation cannot cross corpora.
      expect((await propose({ sourceId: quran, references: ['Genesis 12:1'] })).status).toBe(400)
    })

    it('rejects an unknown source and a duplicate claim', async () => {
      expect((await propose({ sourceId: 2_000_000_000 })).status).toBe(400)
      const statement = `${TAG} A statement that is proposed twice by two people.`
      expect((await propose({ statement })).status).toBe(201)
      expect((await propose({ statement })).status).toBe(409)
    })

    it('limits a contributor to five proposals a day', async () => {
      await prisma.claim.deleteMany({ where: { proposedById: USER } })
      for (let i = 0; i < 5; i++) expect((await propose()).status).toBe(201)
      expect((await propose()).status).toBe(429)
    })
  })
})
