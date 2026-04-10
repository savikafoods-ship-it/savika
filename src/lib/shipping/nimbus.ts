/**
 * NimbusPost API Client Helper
 */

// Constants from NimbusPost API (example endpoints)
const NIMBUS_AUTH_URL = 'https://ship.nimbuspost.com/api/auth/login'
const NIMBUS_CREATE_SHIPMENT_URL = 'https://ship.nimbuspost.com/api/shipping/create-shipment'

export async function getNimbusAuthToken() {
    const email = process.env.NIMBUSPOST_API_EMAIL
    const password = process.env.NIMBUSPOST_API_PASSWORD

    if (!email || !password) {
        throw new Error('NimbusPost credentials not configured in environment variables')
    }

    const res = await fetch(NIMBUS_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
        throw new Error('Failed to authenticate with NimbusPost')
    }

    const data = await res.json()
    return data.token // Adjust based on actual API response structure
}

export function parseWeight(weightStr: string): number {
    // Normalizes weight to kg
    const clean = weightStr.toLowerCase().trim()
    const num = parseFloat(clean.replace(/[^\d.]/g, ''))
    
    if (clean.includes('kg')) return num
    if (clean.includes('g')) return num / 1000
    
    return 0.1 // Default 100g
}

export async function createNimbusShipment(orderData: any, token: string) {
    // Map Savika order data to NimbusPost format
    // This is a representative mapping based on common aggregator APIs
    const payload = {
        order_number: orderData.order_number,
        shipping_address: {
            first_name: orderData.shipping_address.full_name.split(' ')[0],
            last_name: orderData.shipping_address.full_name.split(' ').slice(1).join(' ') || '.',
            address: orderData.shipping_address.street,
            city: orderData.shipping_address.city,
            state: orderData.shipping_address.state,
            pincode: orderData.shipping_address.pincode,
            phone: orderData.shipping_address.mobile,
            email: orderData.customer_email
        },
        order_details: {
            payment_type: orderData.payment_method === 'cod' ? 'cod' : 'prepaid',
            total_amount: orderData.total,
            cod_amount: orderData.payment_method === 'cod' ? orderData.total : 0,
            weight: orderData.items.reduce((acc: number, item: any) => acc + (parseWeight(item.weight) * item.quantity), 0),
            items: orderData.items.map((item: any) => ({
                name: item.name,
                qty: item.quantity,
                price: item.price,
                sku: item.product_id
            }))
        }
        // Additional NimbusPost specific fields (pincode, warehouse, etc) go here
    }

    const res = await fetch(NIMBUS_CREATE_SHIPMENT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create shipment on NimbusPost')
    }

    return await res.json()
}
