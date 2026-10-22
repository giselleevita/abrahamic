/**
 * Database-backed accounts for OAuth sign-in.
 *
 * Identity is (provider, providerAccountId). Email is stored for contact only and is
 * never used to find or link an account, because a provider may return an unverified
 * address and linking on it would allow account takeover.
 */
import type { JWT } from 'next-auth/jwt'
import prisma from '@/lib/prisma'

export const OAUTH_PROVIDERS = ['github', 'google'] as const
export const ROLE_RECHECK_MS = 5 * 60 * 1000

const clip = (value: string | null | undefined, max: number) => (value ? value.slice(0, max) : null)

export async function isSuspended(provider: string, providerAccountId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    select: { status: true },
  })
  return user?.status === 'SUSPENDED'
}

export async function upsertOAuthUser(input: {
  provider: string
  providerAccountId: string
  email?: string | null
  name?: string | null
}) {
  return prisma.user.upsert({
    where: {
      provider_providerAccountId: { provider: input.provider, providerAccountId: input.providerAccountId },
    },
    create: {
      provider: input.provider,
      providerAccountId: input.providerAccountId,
      email: clip(input.email, 254),
      displayName: clip(input.name, 100),
    },
    // Role and status are never touched by a sign-in.
    update: { email: clip(input.email, 254), displayName: clip(input.name, 100), lastSignInAt: new Date() },
  })
}

/** Copies the authoritative database state onto the token. Suspended or deleted => no role. */
export async function refreshTokenFromDb(token: JWT, now = Date.now()): Promise<JWT> {
  if (!token.uid) return token
  const user = await prisma.user.findUnique({
    where: { id: token.uid },
    select: {
      role: true,
      status: true,
      reviewerProfiles: { where: { status: 'APPROVED' }, select: { tradition: true } },
    },
  })
  token.checkedAt = now
  if (!user || user.status !== 'ACTIVE') {
    delete token.role
    token.reviewerTraditions = []
    return token
  }
  token.role = user.role
  // The database CHECK forbids SHARED; filtering here keeps the type honest too.
  token.reviewerTraditions = user.reviewerProfiles
    .map((profile) => profile.tradition)
    .filter((tradition): tradition is 'JEWISH' | 'CHRISTIAN' | 'ISLAMIC' => tradition !== 'SHARED')
  return token
}

export function needsRecheck(token: JWT, now = Date.now()): boolean {
  return Boolean(token.uid) && (!token.checkedAt || now - token.checkedAt > ROLE_RECHECK_MS)
}
