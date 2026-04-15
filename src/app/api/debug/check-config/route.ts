import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check current email configuration
    const config = {
      resendApiKey: process.env.RESEND_API_KEY ? 'SET' : 'NOT SET',
      resendApiKeyPlaceholder: process.env.RESEND_API_KEY?.includes('_placeholder') ? 'YES' : 'NO',
      adminEmail: process.env.ADMIN_EMAIL || 'NOT SET',
      fromEmail: process.env.NEXT_PUBLIC_FROM_EMAIL || 'NOT SET',
      recommendedAdminEmail: 'savikafoods@gmail.com'
    }

    // Test if Resend is working
    let resendTest = 'NOT TESTED'
    try {
      if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('_placeholder')) {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        
        // Just test if we can create the client (not actually send email)
        resendTest = 'CLIENT_CREATED_SUCCESSFULLY'
      } else {
        resendTest = 'NOT_CONFIGURED'
      }
    } catch (error: any) {
      resendTest = 'ERROR: ' + error.message
    }

    return NextResponse.json({
      currentConfig: config,
      resendTest,
      whatYouNeed: {
        adminEmail: 'Set ADMIN_EMAIL=savikafoods@gmail.com in your .env.local file',
        fromEmail: 'Set NEXT_PUBLIC_FROM_EMAIL=noreply@savikafoods.in in your .env.local file',
        restart: 'Restart your development server after updating .env.local'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Config check failed', 
      details: error.message 
    }, { status: 500 })
  }
}
