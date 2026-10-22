/**
 * Shared admin-boundary helpers for route handlers.
 *
 * Every mutating route previously inlined the same `getServerSession` → 401
 * block. Centralising it keeps the guard uniform and makes the boundary
 * enumerable in tests (see `tests/api/auth-guards.test.ts`).
 */
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions, contributorSessionOptions } from '@/lib/auth'

type Guard<T> = { ok: true; value: T } | { ok: false; response: NextResponse }

/**
 * Administrator only (403 for an EDITOR, 401 when unauthenticated). Used for
 * managing users and reviewer approvals, which an editor must never control.
 */
export async function requireAdmin(): Promise<Guard<{ id: string }>> {
  const session = await getServerSession(authOptions)
  if (!session) return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (session.user.role !== 'ADMIN') {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { ok: true, value: { id: session.user.id } }
}

/** A signed-in, database-backed contributor (or editor). Never the environment admin. */
export async function requireContributor(): Promise<Guard<{ id: string; role: string }>> {
  const session = await getServerSession(contributorSessionOptions)
  if (!session) return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  return { ok: true, value: { id: session.user.id, role: session.user.role } }
}

export async function hasSession(): Promise<boolean> {
  return Boolean(await getServerSession(authOptions))
}

/**
 * Returns a 401 response when unauthenticated, or `null` to proceed.
 *
 * Callers must return the response before touching Prisma:
 *
 *   const denied = await requireSession()
 *   if (denied) return denied
 */
export async function requireSession(): Promise<NextResponse | null> {
  if (await hasSession()) return null
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
