import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import bcrypt from 'bcryptjs'

import { loginKeys } from '@/lib/login-throttle'

const describeDb = process.env.DATABASE_URL ? describe : describe.skip

describeDb('sign-in throttling (authorize, real database)', () => {
  const PASSWORD = 'correct horse battery staple'
  const EMAIL = 'throttle-admin@example.test'
  const headers = { 'x-forwarded-for': '198.51.100.99, 10.0.0.1' }
  let authorize: (c: { email: string; password: string }, req: { headers: Record<string, string> }) => Promise<unknown>
  let prisma: typeof import('@/lib/prisma').default

  beforeAll(async () => {
    process.env.ADMIN_EMAIL = EMAIL
    process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(PASSWORD, 4)
    process.env.EDITOR_EMAIL = ''
    process.env.EDITOR_PASSWORD_HASH = ''
    prisma = (await import('@/lib/prisma')).default
    const { authOptions } = await import('@/lib/auth')
    const provider = authOptions.providers[0] as unknown as { options: { authorize: typeof authorize } }
    authorize = provider.options.authorize
  })
  // Scoped to this file's own keys: other DB test files share the table and run in parallel.
  const ownKeys = () => {
    const a = loginKeys(EMAIL, '198.51.100.99')
    const b = loginKeys('nobody@example.test', '198.51.100.99')
    return [a.email, a.ip, b.email, b.ip]
  }
  const cleanup = () => prisma.loginAttempt.deleteMany({ where: { key: { in: ownKeys() } } })
  beforeEach(async () => { await cleanup() })
  afterAll(async () => { await cleanup() })

  const attempt = (password: string) => authorize({ email: EMAIL, password }, { headers })

  it('signs in with the right password', async () => {
    expect(await attempt(PASSWORD)).toMatchObject({ email: EMAIL, role: 'ADMIN' })
  })

  it('refuses even the correct password once the account is locked', async () => {
    for (let i = 0; i < 5; i++) expect(await attempt('wrong-' + i)).toBeNull()
    expect(await attempt(PASSWORD)).toBeNull()
  })

  it('does not lock before the fifth failure', async () => {
    for (let i = 0; i < 4; i++) await attempt('wrong-' + i)
    expect(await attempt(PASSWORD)).toMatchObject({ role: 'ADMIN' })
  })

  it('resets the account counter after a successful sign-in', async () => {
    for (let i = 0; i < 4; i++) await attempt('wrong-' + i)
    await attempt(PASSWORD)
    for (let i = 0; i < 4; i++) await attempt('wrong-again-' + i)
    expect(await attempt(PASSWORD)).toMatchObject({ role: 'ADMIN' })
  })

  it('counts unknown emails too, so account existence is not revealed by lockout behaviour', async () => {
    for (let i = 0; i < 5; i++) await authorize({ email: 'nobody@example.test', password: 'x' }, { headers })
    const rows = await prisma.loginAttempt.findMany({ where: { key: { in: ownKeys() } } })
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.some((row) => row.failures === 5 && row.lockedUntil)).toBe(true)
  })
})
