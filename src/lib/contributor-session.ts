import { getServerSession } from 'next-auth'
import { contributorSessionOptions } from '@/lib/auth'

/**
 * The contributor session for server-rendered public pages, or null.
 *
 * `getServerSession` throws when sign-in is misconfigured (for example NEXTAUTH_SECRET is missing).
 * Those pages are open to anonymous visitors, so a broken sign-in setup must show the signed-out
 * view, never a 500. It fails closed: an error is treated as "not signed in", which grants nothing.
 * Only the error's message is logged, never the session or any token.
 */
export async function getContributorSessionSafe() {
  try {
    return await getServerSession(contributorSessionOptions)
  } catch (error) {
    console.error('[contributor-session] treating visitor as signed out:', error instanceof Error ? error.message : 'unknown error')
    return null
  }
}
