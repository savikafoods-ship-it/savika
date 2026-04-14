import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized', status: 401 }

  const primaryAdminEmail = process.env.ADMIN_EMAIL || 'savikafoods@gmail.com'
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  const isAdmin = user.email === primaryAdminEmail || profile?.role === 'admin' || profile?.role === 'staff'
  
  if (!isAdmin) return { error: 'Forbidden', status: 403 }
  
  return { user, isAdmin: true }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdmin()
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const data = await request.json()
    const serviceClient = await createServiceClient()
    
    const { data: category, error } = await serviceClient
      .from('categories')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Category creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await checkAdmin()
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const { id, ...data } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const serviceClient = await createServiceClient()
    
    const { data: category, error } = await serviceClient
      .from('categories')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Category update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
