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
import type { ReviewActor, ReviewTradition } from '@/lib/editorial/signoff'

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

/**
 * Who is trying to review. The environment administrator may stand in for any tradition
 * (recorded as the project editor); a signed-in contributor may review only the traditions
 * an administrator has approved them for. Decided from the session alone, before any query.
 */
export async function requireReviewActor(): Promise<Guard<{ id: string; role: 'ADMIN' | 'REVIEWER'; actor: ReviewActor }>> {
  const staff = await getServerSession(authOptions)
  if (staff?.user.role === 'ADMIN') {
    return { ok: true, value: { id: staff.user.id, role: 'ADMIN', actor: { isAdmin: true, reviewerTraditions: [] } } }
  }
  const contributor = await getServerSession(contributorSessionOptions)
  if (!contributor) return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const traditions = (contributor.user.reviewerTraditions ?? []) as ReviewTradition[]
  return {
    ok: true,
    value: { id: contributor.user.id, role: 'REVIEWER', actor: { isAdmin: false, reviewerTraditions: traditions } },
  }
}

/**
 * The staff session, or null. For PUBLIC reads that show a little more to staff (drafts, unpublished
 * items): if sign-in itself is broken (for example NEXTAUTH_SECRET is missing), a visitor must still get
 * the public answer, not a 500. Failing to establish who someone is means treating them as a visitor,
 * which can only ever show them less.
 */
export async function getStaffSessionSafe() {
  try {
    return await getServerSession(authOptions)
  } catch (error) {
    console.error('[staff-session] treating request as a visitor:', error instanceof Error ? error.message : 'unknown error')
    return null
  }
}

export async function hasSession(): Promise<boolean> {
  return Boolean(await getStaffSessionSafe())
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

/**
 * Same shape as `requireSession`, but administrator only: 401 when unauthenticated, 403 for an
 * EDITOR. Editors may draft and request review of claims; everything else that changes live
 * content (figures, themes, translations, videos, AI drafts, ...) is the administrator's.
 */
export async function requireAdminSession(): Promise<NextResponse | null> {
  const guard = await requireAdmin()
  return guard.ok ? null : guard.response
}
