import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { createThrottleStore, loginKeys } from '@/lib/login-throttle'
import { isSuspended, needsRecheck, refreshTokenFromDb, upsertOAuthUser } from '@/lib/accounts'
import { contributorSessionView, staffSessionView } from '@/lib/session-views'

/** Providers are offered only when their keys are configured, so an unconfigured site shows no dead buttons. */
export function configuredOAuthProviders(env: NodeJS.ProcessEnv = process.env): ('github' | 'google')[] {
  const list: ('github' | 'google')[] = []
  if (env.GITHUB_ID && env.GITHUB_SECRET) list.push('github')
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) list.push('google')
  return list
}

/** First hop of x-forwarded-for (set by Vercel), else x-real-ip. */
export function clientIp(headers: Record<string, unknown> | undefined): string | null {
  const forwarded = headers?.['x-forwarded-for']
  const first = typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : ''
  const real = headers?.['x-real-ip']
  return first || (typeof real === 'string' ? real : null) || null
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null

        const store = createThrottleStore(prisma)
        const keys = loginKeys(credentials.email, clientIp(req?.headers))
        // Fail closed: if the throttle cannot be checked, do not allow a guess.
        try {
          if (await store.blockedFor(keys) > 0) return null
        } catch {
          return null
        }

        const identities = [
          { id: 'admin', email: process.env.ADMIN_EMAIL, hash: process.env.ADMIN_PASSWORD_HASH, role: 'ADMIN' as const },
          { id: 'editor', email: process.env.EDITOR_EMAIL, hash: process.env.EDITOR_PASSWORD_HASH, role: 'EDITOR' as const },
        ]
        const identity = identities.find(({ email, hash }) => email && hash && credentials.email === email)
        const valid = Boolean(identity?.email && identity.hash && await bcrypt.compare(credentials.password, identity.hash))
        if (!identity?.email || !valid) {
          await store.recordFailure(keys).catch(() => undefined)
          return null
        }
        await store.clearEmail(keys).catch(() => undefined)
        return { id: identity.id, email: identity.email, name: identity.role === 'ADMIN' ? 'Admin' : 'Editor', role: identity.role }
      },
    }),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [GitHubProvider({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET })]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account }) {
      if (!account || account.provider === 'credentials') return true
      // Suspended accounts cannot start a new session.
      try {
        return !(await isSuspended(account.provider, account.providerAccountId))
      } catch {
        return false
      }
    },
    async jwt({ token, user, account }) {
      if (account && account.provider !== 'credentials') {
        // OAuth sign-in: the database, not the provider, decides the role.
        const dbUser = await upsertOAuthUser({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email: user?.email,
          name: user?.name,
        })
        token.uid = dbUser.id
        return refreshTokenFromDb(token)
      }
      if (user?.role) {
        // Environment-credential admin/editor: no database identity.
        token.role = user.role
        delete token.uid
        return token
      }
      if (needsRecheck(token)) return refreshTokenFromDb(token)
      return token
    },
    session({ session, token }) {
      return staffSessionView(session, token)
    },
  },
}

/** Same cookie and secret, different view: lets signed-in contributors read their own session. */
export const contributorSessionOptions: AuthOptions = {
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    session({ session, token }) {
      return contributorSessionView(session, token)
    },
  },
}
