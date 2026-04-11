import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Auth check — admin only
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const primaryAdminEmail = process.env.ADMIN_EMAIL || 'savikafoods@gmail.com'
    const isAdmin = user?.email === primaryAdminEmail || user?.user_metadata?.role === 'admin'
    
    if (!user || !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serviceClient = await createServiceClient()

    // Fetch all orders with customer info
    const { data: orders, error } = await serviceClient
      .from('orders')
      .select('customer_email, customer_name, shipping_address, total, total_amount, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Customers fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Aggregate unique customers by email
    const customerMap = new Map<string, {
      email: string
      name: string
      mobile: string
      total_orders: number
      total_spent: number
      last_order_at: string
    }>()

    for (const order of (orders || [])) {
      const email = order.customer_email?.toLowerCase()
      if (!email) continue

      const existing = customerMap.get(email)
      const orderTotal = order.total || order.total_amount || 0

      if (existing) {
        existing.total_orders += 1
        existing.total_spent += orderTotal
        // Keep the most recent order date
        if (order.created_at > existing.last_order_at) {
          existing.last_order_at = order.created_at
          // Update name/mobile if newer order has them
          if (order.customer_name) existing.name = order.customer_name
          if (order.shipping_address?.mobile) existing.mobile = order.shipping_address.mobile
        }
      } else {
        customerMap.set(email, {
          email,
          name: order.customer_name || order.shipping_address?.full_name || 'Guest',
          mobile: order.shipping_address?.mobile || '',
          total_orders: 1,
          total_spent: orderTotal,
          last_order_at: order.created_at,
        })
      }
    }

    // Sort by total_spent descending
    const customers = Array.from(customerMap.values())
      .sort((a, b) => b.total_spent - a.total_spent)

    return NextResponse.json(customers)
  } catch (error: any) {
    console.error('Admin customers API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
