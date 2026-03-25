import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_content')
      .select('id, value')
      .limit(25)

    if (error) throw error

    const result: Record<string, any> = {}
    data?.forEach(doc => {
      result[doc.id] = doc.value
    })

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch content'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    const { key, value } = body as { key: string; value: object }

    if (!key || !value) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
    }

    const allowedKeys = ['promo_card_1', 'promo_card_2', 'announcement_bar']
    if (!allowedKeys.includes(key)) {
      return NextResponse.json({ error: 'Invalid content key' }, { status: 400 })
    }

    const { error } = await supabase
      .from('site_content')
      .upsert({
        id: key,
        value: value,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error

    return NextResponse.json({ success: true, key, updatedAt: new Date().toISOString() })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update content'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
