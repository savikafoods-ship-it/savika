import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
    const { data } = await supabaseAdmin
        .from('orders')
        .select('id, user_id, items, subtotal, total, status, created_at, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        
    const csv = [
        ['Order ID', 'Customer Name', 'Email', 'Status', 'Total', 'Date', 'Items'].join(','),
        ...(data || []).map(r => [
            r.id, r.profiles?.full_name ?? '', r.profiles?.email ?? '', r.status,
            r.total, r.created_at, JSON.stringify(r.items)
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=savika-orders.csv'
        }
    })
}
