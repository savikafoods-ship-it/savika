import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getShiprocketAuthToken, createShiprocketOrder } from '@/lib/shipping/shiprocket'

export async function POST(request: NextRequest) {
    try {
        const { orderId } = await request.json()

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
        }

        const supabase = await createServiceClient()

        // 1. Fetch order details from DB
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // 2. Auth with Shiprocket
        let token
        try {
            token = await getShiprocketAuthToken()
        } catch (authErr: any) {
            console.error('Shiprocket Auth Error:', authErr)
            return NextResponse.json({ error: 'Failed to connect to shipping provider' }, { status: 500 })
        }

        // 3. Create order via Shiprocket
        try {
            console.log('Sending order to Shiprocket:', order)
            const shiprocketResponse = await createShiprocketOrder(order, token)
            console.log('Shiprocket response:', shiprocketResponse)
            
            // Shiprocket response structure for adhoc order:
            // { order_id: 123, shipment_id: 456, ... }
            const shiprocketOrderId = shiprocketResponse.order_id
            const shipmentId = shiprocketResponse.shipment_id
            const status = 'processing'

            // 4. Update order in Sumabase
            console.log('Updating order in database with shipment info:', {
                shipping_tracking_id: shipmentId?.toString() || '',
                shipment_id: shipmentId?.toString() || '',
            })
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    shipping_tracking_id: shipmentId?.toString() || '', // Shiprocket tracking ID usually matches shipment_id initially
                    shipping_status: status,
                    shipment_id: shipmentId?.toString() || '',
                    status: 'processing' 
                })
                .eq('id', orderId)

            if (updateError) {
                console.error('Database Update Error after shipment creation:', updateError)
            }

            return NextResponse.json({
                success: true,
                shipmentId,
                shiprocketOrderId,
                message: 'Shipment created successfully via Shiprocket'
            })

        } catch (shipErr: any) {
            console.error('Shiprocket Order Error:', shipErr)
            return NextResponse.json({ error: shipErr.message || 'Failed to create shipment' }, { status: 500 })
        }

    } catch (err: any) {
        console.error('Shipping API Route Error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
