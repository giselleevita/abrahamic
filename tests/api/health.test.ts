import { beforeEach, describe, expect, it, vi } from 'vitest'

const { queryRaw } = vi.hoisted(() => ({ queryRaw: vi.fn() }))
vi.mock('@/lib/prisma', () => ({ default: { $queryRaw: queryRaw } }))

import { GET } from '@/app/api/health/route'

describe('public health endpoint', () => {
  beforeEach(() => { queryRaw.mockReset() })

  it('checks the database without returning data or caching the result', async () => {
    queryRaw.mockResolvedValue([{ '?column?': 1 }])
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(await response.json()).toEqual({ status: 'ok' })
    expect(queryRaw).toHaveBeenCalledOnce()
  })

  it('returns a sanitized 503 when the database is unavailable', async () => {
    queryRaw.mockRejectedValue(new Error('secret connection string'))
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    const response = await GET()
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ status: 'unavailable' })
    expect(log).toHaveBeenCalledWith('[health-check] database unavailable')
    log.mockRestore()
  })
})
