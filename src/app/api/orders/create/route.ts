import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { items, shipping_address, subtotal, shipping, total, coupon_code } = body

        const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('id', user.id).single()

        const { data, error } = await supabase.from('orders').insert({
            user_id: user.id,
            items,
            shipping_address,
            subtotal,
            discount: 0,
            total,
            coupon_code: coupon_code || null,
            status: 'processing'
        }).select().single()

        if (error) throw error

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        fetch(`${appUrl}/api/notify/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: data.id,
                total: data.total,
                userName: profile?.full_name || 'Customer',
                userEmail: profile?.email,
                items: data.items
            })
        }).catch(console.error)

        return NextResponse.json({
            orderId: data.id
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
