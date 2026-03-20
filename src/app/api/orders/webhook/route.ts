import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(req: Request) {
    const text = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 })

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!
    const expectedSig = crypto.createHmac('sha256', secret).update(text).digest('hex')

    if (expectedSig !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    try {
        const event = JSON.parse(text)
        
        if (event.event === 'order.paid' || event.event === 'payment.captured') {
            const payment = event.payload.payment.entity
            const razorpay_order_id = payment.order_id
            
            const { data: order, error } = await supabaseAdmin
                .from('orders')
                .update({ status: 'paid', razorpay_payment_id: payment.id })
                .eq('razorpay_order_id', razorpay_order_id)
                .select('*, profiles(full_name, email)')
                .single()
                
            if (error) throw error

            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
            fetch(`${appUrl}/api/notify/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    total: order.total,
                    userName: order.profiles?.full_name || 'Customer',
                    userEmail: order.profiles?.email,
                    items: order.items
                })
            }).catch(console.error)
        }

        return NextResponse.json({ ok: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
