import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { twilioClient } from '@/lib/twilio'
import { webpush } from '@/lib/webpush'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
 const { orderId, total, userName, items } = await req.json()
 const msg = `New Savika Order #${orderId.slice(0,8)} | Rs.${total} | ${userName}`
 
 await Promise.allSettled([
 // 1. Email
 resend.emails.send({
 from: process.env.RESEND_FROM_EMAIL!,
 to: process.env.ADMIN_EMAIL!,
 subject: `New Order - Rs.${total} from ${userName}`,
 html: `<h2>${msg}</h2><p>Items: ${JSON.stringify(items)}</p>`,
 }),
 // 2. WhatsApp
 twilioClient.messages.create({
 from: process.env.TWILIO_WHATSAPP_FROM!,
 to: process.env.TWILIO_ADMIN_WHATSAPP_TO!,
 body: msg,
 }),
 // 3. Browser push
 supabaseAdmin.from('push_subscriptions').select('subscription').then(({ data }) =>
 Promise.allSettled(
 (data || []).map(({ subscription }) =>
 webpush.sendNotification(subscription as any,
 JSON.stringify({ title: 'New Savika Order!', body: msg }))
 )
 )
 ),
 ])
 return NextResponse.json({ ok: true })
}
