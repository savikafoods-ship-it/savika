import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const serviceClient = await createServiceClient()

    // Fetch order directly — no JOIN with profiles (supports guest orders)
    const { data: order, error } = await serviceClient
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !order) {
      console.error('Order GET error:', error)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Security: admin (by email) or order owner can see order
    const primaryAdminEmail = process.env.ADMIN_EMAIL || 'savikafoods@gmail.com'
    const isAdmin = user.email === primaryAdminEmail || user.user_metadata?.role === 'admin'
    if (order.user_id && order.user_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Order GET API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Admin check — by email or role
    const primaryAdminEmail = process.env.ADMIN_EMAIL || 'savikafoods@gmail.com'
    const isAdmin = user?.email === primaryAdminEmail || user?.user_metadata?.role === 'admin'
    if (!user || !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, tracking_id, courier_name } = body

    const validStatuses = [
      'pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'
    ]

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Only update fields that actually exist in the database
    const updateData: any = { status }

    if (status === 'shipped') {
      if (tracking_id) updateData.tracking_id = tracking_id
      if (courier_name) updateData.courier_name = courier_name
    }

    // Update payment_status when delivered
    if (status === 'delivered') {
      updateData.payment_status = 'paid'
    }

    const serviceClient = await createServiceClient()
    const { data: updatedOrder, error } = await serviceClient
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Order PATCH error:', error)
      return NextResponse.json({ error: 'Failed to update order: ' + error.message }, { status: 500 })
    }

    // Send status update email to customer
    try {
      const { sendEmail } = await import('@/lib/notifications')
      if (updatedOrder.customer_email) {
        const statusMessages: Record<string, string> = {
          confirmed: 'Your order has been confirmed! We are preparing your spices.',
          processing: 'Your order is being processed and packed with care.',
          shipped: `Your order has been shipped! ${courier_name ? `Courier: ${courier_name}` : ''}`,
          out_for_delivery: 'Your order is out for delivery! Get ready to receive your spices.',
          delivered: 'Your order has been delivered! Enjoy your authentic spices.',
          cancelled: 'Your order has been cancelled. If you have any questions, please contact us.',
        }

        const message = statusMessages[status] || `Your order status has been updated to: ${status}`

        await sendEmail({
          to: updatedOrder.customer_email,
          subject: `Order ${updatedOrder.order_number} — ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 12px;">
              <h1 style="color: #C17F24; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Order Update</h1>
              <p style="font-size: 16px; color: #333; margin: 20px 0;">Hi ${updatedOrder.customer_name || 'Customer'},</p>
              <p style="font-size: 16px; color: #333;">${message}</p>
              <div style="margin: 25px 0; padding: 15px; background: #fafafa; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px;"><strong>Order:</strong> ${updatedOrder.order_number}</p>
                <p style="margin: 5px 0 0; font-size: 14px;"><strong>Status:</strong> ${status.toUpperCase()}</p>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">Team Savika Foods — Stay Pure. Stay Traditional.</p>
            </div>
          `
        })
      }
    } catch (emailErr) {
      console.error('Status update email error:', emailErr)
      // Don't fail the update if email fails
    }

    return NextResponse.json(updatedOrder)
  } catch (error: any) {
    console.error('Order PATCH API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
