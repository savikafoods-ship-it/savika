import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        
        // 1. Get User
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { items, shippingAddress, subtotal, shipping, total, couponCode } = body

        // 2. Create Order in Supabase
        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                customer_email: user.email,
                customer_name: user.user_metadata?.full_name || 'Anonymous',
                items: items, 
                shipping_address: shippingAddress, 
                subtotal,
                discount: 0,
                total,
                coupon_code: couponCode || null,
                status: 'processing'
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({
            orderId: order.id
        })
    } catch (e: any) {
        console.error('Order creation error:', e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
