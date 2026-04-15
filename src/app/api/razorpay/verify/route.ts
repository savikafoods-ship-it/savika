import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Razorpay verification request body:', body)
    
    const { 
      orderId,
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }
    
    if (!razorpay_order_id) {
      return NextResponse.json({ error: 'Missing razorpay_order_id' }, { status: 400 })
    }
    
    if (!razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing razorpay_payment_id' }, { status: 400 })
    }
    
    if (!razorpay_signature) {
      return NextResponse.json({ error: 'Missing razorpay_signature' }, { status: 400 })
    }

    // 1. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
        return NextResponse.json({ error: 'Gateway configuration missing' }, { status: 500 })
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // 2. Update Order
    const serviceClient = await createServiceClient()
    
    // Fetch order first to get details for notifications and stock
    const { data: order, error: fetchError } = await serviceClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.payment_status === 'paid') {
        return NextResponse.json({ success: true, message: 'Already paid' })
    }

    const { error: updateError } = await serviceClient
      .from('orders')
      .update({
        payment_status: 'paid',
        rzp_payment_id: razorpay_payment_id,
        rzp_signature: razorpay_signature,
        status: 'processing' // Move from pending once paid
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Order update error:', updateError)
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }

    // 3. Post-payment Actions (Stock & Notifications)
    
    // 3.1 Trigger Notifications
    try {
      const { sendOrderConfirmation } = await import('@/lib/notifications')
      sendOrderConfirmation(order).catch(err => console.error('Notification error:', err))
    } catch (notifErr) {
      console.error('Failed to trigger notification:', notifErr)
    }

    // 3.2 Decrement Stock
    try {
        const items = order.items as any[]
        for (const item of items) {
            const { data: product } = await serviceClient
                .from('products')
                .select('stock')
                .eq('id', item.product_id)
                .single()

            if (product && product.stock !== null) {
                const newStock = Math.max(0, product.stock - item.quantity)
                await serviceClient
                    .from('products')
                    .update({ stock: newStock })
                    .eq('id', item.product_id)
            }
        }
    } catch (stockErr) {
        console.error('Stock decrement error:', stockErr)
    }

    // 3.3 Trigger Shipping
    try {
        const baseUrl = request.nextUrl.origin
        fetch(`${baseUrl}/api/shipping/create-shipment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderId })
        }).catch(e => console.error('Automated shipping trigger failed:', e))
    } catch (shipErr) {
        console.error('Failed to trigger shipping pipeline:', shipErr)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Razorpay verification error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
