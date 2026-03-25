import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
    return NextResponse.json({ message: 'PhonePe Callback disabled.' })
    /*
    try {
        const bodyText = await req.text()
        // ... rest of the code ...
    } catch (error: any) {
        // ...
    }
    */
}
