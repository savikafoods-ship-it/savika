import { createAdminClient } from '@/lib/appwrite/server'
import { NextResponse } from 'next/server'
import { Query } from 'node-appwrite'

export async function GET() {
    try {
        const { databases } = await createAdminClient()
        
        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(100) // Temporary limit for export
            ]
        )
        
        const data = response.documents

        const csv = [
            ['Order ID', 'Customer Name', 'Email', 'Status', 'Total', 'Date', 'Items'].join(','),
            ...data.map(r => {
                // Determine name and email
                // Note: The original Supabase query fetched from profiles. 
                // Appwrite might store this directly on the order or need a separate fetch.
                // Assuming customerName and customerEmail exist on the document or using Fallbacks.
                const name = r.shippingAddress?.fullName || r.customerName || ''
                const email = r.customerEmail || ''
                
                return [
                    r.$id, name, email, r.status,
                    r.total, r.$createdAt, JSON.stringify(r.items || [])
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
