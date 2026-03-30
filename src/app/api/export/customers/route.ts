import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return ''
    try {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric'
        })
    } catch { return '' }
}

function escapeCSV(val: any): string {
    const str = String(val ?? '').replace(/"/g, '""')
    return `"${str}"`
}

export async function GET() {
    try {
        const supabase = await createClient()

        // Auth check: verify user is admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Check admin status
        const { data: adminCheck } = await supabase
            .from('admins')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!adminCheck) {
            return new NextResponse('Forbidden: Admin access required', { status: 403 })
        }

        // Fetch all profiles
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (profilesError) throw profilesError

        // Fetch order aggregates per user
        const { data: orders } = await supabase
            .from('orders')
            .select('user_id, total, status, created_at')

        // Build per-user order stats
        const orderStats: Record<string, { count: number; spent: number; lastDate: string | null }> = {}
        if (orders) {
            for (const o of orders) {
                if (!o.user_id) continue
                if (!orderStats[o.user_id]) {
                    orderStats[o.user_id] = { count: 0, spent: 0, lastDate: null }
                }
                orderStats[o.user_id].count++
                if (o.status !== 'cancelled' && o.status !== 'pending') {
                    orderStats[o.user_id].spent += (o.total || 0)
                }
                if (!orderStats[o.user_id].lastDate || o.created_at > orderStats[o.user_id].lastDate!) {
                    orderStats[o.user_id].lastDate = o.created_at
                }
            }
        }

        // CSV headers
        const headers = [
            'Full Name', 'Email', 'Mobile Number',
            'Address (Street)', 'Address (City)', 'Address (State)', 'Address (Pincode)',
            'Total Orders', 'Total Spent (Rs.)', 'Joined Date', 'Last Order Date'
        ]

        // Build rows
        const rows = (profiles || []).map(c => {
            const address = c.address || {}
            const stats = orderStats[c.id] || { count: 0, spent: 0, lastDate: null }
            return [
                c.full_name ?? '',
                c.email ?? '',
                c.phone ?? '',
                address.street ?? address.addressLine1 ?? '',
                address.city ?? '',
                address.state ?? '',
                address.pincode ?? '',
                stats.count,
                `Rs.${stats.spent}`,
                formatDate(c.created_at),
                formatDate(stats.lastDate),
            ]
        })

        const csvContent = [
            headers.map(h => escapeCSV(h)).join(','),
            ...rows.map(row => row.map(cell => escapeCSV(cell)).join(','))
        ].join('\n')

        const today = new Date().toISOString().slice(0, 10)

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="savika-customers-${today}.csv"`,
            }
        })
    } catch (error: any) {
        console.error('CSV export error:', error)
        return new NextResponse(`Error: ${error.message}`, { status: 500 })
    }
}
