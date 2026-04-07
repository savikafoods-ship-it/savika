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
export async function sendEmail({ to, subject, html }: SendEmailParams) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('_placeholder')) {
        console.log('--- EMAIL SIMULATION (RESEND) ---')
        console.log(`To: ${to}`)
        console.log(`Subject: ${subject}`)
        console.log('--- END SIMULATION ---')
        return { success: true, simulated: true }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.NEXT_PUBLIC_FROM_EMAIL || 'Savika Foods <noreply@savikafoods.in>',
            to,
            subject,
            html,
        })

        if (error) {
            console.error('Resend API Error:', error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Email caught an error:', error)
        return { success: false, error }
    }
}

/**
 * High-level helper to send full order confirmations.
 */
export async function sendOrderConfirmation(order: any) {
    const { order_number, total, shipping_address, items } = order
    
    // We assume the email is captured in the shipping address or profile
    const to = order.customer_email || shipping_address.email || 'customer@example.com' 

    const itemLines = items.map((item: any) => 
        `<li>${item.name} (${item.weight}) x ${item.quantity} - ₹${item.price * item.quantity}</li>`
    ).join('')

    const emailHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 16px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #C17F24; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Order Confirmed</h1>
                <p style="color: #999; font-size: 12px; text-transform: uppercase;">Thank you for choosing Savika</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">Hi ${shipping_address.full_name},</p>
            <p style="font-size: 16px; line-height: 1.6;">Great news! Your order <strong>${order_number}</strong> has been received and is currently being prepared with love.</p>
            
            <div style="background: #fafafa; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #C17F24;">Order Summary</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${itemLines}
                </ul>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; display: flex; justify-content: space-between;">
                    <span style="font-weight: bold;">Total Amount:</span>
                    <span style="font-weight: bold; color: #C17F24;">₹${total}</span>
                </div>
            </div>

            <p style="font-size: 14px; color: #666;"><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
            <p style="font-size: 14px; color: #666;"><strong>Delivery Address:</strong> ${shipping_address.street}, ${shipping_address.city}</p>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                <p style="font-size: 14px; color: #C17F24; font-weight: bold;">Stay Pure. Stay Traditional.</p>
                <p style="font-size: 12px; color: #999;">Team Savika Foods</p>
            </div>
        </div>
    `

    // 1. Send email to Customer
    await sendEmail({ 
        to, 
        subject: `Order Confirmed: ${order_number}`, 
        html: emailHtml 
    })

    // 2. Send notification to Admin (savikafoods@gmail.com)
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
        const adminHtml = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #C17F24;">New Order Received!</h2>
                <p><strong>Order Number:</strong> ${order_number}</p>
                <p><strong>Customer:</strong> ${shipping_address.full_name} (${shipping_address.mobile})</p>
                <p><strong>Total:</strong> ₹${total}</p>
                <p><strong>Items:</strong></p>
                <ul>${itemLines}</ul>
                <p><strong>Delivery Address:</strong> ${shipping_address.street}, ${shipping_address.city}, ${shipping_address.pincode}</p>
                <hr />
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders" style="display: inline-block; padding: 10px 20px; background: #C17F24; color: #white; text-decoration: none; border-radius: 5px;">View in Admin Dashboard</a>
            </div>
        `
        await sendEmail({
            to: adminEmail,
            subject: `🚨 New Order: ${order_number} - ₹${total}`,
            html: adminHtml
        })
    }
}
