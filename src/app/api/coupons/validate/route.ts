import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json()

    if (!code || !subtotal) {
      return NextResponse.json({ valid: false, error: 'Missing fields' })
    }

    const supabase = await createServiceClient()
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !coupon) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code' })
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired' })
    }

    if (coupon.min_order_value && subtotal < coupon.min_order_value) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order value Rs.${coupon.min_order_value} required`
      })
    }

    const discount = coupon.discount_percent
      ? Math.round((subtotal * coupon.discount_percent) / 100)
      : Math.min(coupon.discount_flat, subtotal)

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discount,
      description: coupon.discount_percent
        ? `${coupon.discount_percent}% off applied`
        : `Rs.${discount} off applied`,
    })
  } catch (error: any) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ valid: false, error: 'Server error during validation' })
  }
}
