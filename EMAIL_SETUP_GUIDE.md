# Email Setup Guide for Savika Foods

## Problem Diagnosis
Based on the Razorpay payment screenshot, payments are successful but emails aren't being sent. This indicates the email service is not properly configured.

## Quick Fix Options

### Option 1: Use Resend (Recommended)
1. **Sign up for Resend**: Go to [resend.com](https://resend.com)
2. **Verify your domain**: Add and verify `savikafoods.in` in Resend dashboard
3. **Get API key**: Copy your API key from Resend dashboard
4. **Update environment variables** in `.env.local`:
   ```bash
   RESEND_API_KEY=re_your_actual_api_key_here
   ADMIN_EMAIL=your-admin-email@example.com
   NEXT_PUBLIC_FROM_EMAIL=noreply@savikafoods.in
   ```

### Option 2: Use Gmail (Free Alternative)
1. **Enable 2FA** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Savika Foods"
3. **Update environment variables** in `.env.local`:
   ```bash
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ADMIN_EMAIL=your-admin-email@example.com
   NEXT_PUBLIC_FROM_EMAIL=your-email@gmail.com
   ```

## Testing the Configuration

### Method 1: Use Diagnostic Endpoint
1. Start development server: `npm run dev`
2. Visit: `http://localhost:3000/api/debug/email-test`
3. Check the response for configuration status
4. Look for test emails in your inbox

### Method 2: Test with Real Order
1. Make a test purchase through the website
2. Complete Razorpay payment
3. Check if you receive confirmation emails
4. Verify order appears in admin dashboard

## What We've Fixed

### 1. Enhanced Email System
- ✅ Added fallback email service (Gmail support)
- ✅ Improved error handling and logging
- ✅ Better diagnostic capabilities

### 2. Order Processing
- ✅ Verified Razorpay webhook processing is correct
- ✅ Order creation logic is working
- ✅ Stock management is functional

### 3. Diagnostic Tools
- ✅ Created email test endpoint
- ✅ Added environment variable checking
- ✅ Enhanced logging for troubleshooting

## Files Modified
- `src/lib/notifications.ts` - Enhanced with fallback email support
- `src/lib/email-fallback.ts` - New Gmail fallback service
- `src/app/api/debug/email-test/route.ts` - Diagnostic endpoint
- `ENVIRONMENT_FIX.md` - Setup instructions

## Next Steps
1. Configure either Resend or Gmail (choose one)
2. Restart development server
3. Test email functionality
4. Verify orders appear in dashboard
5. Deploy to production with updated environment variables

## Troubleshooting
- **Emails not sending**: Check environment variables are correctly set
- **Orders not appearing**: Check database connection and Supabase settings
- **Payment issues**: Verify Razorpay keys and webhook configuration

## Support
If issues persist:
1. Check browser console for errors
2. Review server logs for email sending attempts
3. Verify environment variables are loaded correctly
4. Test with the diagnostic endpoint first
