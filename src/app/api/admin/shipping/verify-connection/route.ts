import { NextResponse } from 'next/server'
import { getNimbusAuthToken } from '@/lib/shipping/nimbus'

export async function GET() {
    try {
        // Attempt to get a token. This verifies if credentials are correct.
        const token = await getNimbusAuthToken()
        
        if (token) {
            return NextResponse.json({ 
                success: true, 
                message: 'Successfully connected to NimbusPost!' 
            })
        }
        
        throw new Error('Authentication failed: No token returned')
        
    } catch (error: any) {
        console.error('NimbusPost Connection Error:', error)
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'Failed to connect to NimbusPost' 
        }, { status: 401 })
    }
}
