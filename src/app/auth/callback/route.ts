import { NextResponse, type NextRequest } from 'next/server'
import { Client, Account } from 'node-appwrite'
import { cookies } from 'next/headers'

// Appwrite OAuth2 callback handler
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    
    // Check for provider error
    const error = searchParams.get('error')
    if (error) {
        return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
    }

    // SSR OAuth Session creation
    // Appwrite redirects back with userId and secret if configured for SSR
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')

    if (userId && secret) {
        try {
            const client = new Client()
                .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
                .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

            const account = new Account(client)
            const session = await account.createSession(userId, secret)
            
            // Set the session cookie so Next.js server can read it
            const cookieStore = await cookies()
            cookieStore.set(
                `a-session-${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, 
                session.secret, 
                {
                    domain: process.env.NODE_ENV === 'production' ? new URL(process.env.NEXT_PUBLIC_APP_URL || '').hostname : undefined,
                    path: '/',
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    expires: new Date(session.expire)
                }
            )
        } catch (err) {
            console.error('OAuth Callback Session Error:', err)
            return NextResponse.redirect(new URL('/auth/login?error=oauth_session_creation_failed', request.url))
        }
    }

    // Redirect to account dashboard
    return NextResponse.redirect(new URL('/account', request.url))
}
