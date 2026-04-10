import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getNimbusAuthToken, createNimbusShipment } from '@/lib/shipping/nimbus'

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

        // 2. Auth with NimbusPost
        let token
        try {
            token = await getNimbusAuthToken()
        } catch (authErr: any) {
            console.error('Nimbus Auth Error:', authErr)
            return NextResponse.json({ error: 'Failed to connect to shipping provider' }, { status: 500 })
        }

        // 3. Create shipment via NimbusPost
        try {
            const shipmentResponse = await createNimbusShipment(order, token)
            
            // Expected response structure: { data: { awb: '...', label: '...', status: '...' } }
            // Adjust based on NimbusPost actual payload behavior
            const trackingId = shipmentResponse.data?.awb || shipmentResponse.data?.tracking_id
            const labelUrl = shipmentResponse.data?.label || shipmentResponse.data?.label_url
            const status = shipmentResponse.data?.status || 'shipped'

            // 4. Update order in Supabase
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    shipping_tracking_id: trackingId,
                    shipping_label_url: labelUrl,
                    shipping_status: status,
                    status: 'shipped' // Update order status to shipped
                })
                .eq('id', orderId)

            if (updateError) {
                console.error('Database Update Error after shipment creation:', updateError)
                // We still return success since the shipment was created on Nimbus
            }

            return NextResponse.json({
                success: true,
                trackingId,
                labelUrl,
                message: 'Shipment created successfully via NimbusPost'
            })

        } catch (shipErr: any) {
            console.error('Nimbus Shipment Error:', shipErr)
            return NextResponse.json({ error: shipErr.message || 'Failed to create shipment' }, { status: 500 })
        }

    } catch (err: any) {
        console.error('Shipping API Route Error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
