import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { order_number, email } = await request.json()

    if (!order_number || !email) {
      return NextResponse.json({ error: 'Order number and email are required' }, { status: 400 })
    }

    const serviceClient = await createServiceClient()

    // Clean up the order number — allow with or without #
    const cleanOrderNumber = order_number.trim().toUpperCase()
    const searchVariants = [cleanOrderNumber, `#${cleanOrderNumber}`, cleanOrderNumber.replace('#', '')]

    const { data: order, error } = await serviceClient
      .from('orders')
      .select('id, order_number, status, items, subtotal, gst, discount, delivery_fee, total, total_amount, shipping_address, payment_method, payment_status, tracking_id, courier_name, created_at, customer_email, customer_name')
      .in('order_number', searchVariants)
      .eq('customer_email', email.trim().toLowerCase())
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found. Please check your order number and email.' }, { status: 404 })
    }

    // Don't expose internal IDs
    return NextResponse.json({
      order_number: order.order_number,
      status: order.status,
      items: order.items,
      subtotal: order.subtotal,
      gst: order.gst,
      discount: order.discount,
      delivery_fee: order.delivery_fee,
      total: order.total || order.total_amount,
      shipping_address: order.shipping_address,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      tracking_id: order.tracking_id,
      courier_name: order.courier_name,
      created_at: order.created_at,
      customer_name: order.customer_name,
    })
  } catch (error: any) {
    console.error('Track order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
