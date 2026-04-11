/**
 * Shiprocket API Client Helper
 */

const SHIPROCKET_AUTH_URL = 'https://apiv2.shiprocket.in/v1/external/auth/login'
const SHIPROCKET_CREATE_ORDER_URL = 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc'

export async function getShiprocketAuthToken() {
    const email = process.env.SHIPROCKET_EMAIL
    const password = process.env.SHIPROCKET_PASSWORD

    if (!email || !password) {
        throw new Error('Shiprocket credentials not configured in environment variables')
    }

    const res = await fetch(SHIPROCKET_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
        throw new Error('Failed to authenticate with Shiprocket. Please check your Email and Password.')
    }

    const data = await res.json()
    return data.token
}

export function parseWeight(weightStr: string): number {
    // Normalizes weight to kg for Shiprocket
    const clean = weightStr.toLowerCase().trim()
    const num = parseFloat(clean.replace(/[^\d.]/g, ''))
    
    if (clean.includes('kg')) return num
    if (clean.includes('g')) return num / 1000
    
    return 0.1 // Default 100g
}

export async function createShiprocketOrder(orderData: any, token: string) {
    // Current date in YYYY-MM-DD format
    const orderDate = new Date().toISOString().split('T')[0]

    // Map Savika order data to Shiprocket format
    const payload = {
        order_id: orderData.order_number.replace('#', 'SAV-'),
        order_date: orderDate,
        pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
        billing_customer_name: orderData.shipping_address.full_name.split(' ')[0],
        billing_last_name: orderData.shipping_address.full_name.split(' ').slice(1).join(' ') || '.',
        billing_address: orderData.shipping_address.street,
        billing_city: orderData.shipping_address.city,
        billing_pincode: orderData.shipping_address.pincode,
        billing_state: orderData.shipping_address.state,
        billing_country: 'India',
        billing_email: orderData.customer_email,
        billing_phone: orderData.shipping_address.mobile,
        shipping_is_billing: true,
        order_items: orderData.items.map((item: any) => ({
            name: item.name,
            sku: item.product_id,
            units: item.quantity,
            selling_price: item.price,
            discount: 0,
            tax: 0,
            hsn: 0
        })),
        payment_method: orderData.payment_method === 'cod' ? 'COD' : 'Prepaid',
        shipping_charges: orderData.delivery_fee || 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: orderData.discount || 0,
        sub_total: orderData.subtotal,
        length: 10,  // Standard dimensions
        breadth: 10,
        height: 10,
        weight: orderData.items.reduce((acc: number, item: any) => acc + (parseWeight(item.weight) * item.quantity), 0)
    }

    const res = await fetch(SHIPROCKET_CREATE_ORDER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || JSON.stringify(errorData) || 'Failed to create order on Shiprocket')
    }

    return await res.json()
}
