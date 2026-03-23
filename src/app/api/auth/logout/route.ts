import { NextResponse } from 'next/server'
import { createSessionClient } from '@/lib/appwrite/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const { account } = await createSessionClient()
    await account.deleteSession('current')
  } catch { /* already invalid */ }
  const cookieStore = await cookies()
  cookieStore.delete('savika-session')
  return NextResponse.json({ success: true })
}
