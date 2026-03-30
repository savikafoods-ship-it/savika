import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is logged in
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse request body
    const body = await request.json()
    const { items, shipping_address, coupon_code, notes } = body

    // 3. Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
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

    // 5. Verify products and prices from database (NEVER trust client-side prices)
    const serviceClient = await createServiceClient()
    const productIds = items.map((item: { product_id: string }) => item.product_id)

    const { data: products, error: productsError } = await serviceClient
      .from('products')
      .select('id, name, is_active, metadata')
      .in('id', productIds)

    if (productsError || !products) {
      return NextResponse.json({ error: 'Failed to verify products' }, { status: 500 })
    }

    // 6. Calculate verified totals (use DB prices, not client prices)
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

      // Find the variant price from weight_pricing in metadata
      const weightPricing = product.metadata?.weight_pricing as Array<{ label: string; price: number; salePrice?: number }>
      const variant = weightPricing?.find(v => v.label === item.weight)
      
      if (!variant) {
        return NextResponse.json(
          { error: `Invalid weight variant: ${item.weight} for ${product.name}` },
          { status: 400 }
        )
      }

      const verifiedPrice = variant.salePrice || variant.price
      const itemTotal = verifiedPrice * item.quantity
      subtotal += itemTotal

      verifiedItems.push({
        product_id: item.product_id,
        name: product.name,
        tagline: item.tagline,
        weight: item.weight,
        price: verifiedPrice,       // verified server-side price
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
        // Check expiry
        if (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) {
          // Check minimum order value
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
    const delivery_fee = afterDiscount >= 599 ? 0 : 60
    const gst = Math.round(subtotal * 5 / 105)  // GST already included in MRP
    const total = afterDiscount + delivery_fee

    // 9. Generate unique 8-char alphanumeric order code
    const orderCode = '#' + crypto.randomBytes(4).toString('hex')

    // 10. Insert order into database
    const { data: order, error: insertError } = await serviceClient
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderCode,
        items: verifiedItems,
        subtotal,
        gst,
        discount,
        coupon_code: validatedCoupon,
        delivery_fee,
        total,
        status: 'pending',
        payment_method: 'cod',
        payment_status: 'pending',
        shipping_address,
        notes: notes ?? null,
      })
      .select('id, order_number')
      .single()

    if (insertError || !order) {
      console.error('Order insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create order. Please check database schema.' }, { status: 500 })
    }

    // 10. Return order ID for redirect
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    })
  } catch (error: any) {
    console.error('Create order API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
