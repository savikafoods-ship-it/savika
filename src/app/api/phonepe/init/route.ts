import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

// PhonePe Sandbox/Prod endpoints
const PHONEPE_URL = process.env.PHONEPE_ENV === 'PROD' 
    ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'

export async function POST(request: Request) {
    return NextResponse.json({ 
        message: 'PhonePe integration is currently disabled for testing.',
        success: true,
        // Mocking a direct success for development
        paymentUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`
    })
    /* 
    try {
        const supabase = await createClient()
        // ... rest of the code ...
    } catch (error: any) {
        // ...
    }
    */
}
