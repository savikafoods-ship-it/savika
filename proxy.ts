import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Handle user session
    const { data: { user } } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl
    
    // Protect Admin Routes
    if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !user) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Protect User Account/Checkout
    const isProtectedStorefront = ['/account', '/checkout', '/orders'].some((p) =>
        pathname.startsWith(p)
    )
    if (isProtectedStorefront && !user) {
        return NextResponse.redirect(
            new URL(`/auth/login?next=${pathname}`, request.url)
        )
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
