import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createSessionClient } from '@/lib/appwrite/server'

// PhonePe Sandbox/Prod endpoints
const PHONEPE_URL = process.env.PHONEPE_ENV === 'PROD' 
    ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'

export async function POST(request: Request) {
    try {
        const { account } = await createSessionClient()
        const user = await account.get()

        const body = await request.json()
        const { amount, orderId, mobileNumber } = body

        if (!amount || !orderId) {
            return NextResponse.json({ error: 'Missing amount or orderId' }, { status: 400 })
        }

        const merchantId = process.env.PHONEPE_MERCHANT_ID!
        const saltKey = process.env.PHONEPE_SALT_KEY!
        const saltIndex = process.env.PHONEPE_SALT_INDEX || '1'
        
        // Define payload based on PhonePe PG docs
        const payload = {
            merchantId,
            merchantTransactionId: orderId,
            merchantUserId: user.$id,
            amount: Math.round(amount * 100), // in paise
            redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?id=${orderId}`,
            redirectMode: 'POST',
            callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/phonepe/callback`,
            mobileNumber: mobileNumber || user.phone || '9999999999',
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        }

        // 1. Base64 Encode Payload
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')

        // 2. X-VERIFY Header: SHA256(base64Payload + "/pg/v1/pay" + saltKey) + ### + saltIndex
        const stringToHash = base64Payload + '/pg/v1/pay' + saltKey
        const hash = crypto.createHash('sha256').update(stringToHash).digest('hex')
        const xVerify = `${hash}###${saltIndex}`

        // 3. Make server-to-server call to PhonePe
        const response = await fetch(PHONEPE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': xVerify
            },
            body: JSON.stringify({ request: base64Payload })
        })

        const data = await response.json()

        if (data.success) {
            // Return URL for client to redirect to PhonePe gateway
            return NextResponse.json({ 
                success: true, 
                paymentUrl: data.data.instrumentResponse.redirectInfo.url 
            })
        } else {
            console.error('PhonePe Error:', data)
            return NextResponse.json({ error: data.message || 'Payment initiation failed' }, { status: 400 })
        }

    } catch (error: any) {
        console.error('PhonePe Init Route Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
