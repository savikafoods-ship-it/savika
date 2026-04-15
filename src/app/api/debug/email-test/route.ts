import { NextResponse } from 'next/server'
import { sendOrderConfirmation } from '@/lib/notifications'
import { sendEmailWithFallback } from '@/lib/email-fallback'

export async function GET() {
  try {
    // Check environment variables
    const envVars = {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? 'SET' : 'NOT SET',
      RESEND_API_KEY_PLACEHOLDER: process.env.RESEND_API_KEY?.includes('_placeholder') ? 'YES' : 'NO',
      GMAIL_USER: process.env.GMAIL_USER ? 'SET' : 'NOT SET',
      GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'DEFAULT: savikafoods@gmail.com',
      NEXT_PUBLIC_FROM_EMAIL: process.env.NEXT_PUBLIC_FROM_EMAIL || 'DEFAULT: noreply@savikafoods.in',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'DEFAULT: https://savikafoods.in'
    }

    // Create a mock order for testing (using the actual customer details from the screenshot)
    const mockOrder = {
      order_number: 'TEST-001',
      total: 64,
      customer_email: 'khansh1999j@gmail.com',
      shipping_address: {
        full_name: 'Test Customer',
        street: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        mobile: '+919537788873'
      },
      items: [
        {
          name: 'Test Product',
          weight: '100g',
          quantity: 1,
          price: 64
        }
      ]
    }

    // Test 1: Original email function
    let originalResult = null
    try {
      originalResult = await sendOrderConfirmation(mockOrder)
    } catch (emailError: any) {
      originalResult = { error: emailError.message }
    }

    // Test 2: Fallback email function
    let fallbackResult = null
    try {
      const testHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #C17F24;">Email System Test</h2>
          <p>This is a test email to verify email configuration is working.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p>If you receive this email, the email system is working correctly!</p>
        </div>
      `
      
      fallbackResult = await sendEmailWithFallback({
        to: 'khansh1999j@gmail.com',
        subject: 'Test Email - Savika Foods Email System',
        html: testHtml
      })
    } catch (fallbackError: any) {
      fallbackResult = { error: fallbackError.message }
    }

    return NextResponse.json({
      environment: envVars,
      originalEmailTest: originalResult,
      fallbackEmailTest: fallbackResult,
      recommendations: {
        resend: envVars.RESEND_API_KEY === 'SET' && !envVars.RESEND_API_KEY_PLACEHOLDER ? '✅ Configured' : '❌ Not configured',
        gmail: envVars.GMAIL_USER === 'SET' && envVars.GMAIL_APP_PASSWORD === 'SET' ? '✅ Configured' : '❌ Not configured',
        recommendation: envVars.RESEND_API_KEY === 'SET' && !envVars.RESEND_API_KEY_PLACEHOLDER 
          ? 'Resend is configured and will be used' 
          : envVars.GMAIL_USER === 'SET' && envVars.GMAIL_APP_PASSWORD === 'SET'
          ? 'Gmail is configured and will be used as fallback'
          : 'Configure either Resend or Gmail for email functionality'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Debug endpoint failed', 
      details: error.message 
    }, { status: 500 })
  }
}
