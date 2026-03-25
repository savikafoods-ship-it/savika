import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)
            
        if (error) throw error
        
        const csv = [
            ['Name', 'Email', 'Mobile', 'Joined'].join(','),
            ...data.map(u => [
                u.full_name || '', 
                u.email || '', 
                u.phone || '',
                u.created_at
            ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
        ].join('\n')

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=savika-customers.csv'
            }
        })
    } catch (error: any) {
        return new NextResponse(`Error: ${error.message}`, { status: 500 })
    }
}
