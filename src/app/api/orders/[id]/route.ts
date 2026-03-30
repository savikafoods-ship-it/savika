import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const serviceClient = await createServiceClient()

    // Fetch order and join with user profile
    const { data: order, error } = await serviceClient
      .from('orders')
      .select('*, profiles:user_id(*)')
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Security check: Only original user or admin can see the order
    const isAdmin = user.user_metadata?.role === 'admin'
    if (order.user_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Order GET API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Admin only check
    if (!user || user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { status, tracking_id, courier_name } = body

    const validStatuses = [
      'pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'
    ]

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updateData: any = { status }
    
    // Add timestamps based on status
    if (status === 'confirmed') updateData.confirmed_at = new Date().toISOString()
    if (status === 'shipped') {
      if (!tracking_id || !courier_name) {
        return NextResponse.json({ error: 'Tracking ID and Courier Name are required when shipping' }, { status: 400 })
      }
      updateData.shipped_at = new Date().toISOString()
      updateData.tracking_id = tracking_id
      updateData.courier_name = courier_name
    }
    if (status === 'delivered') updateData.delivered_at = new Date().toISOString()
    if (status === 'cancelled') updateData.cancelled_at = new Date().toISOString()

    const serviceClient = await createServiceClient()
    const { data: updatedOrder, error } = await serviceClient
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Order patch error:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json(updatedOrder)
  } catch (error: any) {
    console.error('Order PATCH API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
