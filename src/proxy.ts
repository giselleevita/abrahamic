import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isStaffRole } from '@/lib/session-views'

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
export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // A contributor's token is valid but is not staff: it must not reach the CMS.
  if (token && isStaffRole(token.role)) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
