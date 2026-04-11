import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if the current user is an admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const primaryAdminEmail = process.env.ADMIN_EMAIL || 'savikafoods@gmail.com'
    const isSuperAdmin = user.email === primaryAdminEmail

    if (!isSuperAdmin && (!profile || profile.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 })
    }

    // Get new admin details
    const { email, password, full_name, permissions } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Use Service Role to create the user in Auth and Profiles
    const serviceClient = await createServiceClient()

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, name: full_name }
    })

    if (authError) throw authError

    // 2. Insert into Profiles table
    const { error: profileError } = await serviceClient
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        role: 'staff', // Default to staff, super-admin can escalate if needed
        metadata: { permissions }
      })

    if (profileError) {
      // Cleanup if profile creation fails? (optional)
      console.error('Profile Creation Error:', profileError)
      return NextResponse.json({ error: 'User created in Auth but Profile failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Admin account created successfully' })

  } catch (err: unknown) {
    console.error('Create Admin Error:', err)
    const msg = err instanceof Error ? err.message : 'Failed to create admin'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
