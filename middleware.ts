import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = [
  '/family-tree',
  '/figures',
  '/comparisons',
  '/concepts',
  '/sources',
  '/glossary',
  '/verse-links',
  '/timeline',
  '/search',
  '/',
]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isPublic = publicRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  )

  if (isPublic) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth|admin/login).*)',
  ],
}
