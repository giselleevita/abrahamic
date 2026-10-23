/**
 * Two views of the same sign-in cookie.
 *
 * Every admin route and page calls `getServerSession(authOptions)` and treats any
 * session as "staff". Contributors now sign in too, so that check must not pass for
 * them. Rather than patch ~45 call sites, the staff view returns an EMPTY object
 * for anyone who is not staff, which next-auth's `getServerSession` turns into
 * `null`. A contributor therefore fails every existing admin check by construction,
 * including routes added later.
 *
 * Contributor pages and APIs read the other view, `contributorSessionOptions`.
 */
import type { Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

export const STAFF_ROLES = ['EDITOR', 'ADMIN'] as const
export type StaffRole = (typeof STAFF_ROLES)[number]

export function isStaffRole(role: unknown): role is StaffRole {
  return role === 'EDITOR' || role === 'ADMIN'
}

/** What admin code sees. Empty (=> null session) unless the token is staff. */
export function staffSessionView(session: Session, token: JWT): Session {
  if (!isStaffRole(token.role)) return {} as Session
  if (session.user) {
    session.user.id = token.uid ?? token.sub ?? 'unknown'
    session.user.role = token.role
  }
  return session
}

/** What contributor code sees. Only database-backed accounts qualify. */
export function contributorSessionView(session: Session, token: JWT): Session {
  if (!token.uid || !token.role) return {} as Session
  if (session.user) {
    session.user.id = token.uid
    session.user.role = token.role
    session.user.reviewerTraditions = token.reviewerTraditions ?? []
  }
  return session
}
