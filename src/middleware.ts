import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Edge auth pre-check for the admin surface.
 *
 * This runs before the `getServerSession` check in `src/app/admin/layout.tsx`
 * and the per-route checks in `src/lib/api-auth.ts`; all three are kept as
 * defence in depth. `getToken` is used rather than `getServerSession` because
 * the edge runtime cannot load the Prisma adapter in `src/lib/prisma.ts`.
 *
 * The matcher is deliberately narrow. It previously matched nearly every
 * request in order to run a branch that returned `NextResponse.next()` either
 * way — cost with no effect.
 */
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (token) return NextResponse.next()

  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  // `/admin/login` and `/api/auth/*` must stay reachable while signed out.
  matcher: ['/admin/((?!login).*)', '/admin'],
}
