import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { createThrottleStore, loginKeys } from '@/lib/login-throttle'

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
    jwt({ token, user }) {
      if (user?.role) token.role = user.role
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? 'unknown'
        session.user.role = token.role === 'ADMIN' ? 'ADMIN' : 'EDITOR'
      }
      return session
    },
  },
}
