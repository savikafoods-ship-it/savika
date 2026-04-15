import nodemailer from 'nodemailer'

interface SendEmailParams {
    to: string
    subject: string
    html: string
}

/**
 * Fallback email service using Gmail SMTP
 * Use this when Resend is not configured
 */
export async function sendGmailEmail({ to, subject, html }: SendEmailParams) {
    // Check if Gmail credentials are available
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.log('--- GMAIL EMAIL NOT CONFIGURED ---')
        console.log(`To: ${to}`)
        console.log(`Subject: ${subject}`)
        console.log('--- END SIMULATION ---')
        return { success: true, simulated: true, method: 'gmail' }
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        })

        const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || process.env.GMAIL_USER
        const fromFormatted = `Savika Foods <${fromEmail}>`

        const info = await transporter.sendMail({
            from: fromFormatted,
            to,
            subject,
            html
        })

        console.log('[Gmail] Email sent successfully. Message ID:', info.messageId)
        return { success: true, data: info, method: 'gmail' }
    } catch (error: any) {
        console.error('[Gmail] Error sending email:', error)
        return { success: false, error, method: 'gmail' }
    }
}

/**
 * Try Resend first, fallback to Gmail if Resend fails
 */
export async function sendEmailWithFallback({ to, subject, html, idempotencyKey }: SendEmailParams & { idempotencyKey?: string }) {
    // First try Resend
    try {
        const { sendEmail } = await import('./notifications')
        const result = await sendEmail({ to, subject, html, idempotencyKey })
        
        if (result.success && !result.simulated) {
            console.log('[Email] Sent successfully via Resend')
            return { ...result, method: 'resend' }
        }
    } catch (resendError) {
        console.log('[Email] Resend failed, trying Gmail fallback')
    }

    // Fallback to Gmail
    console.log('[Email] Using Gmail fallback')
    return await sendGmailEmail({ to, subject, html })
}
