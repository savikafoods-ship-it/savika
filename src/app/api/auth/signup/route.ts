import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) throw error

    return NextResponse.json({ success: true, user: data.user })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Signup failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
