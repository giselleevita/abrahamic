import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const identities = [
          { id: 'admin', email: process.env.ADMIN_EMAIL, hash: process.env.ADMIN_PASSWORD_HASH, role: 'ADMIN' as const },
          { id: 'editor', email: process.env.EDITOR_EMAIL, hash: process.env.EDITOR_PASSWORD_HASH, role: 'EDITOR' as const },
        ]
        const identity = identities.find(({ email, hash }) => email && hash && credentials.email === email)
        if (!identity?.email || !identity.hash) return null
        if (!await bcrypt.compare(credentials.password, identity.hash)) return null
        return { id: identity.id, email: identity.email, name: identity.role === 'ADMIN' ? 'Admin' : 'Editor', role: identity.role }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
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
