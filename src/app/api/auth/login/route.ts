import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return NextResponse.json({ success: true, user: data.user })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login failed'
    return NextResponse.json({ error: msg }, { status: 401 })
  }
}
