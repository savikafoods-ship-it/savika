import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Admin only
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serviceClient = await createServiceClient()

    const { data: orders, error } = await serviceClient
      .from('orders')
      .select('id, order_number, total, status, created_at, shipping_address, payment_method')
      .order('created_at', { ascending: false })
      .limit(15)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json(orders || [])
  } catch (error: any) {
    console.error('Recent orders API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
