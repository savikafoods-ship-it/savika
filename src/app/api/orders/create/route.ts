import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { razorpay } from '@/lib/razorpay'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { items, shipping_address, subtotal, shipping, total, coupon_code } = body

        const rzpOrder = await razorpay.orders.create({
            amount: Math.round(total * 100),
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`
        })

        const { data, error } = await supabase.from('orders').insert({
            user_id: user.id,
            items,
            shipping_address,
            subtotal,
            discount: 0,
            total,
            coupon_code: coupon_code || null,
            status: 'pending',
            razorpay_order_id: rzpOrder.id
        }).select().single()

        if (error) throw error

        return NextResponse.json({
            orderId: data.id,
            razorpay_order_id: rzpOrder.id,
            amount: rzpOrder.amount
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
