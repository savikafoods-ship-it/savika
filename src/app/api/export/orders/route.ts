import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)
            
        if (error) throw error
        
        const csv = [
            ['Order ID', 'Customer Name', 'Email', 'Status', 'Total', 'Date', 'Items'].join(','),
            ...data.map(r => {
                // Determine name and email
                // Note: The original query fetched from profiles. 
                // Assuming customerName and customerEmail exist on the document or using Fallbacks.
                const name = r.shipping_address?.fullName || r.customer_name || ''
                const email = r.customer_email || ''
                
                return [
                    r.id, name, email, r.status,
                    r.total, r.created_at, JSON.stringify(r.items || [])
                ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
            })
        ].join('\n')

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=savika-orders.csv'
            }
        })
    } catch (error: any) {
        return new NextResponse(`Error: ${error.message}`, { status: 500 })
    }
}
