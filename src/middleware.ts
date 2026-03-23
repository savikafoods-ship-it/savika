import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Appwrite stores session as cookies set by the client SDK.
  // The middleware simply passes cookies through — Appwrite handles
  // session validation when the client/server SDK makes a request.
  // We keep this middleware to ensure cookies are forwarded properly.
  const response = NextResponse.next({ request })
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|offline.html).*)'],
}
