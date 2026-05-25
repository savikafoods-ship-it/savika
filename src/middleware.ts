import { NextRequest, NextResponse } from 'next/server'

/**
 * Maintenance Mode Middleware
 * 
 * When MAINTENANCE_MODE=true in .env.local, all storefront traffic
 * is redirected to /maintenance. Admin routes, API routes, static assets,
 * and the maintenance page itself are excluded.
 * 
 * To enable:  Set MAINTENANCE_MODE=true in .env.local, restart the server
 * To disable: Set MAINTENANCE_MODE=false (or remove the line), restart the server
 */
export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  if (!isMaintenanceMode) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Allow these paths through even in maintenance mode
  const allowedPaths = [
    '/maintenance',       // The maintenance page itself
    '/admin',             // Admin panel access
    '/api',               // API routes (webhooks, etc.)
    '/_next',             // Next.js internals (JS, CSS, HMR)
    '/favicon.ico',       // Browser favicon
    '/logo.png',          // Logo used on maintenance page
    '/static',            // Static assets
  ]

  const isAllowed = allowedPaths.some((path) => pathname.startsWith(path))

  if (isAllowed) {
    return NextResponse.next()
  }

  // Redirect everything else to /maintenance
  const maintenanceUrl = request.nextUrl.clone()
  maintenanceUrl.pathname = '/maintenance'
  return NextResponse.rewrite(maintenanceUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image).*)',
  ],
}
