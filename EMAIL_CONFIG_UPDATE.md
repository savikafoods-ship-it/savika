# Email Configuration Update

## Correct Email Settings for Resend

Based on your Resend dashboard showing `updates.savikafoods.in` is verified, update your `.env.local` file with:

```bash
# Email Configuration
ADMIN_EMAIL=savikafoods@gmail.com
NEXT_PUBLIC_FROM_EMAIL=noreply@updates.savikafoods.in
```

## Why This Works

✅ **Domain Verified**: `updates.savikafoods.in` is verified in Resend
✅ **Proper From Address**: `noreply@updates.savikafoods.in` will be recognized
✅ **Admin Notifications**: `savikafoods@gmail.com` will receive order alerts
✅ **Customer Emails**: Will come from verified domain

## After Update

1. Restart your development server: `npm run dev`
2. Test payment flow
3. Check both customer inbox and `savikafoods@gmail.com`

## Expected Results

- Customers receive emails from `noreply@updates.savikafoods.in`
- Admin receives notifications at `savikafoods@gmail.com`
- No more "rzp_payment_id is not defined" errors
- Orders appear in admin dashboard

## Verification

Test with: `http://localhost:3000/api/debug/check-config`
