import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const secret = request.nextUrl.searchParams.get('secret')

  if (!userId || !secret) {
    return NextResponse.redirect(new URL('/auth/login?error=oauth', request.url))
  }

  try {
    const { account } = await createAdminClient()
    const session = await account.createSession(userId, secret)

    const cookieStore = await cookies()
    cookieStore.set('savika-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    })

    return NextResponse.redirect(new URL('/', request.url))
  } catch {
    return NextResponse.redirect(new URL('/auth/login?error=oauth', request.url))
  }
}
