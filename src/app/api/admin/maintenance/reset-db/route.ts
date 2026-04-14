import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * DESTRUCTIVE MAINTENANCE ROUTE
 * Resets the database by clearing orders, reviews, coupons, and non-admin profiles.
 * Preserves products and categories.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authorization check: Check for a maintenance key header
    const authHeader = req.headers.get('x-maintenance-key')
    const secretKey = 'SAVIKA_RESET_2024_CONFIRM' // Hardcoded secret for this one-time operation
    
    if (authHeader !== secretKey) {
      return NextResponse.json({ error: 'Missing or invalid maintenance key' }, { status: 400 })
    }

    console.log('--- STARTING DATABASE RESET ---')
    const serviceClient = await createServiceClient()

    const results: any = {}

    // 4. Delete Order History
    // Note: order_items are stored as JSONB in the 'orders' table in this implementation
    const { count: orderCount, error: orderError } = await serviceClient
      .from('orders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (orderError) throw new Error(`Orders deletion failed: ${orderError.message}`)
    results.orders_cleared = true

    // 5. Delete Product Reviews
    const { error: reviewError } = await serviceClient
      .from('reviews')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (reviewError) throw new Error(`Reviews deletion failed: ${reviewError.message}`)
    results.reviews_cleared = true

    // 6. Delete Coupons
    const { error: couponError } = await serviceClient
      .from('coupons')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (couponError) throw new Error(`Coupons deletion failed: ${couponError.message}`)
    results.coupons_cleared = true

    // 7. Delete Non-Admin Profiles
    // We keep admins and staff to ensure the user doesn't lose access.
    // 'customer' role or null role profiles are deleted.
    const { error: profileError } = await serviceClient
      .from('profiles')
      .delete()
      .not('role', 'in', '("admin","staff")')
    
    if (profileError) throw new Error(`Profiles deletion failed: ${profileError.message}`)
    results.profiles_cleared = true

    console.log('--- DATABASE RESET COMPLETED SUCCESSFULLY ---')
    return NextResponse.json({
      success: true,
      message: 'Database reset completed successfully',
      details: results
    })

  } catch (err: any) {
    console.error('Database Reset Error:', err)
    return NextResponse.json({ 
      error: 'Reset failed', 
      message: err.message 
    }, { status: 500 })
  }
}
