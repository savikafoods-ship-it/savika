import { createAdminClient } from '@/lib/appwrite/server'
import { NextResponse } from 'next/server'
import { Query } from 'node-appwrite'

export async function GET() {
    try {
        const { users } = await createAdminClient()
        
        const response = await users.list([
            Query.orderDesc('$createdAt'),
            Query.limit(100) // Temporary limit
        ])
        
        const csv = [
            ['Name', 'Email', 'Mobile', 'Joined'].join(','),
            ...response.users.map(u => [
                u.name || '', 
                u.email || '', 
                u.phone || '',
                u.$createdAt
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
