import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { items } = await request.json()

        // Sync to database
        const { error } = await supabase
            .from('carts')
            .upsert({
                user_id: user.id,
                items: items,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Cart sync error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: cart, error } = await supabase
            .from('carts')
            .select('items')
            .eq('user_id', user.id)
            .single()

        if (error && error.code !== 'PGRST116') throw error // Ignore if no cart found

        return NextResponse.json({ items: cart?.items || [] })
    } catch (error: any) {
        console.error('Cart fetch error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
