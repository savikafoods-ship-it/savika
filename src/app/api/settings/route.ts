import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')

    if (error) throw error

    // Convert array to object
    const settings = data.reduce((acc: any, item: any) => {
      acc[item.key] = item.value
      return acc
    }, {})

    return NextResponse.json(settings)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { key, value } = await request.json()
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
