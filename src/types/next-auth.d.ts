import 'next-auth'
import 'next-auth/jwt'

type Tradition = 'JEWISH' | 'CHRISTIAN' | 'ISLAMIC'
type AppRole = 'CONTRIBUTOR' | 'EDITOR' | 'ADMIN'

declare module 'next-auth' {
  interface User {
    role: 'EDITOR' | 'ADMIN'
  }
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      /** Staff view: EDITOR | ADMIN. Contributor view may also be CONTRIBUTOR. */
      role: AppRole
      reviewerTraditions?: Tradition[]
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: AppRole
    /** Database user id; absent for the environment-credential admin and editor. */
    uid?: string
    reviewerTraditions?: Tradition[]
    /** Epoch ms of the last database re-check of role and status. */
    checkedAt?: number
  }
}
