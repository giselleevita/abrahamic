/**
 * Shared admin-boundary helpers for route handlers.
 *
 * Every mutating route previously inlined the same `getServerSession` → 401
 * block. Centralising it keeps the guard uniform and makes the boundary
 * enumerable in tests (see `tests/api/auth-guards.test.ts`).
 */
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

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
