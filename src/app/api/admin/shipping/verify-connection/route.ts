import { getShiprocketAuthToken } from '@/lib/shipping/shiprocket'
import { NextResponse } from 'next/server'
export async function GET() {
    try {
        // Attempt to get a token. This verifies if credentials are correct.
        const token = await getShiprocketAuthToken()
        
        if (token) {
            return NextResponse.json({ 
                success: true, 
                message: 'Successfully connected to Shiprocket!' 
            })
        }
        
        throw new Error('Authentication failed: No token returned')
        
    } catch (error: any) {
        console.error('Shiprocket Connection Error:', error)
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Failed to connect to Shiprocket' 
        }, { status: 401 })
    }
}
