import { beforeEach, describe, expect, it, vi } from 'vitest'

const getServerSession = vi.hoisted(() => vi.fn())
vi.mock('next-auth', () => ({ getServerSession }))
vi.mock('@/lib/auth', () => ({ contributorSessionOptions: { marker: 'contributor' } }))

import { getContributorSessionSafe } from './contributor-session'

describe('getContributorSessionSafe', () => {
  beforeEach(() => {
    getServerSession.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  it('returns the session when sign-in works', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'u1', role: 'CONTRIBUTOR' } })
    expect(await getContributorSessionSafe()).toEqual({ user: { id: 'u1', role: 'CONTRIBUTOR' } })
    expect(getServerSession).toHaveBeenCalledWith({ marker: 'contributor' })
  })

  it('returns null for a visitor with no session', async () => {
    getServerSession.mockResolvedValue(null)
    expect(await getContributorSessionSafe()).toBeNull()
  })

  it('treats a misconfigured sign-in system as signed out instead of throwing', async () => {
    getServerSession.mockRejectedValue(new Error('NO_SECRET'))
    await expect(getContributorSessionSafe()).resolves.toBeNull()
  })

  it('logs only the error message, never anything else', async () => {
    getServerSession.mockRejectedValue(Object.assign(new Error('boom'), { token: 'super-secret-token' }))
    await getContributorSessionSafe()
    const logged = JSON.stringify((console.error as unknown as { mock: { calls: unknown[][] } }).mock.calls)
    expect(logged).toContain('boom')
    expect(logged).not.toContain('super-secret-token')
  })
})
