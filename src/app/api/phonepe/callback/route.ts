import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/appwrite/server'

export async function POST(req: Request) {
    try {
        const bodyText = await req.text()
        const xVerify = req.headers.get('x-verify')

        // A realistic callback has base64 encoded 'response' string in JSON body
        let parsedBody
        try {
            parsedBody = JSON.parse(bodyText)
        } catch {
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const base64Response = parsedBody.response
        if (!base64Response) {
            return NextResponse.json({ error: 'No response in payload' }, { status: 400 })
        }

        const saltKey = process.env.PHONEPE_SALT_KEY!
        const saltIndex = process.env.PHONEPE_SALT_INDEX || '1'

        // Verify Checksum: SHA256(base64Response + saltKey) + ### + saltIndex
        const expectedHash = crypto.createHash('sha256').update(base64Response + saltKey).digest('hex')
        const expectedXVerify = `${expectedHash}###${saltIndex}`

        if (xVerify !== expectedXVerify) {
            console.error('PhonePe Webhook verification failed.', { expected: expectedXVerify, actual: xVerify })
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        // Decode payload
        const decodedString = Buffer.from(base64Response, 'base64').toString('utf-8')
        const data = JSON.parse(decodedString)

        // data.code == 'PAYMENT_SUCCESS'
        const isSuccess = data.code === 'PAYMENT_SUCCESS'
        const transactionId = data.data.merchantTransactionId

        // Update DB
        const { databases } = createAdminClient()
        
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
            transactionId,
            {
                paymentStatus: isSuccess ? 'paid' : 'failed',
                status: isSuccess ? 'processing' : 'pending', // Advance status if paid
                paymentId: data.data.transactionId || null,
                updatedAt: new Date().toISOString()
            }
        )

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('PhonePe Callback Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
