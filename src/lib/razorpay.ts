import Razorpay from 'razorpay'

const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
const key_secret = process.env.RAZORPAY_KEY_SECRET

if (!key_id) {
  throw new Error('RAZORPAY_KEY_ID is not defined')
}

if (!key_secret) {
  throw new Error('RAZORPAY_KEY_SECRET is not defined')
}

export const razorpay = new Razorpay({
  key_id,
  key_secret,
})
