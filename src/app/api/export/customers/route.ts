import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
    const { data } = await supabaseAdmin
        .from('profiles')
        .select('full_name, email, mobile, address, created_at')
        .order('created_at', { ascending: false })
        
    const csv = [
        ['Name', 'Email', 'Mobile', 'Address', 'Joined'].join(','),
        ...(data || []).map(r => [
            r.full_name ?? '', r.email ?? '', r.mobile ?? '',
            JSON.stringify(r.address ?? {}), r.created_at
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=savika-customers.csv'
        }
    })
}
