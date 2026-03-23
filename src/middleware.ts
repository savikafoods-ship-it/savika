import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('savika-session')
  const { pathname } = request.nextUrl

  // Redirect /admin (exact) based on session
  if (pathname === '/admin') {
    if (session) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Protect all admin routes except login
  const isProtectedAdmin =
    pathname.startsWith('/admin') && pathname !== '/admin/login'
  if (isProtectedAdmin && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Redirect to dashboard if already logged in and hitting admin login
  if (pathname === '/admin/login' && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Storefront auth: redirect logged-in users away from /auth pages
  const isStorefrontAuth = pathname.startsWith('/auth')
  if (isStorefrontAuth && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Protect storefront account/checkout/orders
  const isProtectedStorefront = ['/account', '/checkout', '/orders'].some((p) =>
    pathname.startsWith(p)
  )
  if (isProtectedStorefront && !session) {
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${pathname}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/auth/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/orders/:path*',
  ],
}
