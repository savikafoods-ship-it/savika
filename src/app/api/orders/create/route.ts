import { NextResponse } from 'next/server'
import { createSessionClient } from '@/lib/appwrite/server'
import { ID } from 'node-appwrite'

export async function POST(req: Request) {
    try {
        const { account, databases } = await createSessionClient()
        
        // 1. Get User
        const user = await account.get()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { items, shippingAddress, subtotal, shipping, total, couponCode } = body

        // 2. Create Order Document in Appwrite
        const order = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
            ID.unique(),
            {
                userId: user.$id,
                customerEmail: user.email,
                customerName: user.name,
                items: items, // Make sure items array matches Appwrite expected attributes
                shippingAddress, 
                subtotal,
                discount: 0,
                total,
                couponCode: couponCode || null,
                status: 'processing'
            }
        )

        return NextResponse.json({
            orderId: order.$id
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
