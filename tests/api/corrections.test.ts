import { beforeEach, describe, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ create: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), updateMany: vi.fn(), requireSession: vi.fn(), rateLimit: vi.fn() }))
vi.mock('@/lib/prisma', () => ({ default: { comparison: { findUnique: mocks.findUnique }, source: { findUnique: mocks.findUnique }, verse: { findFirst: mocks.findFirst }, correctionReport: { create: mocks.create, findMany: mocks.findMany, updateMany: mocks.updateMany } } }))
vi.mock('@/lib/api-auth', () => ({ requireSession: mocks.requireSession }))
vi.mock('@/lib/rate-limit', () => ({ rateLimit: mocks.rateLimit, requestKey: () => 'test' }))
import { POST } from '@/app/api/corrections/route'
import { GET } from '@/app/api/admin/corrections/route'
import { PATCH } from '@/app/api/admin/corrections/[id]/route'
const body = { pagePath: '/comparisons/1', category: 'SOURCE', description: 'This reference points to a different passage.' }
const request = (value: unknown = body, origin = 'https://example.test') => new Request('https://example.test/api/corrections', { method: 'POST', headers: { Origin: origin }, body: JSON.stringify(value) })
beforeEach(() => {
  vi.resetAllMocks()
  mocks.rateLimit.mockReturnValue({ ok: true })
  mocks.findUnique.mockResolvedValue({ id: 1 })
  mocks.create.mockResolvedValue({ id: 1 })
  mocks.requireSession.mockResolvedValue(null)
  mocks.updateMany.mockResolvedValue({ count: 1 })
  mocks.findMany.mockResolvedValue([])
})
describe('private correction inbox', () => {
  it('accepts an anonymous report for a published page without returning its content', async () => {
    const res = await POST(request())
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ ok: true })
    expect(mocks.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1, isPublished: true } }))
    expect(mocks.create).toHaveBeenCalledWith({ data: { ...body, reference: null } })
  })
  it('rejects cross-origin, malformed, short and kids reports before writing', async () => {
    expect((await POST(request(body, 'https://other.test'))).status).toBe(403)
    expect((await POST(request({ ...body, description: 'short' }))).status).toBe(400)
    expect((await POST(request({ ...body, pagePath: '/kids' }))).status).toBe(400)
    expect((await POST(new Request('https://example.test/api/corrections', { method: 'POST', headers: { Origin: 'https://example.test' }, body: '{' }))).status).toBe(400)
    expect(mocks.create).not.toHaveBeenCalled()
  })
  it('drops honeypot submissions and rejects missing published records', async () => {
    expect((await POST(request({ ...body, website: 'spam' }))).status).toBe(201)
    expect(mocks.create).not.toHaveBeenCalled()
    mocks.findUnique.mockResolvedValue(null)
    expect((await POST(request())).status).toBe(404)
    expect(mocks.create).not.toHaveBeenCalled()
  })
  it('returns retry information when throttled and a safe retry message on failure', async () => {
    mocks.rateLimit.mockReturnValue({ ok: false, retryAfterSeconds: 30 })
    const res = await POST(request())
    expect(res.status).toBe(429)
    expect(res.headers.get('retry-after')).toBe('30')
    mocks.rateLimit.mockReturnValue({ ok: true })
    mocks.create.mockRejectedValue(new Error('private database detail'))
    const failed = await POST(request())
    expect(failed.status).toBe(503)
    expect(await failed.text()).not.toContain('private database detail')
  })
  it('requires authentication before listing or changing reports', async () => {
    mocks.requireSession.mockResolvedValue(Response.json({ error: 'Unauthorized' }, { status: 401 }))
    expect((await GET(new Request('https://example.test/api/admin/corrections'))).status).toBe(401)
    expect((await PATCH(request(), { params: Promise.resolve({ id: '1' }) })).status).toBe(401)
    expect(mocks.findMany).not.toHaveBeenCalled()
    expect(mocks.updateMany).not.toHaveBeenCalled()
  })
  it('allows editors to resolve reports without publishing content', async () => {
    const res = await PATCH(request({ status: 'RESOLVED' }), { params: Promise.resolve({ id: '1' }) })
    expect(res.status).toBe(200)
    expect(mocks.updateMany).toHaveBeenCalledWith({ where: { id: 1 }, data: { status: 'RESOLVED' } })
  })
})
