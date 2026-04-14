import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // 1. Check if user is logged in (OPTIONAL - guest checkout allowed)
    let userId: string | null = null
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) userId = user.id
    } catch {
      // Guest checkout - no user, that's fine
    }

    // 2. Parse request body
    const body = await request.json()
    const { items, shipping_address, coupon_code, notes, email } = body
    const payment_method = 'online' // Force online, no COD allowed

    // 3. Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const requiredAddressFields = ['full_name', 'mobile', 'street', 'city', 'state', 'pincode']
    for (const field of requiredAddressFields) {
      if (!shipping_address?.[field]) {
        return NextResponse.json({ error: `Missing address field: ${field}` }, { status: 400 })
      }
    }

    // 4. Validate mobile number (10 digits)
    const mobile = shipping_address.mobile.replace(/\D/g, '')
    if (mobile.length !== 10) {
      return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 })
    }

    // 5. Verify products, prices, and STOCK from database
    const serviceClient = await createServiceClient()
    const productIds = items.map((item: { product_id: string }) => item.product_id)

    const { data: products, error: productsError } = await serviceClient
      .from('products')
      .select('id, name, is_active, metadata, stock, price')
      .in('id', productIds)

    if (productsError || !products) {
      console.error('Products fetch error:', productsError)
      return NextResponse.json({ error: 'Failed to verify products' }, { status: 500 })
    }

    // 6. Calculate verified totals and check inventory
    let subtotal = 0
    const verifiedItems = []

    for (const item of items) {
      const product = products.find((p: any) => p.id === item.product_id)
      if (!product || !product.is_active) {
        return NextResponse.json(
          { error: `Product not available: ${item.name}` },
          { status: 400 }
        )
      }

      // Check stock
      if (product.stock !== null && product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
          { status: 400 }
        )
      }

      // Find the variant price from weight_pricing in metadata
      let verifiedPrice = product.price // fallback to base price
      const weightPricing = product.metadata?.weight_pricing as Array<{ label: string; price: number; salePrice?: number }> | undefined
      
      if (weightPricing && weightPricing.length > 0) {
        const variant = weightPricing.find(v => v.label === item.weight)
        if (variant) {
          verifiedPrice = variant.salePrice || variant.price
        }
        // If no variant match but weight_pricing exists, use the submitted price
        // This handles edge cases where the label format might differ slightly
      }

      const itemTotal = verifiedPrice * item.quantity
      subtotal += itemTotal

      verifiedItems.push({
        product_id: item.product_id,
        name: product.name,
        tagline: item.tagline,
        weight: item.weight,
        price: verifiedPrice,
        quantity: item.quantity,
        image_url: item.image_url,
      })
    }

    // 7. Validate coupon if provided
    let discount = 0
    let validatedCoupon = null

    if (coupon_code) {
      const { data: coupon } = await serviceClient
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (coupon) {
        if (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) {
          if (subtotal >= (coupon.min_order_value ?? 0)) {
            if (coupon.discount_percent) {
              discount = Math.round((subtotal * coupon.discount_percent) / 100)
            } else if (coupon.discount_flat) {
              discount = Math.min(coupon.discount_flat, subtotal)
            }
            validatedCoupon = coupon.code
          }
        }
      }
    }

    // 8. Calculate delivery fee and GST (5% included in MRP)
    const afterDiscount = subtotal - discount
    const delivery_fee = afterDiscount >= 599 ? 0 : 25
    const gst = Math.round(subtotal * 5 / 105)
    const total = afterDiscount + delivery_fee

    // 9. Generate unique order code (SAV-XXXXX)
    const orderCode = 'SAV-' + Math.floor(10000 + Math.random() * 90000).toString()

    // 10. Insert order into database (user_id is NULL for guests)
    const orderData: any = {
      order_number: orderCode,
      items: verifiedItems,
      subtotal,
      gst,
      discount,
      coupon_code: validatedCoupon,
      delivery_fee,
      total,
      total_amount: total,  // Legacy column - same as total
      status: 'pending',
      payment_method: 'online',
      payment_status: 'pending',
      shipping_address,
      customer_email: email,
      customer_name: shipping_address.full_name,
      notes: notes ?? null,
    }

    // Only include user_id if a logged-in user exists
    if (userId) {
      orderData.user_id = userId
    }

    const { data: order, error: insertError } = await serviceClient
      .from('orders')
      .insert(orderData)
      .select('id, order_number')
      .single()

    if (insertError || !order) {
      console.error('Order insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create order: ' + (insertError?.message || 'Unknown error') }, { status: 500 })
    }

    // 10.5 Handle Razorpay Order Creation
    let razorpayOrder = null
    if (true) { // Always create Razorpay order now
      try {
        const { razorpay } = await import('@/lib/razorpay')
        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(total * 100), // Razorpay expects paise
          currency: 'INR',
          receipt: order.order_number,
          notes: {
            order_id: order.id
          }
        })

        // Update order with Razorpay Order ID
        await serviceClient
          .from('orders')
          .update({ rzp_order_id: razorpayOrder.id })
          .eq('id', order.id)
      } catch (rzpErr: any) {
        console.error('Razorpay order creation error:', rzpErr)
        return NextResponse.json({ error: 'Failed to initiate online payment' }, { status: 500 })
      }
    }

    // COD logic removed (now prepaid only)

    // 12. Return order info for redirect/payment
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      razorpayOrder: razorpayOrder // Will be null for COD
    })
  } catch (error: any) {
    console.error('Create order API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
