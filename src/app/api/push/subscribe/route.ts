import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
    try {
        const subscription = await req.json()
        await supabaseAdmin.from('push_subscriptions').insert({ subscription })
        return NextResponse.json({ ok: true })
    } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
