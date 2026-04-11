import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
    to: string
    subject: string
    html: string
}

/**
 * Sends a transactional email using Resend.
 * Falls back to simulation mode if the API key is missing or is a placeholder.
 */
export async function sendEmail({ to, subject, html, idempotencyKey }: SendEmailParams & { idempotencyKey?: string }) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('_placeholder')) {
        console.log('--- EMAIL SIMULATION (RESEND) ---')
        console.log(`To: ${to}`)
        console.log(`Subject: ${subject}`)
        if (idempotencyKey) console.log(`Idempotency Key: ${idempotencyKey}`)
        console.log('--- END SIMULATION ---')
        return { success: true, simulated: true }
    }

    // Use verified from address. Resend requires the domain to be verified.
    const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@savikafoods.in'
    const fromFormatted = `Savika Foods <${fromEmail}>`

    console.log(`[Email] Sending to: ${to}, Subject: ${subject}, From: ${fromFormatted}`)

    // Use the { data, error } pattern from the SDK
    const { data, error } = await resend.emails.send({
        from: fromFormatted,
        to,
        subject,
        html,
        ...(idempotencyKey && { idempotencyKey })
    })

    if (error) {
        console.error('[Email] Resend API Error:', JSON.stringify(error, null, 2))
        return { success: false, error }
    }

    console.log('[Email] Sent successfully. ID:', data?.id)
    return { success: true, data }
}

/**
 * High-level helper to send full order confirmations.
 */
export async function sendOrderConfirmation(order: any) {
    const { order_number, total, shipping_address, items } = order
    
    const to = order.customer_email || shipping_address?.email
    
    if (!to) {
        console.error('[Email] No customer email found for order:', order_number)
        return
    }


    const itemLines = items.map((item: any) => 
        `<tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f5;">${item.name} (${item.weight})</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f5; text-align: center;">x${item.quantity}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f5f5f5; text-align: right; font-weight: 600;">₹${item.price * item.quantity}</td>
        </tr>`
    ).join('')

    const emailHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #C17F24; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-size: 22px;">Order Confirmed ✓</h1>
                <p style="color: #999; font-size: 12px; text-transform: uppercase; margin-top: 5px;">Thank you for choosing Savika Foods</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">Hi ${shipping_address.full_name},</p>
            <p style="font-size: 16px; line-height: 1.6;">Great news! Your order <strong style="color: #C17F24;">${order_number}</strong> has been received and is currently being prepared with love.</p>
            
            <div style="background: #fafafa; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #C17F24; letter-spacing: 1px;">Order Summary</h3>
                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                    ${itemLines}
                </table>
                <div style="margin-top: 15px; padding-top: 12px; border-top: 2px solid #eee; display: flex; justify-content: space-between; font-size: 16px;">
                    <span style="font-weight: bold;">Total Amount:</span>
                    <span style="font-weight: bold; color: #C17F24;">₹${total}</span>
                </div>
            </div>

            <p style="font-size: 14px; color: #666;"><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
            <p style="font-size: 14px; color: #666;"><strong>Delivery Address:</strong> ${shipping_address.street}, ${shipping_address.city}, ${shipping_address.state} - ${shipping_address.pincode}</p>
            

            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                <p style="font-size: 14px; color: #C17F24; font-weight: bold;">Stay Pure. Stay Traditional.</p>
                <p style="font-size: 12px; color: #999;">Team Savika Foods</p>
            </div>
        </div>
    `

    // 1. Send email to Customer
    const customerResult = await sendEmail({ 
        to, 
        subject: `Order Confirmed: ${order_number}`, 
        html: emailHtml,
        idempotencyKey: `order-customer/${order_number}`
    })
    console.log('[Email] Customer notification result:', customerResult.success ? 'SUCCESS' : 'FAILED')

    // 2. Send notification to Admin
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
        console.log(`[Email] Preparing admin notification for ${adminEmail}`)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://savikafoods.in'
        const adminHtml = `
            <div style="font-family: sans-serif; padding: 25px; border: 1px solid #eee; border-radius: 12px;">
                <h2 style="color: #C17F24; margin-top: 0;">🚨 New Order Received!</h2>
                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                    <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Order Number:</td><td>${order_number}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: bold;">Customer:</td><td>${shipping_address.full_name}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${shipping_address.mobile}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${to}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: bold;">Total:</td><td style="color: #C17F24; font-weight: bold;">₹${total}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: bold;">Address:</td><td>${shipping_address.street}, ${shipping_address.city}, ${shipping_address.pincode}</td></tr>
                </table>
                <div style="margin-top: 20px;">
                    <a href="${appUrl}/admin/orders" style="display: inline-block; padding: 10px 24px; background: #C17F24; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">View in Admin Dashboard</a>
                </div>
            </div>
        `
        const adminResult = await sendEmail({
            to: adminEmail,
            subject: `🚨 New Order: ${order_number} — ₹${total}`,
            html: adminHtml,
            idempotencyKey: `order-admin/${order_number}`
        })
        console.log('[Email] Admin notification result:', adminResult.success ? 'SUCCESS' : 'FAILED')
        if (!adminResult.success) {
            console.error('[Email] Admin notification failed details:', JSON.stringify(adminResult.error, null, 2))
        }
    } else {
        console.warn('[Email] Skipping admin notification: ADMIN_EMAIL is not set in environment variables.')
    }
}
