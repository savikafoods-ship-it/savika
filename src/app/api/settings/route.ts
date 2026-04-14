import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')

    if (error) throw error

    // Convert array to object, handling both 'id' and potential 'key' column
    const settings = data.reduce((acc: any, item: any) => {
      const id = item.id || item.key
      acc[id] = item.value
      return acc
    }, {})

    // Compatibility layer: Map old IDs to the names expected by the new frontend
    const mappedSettings = {
      ...settings,
      store_profile: settings.store_profile || (settings.general ? {
          name: settings.general.storeName,
          email: settings.general.supportEmail,
          phone: settings.general.supportPhone
      } : null),
      shipping_config: settings.shipping_config || (settings.shipping ? {
          standard_rate: settings.shipping.standardShippingRate,
          free_threshold: settings.shipping.freeShippingThreshold
      } : null),
      tax_config: settings.tax_config || (settings.tax ? {
          gst_rate: settings.tax.defaultGstRate?.toString(),
          include_tax: settings.tax.pricesIncludeTax
      } : null)
    }

    return NextResponse.json(mappedSettings)
  } catch (error: any) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Admin check
    const primaryAdminEmail = process.env.ADMIN_EMAIL || 'savikafoods@gmail.com'
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const isAdmin = user.email === primaryAdminEmail || profile?.role === 'admin' || profile?.role === 'staff'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { key, value } = await request.json()
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    // 3. Update using service client to bypass RLS
    // Use 'id' column as confirmed by schema inspection
    const serviceClient = await createServiceClient()
    const { error } = await serviceClient
      .from('site_settings')
      .upsert({ id: key, value, updated_at: new Date().toISOString() }, { onConflict: 'id' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Settings PATCH error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
