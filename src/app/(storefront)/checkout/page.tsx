'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore()
    const router = useRouter()
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [profile, setProfile] = useState<any>(null)
    
    const [address, setAddress] = useState({
        line1: '',
        city: '',
        state: '',
        pincode: ''
    })

    const cartTotal = total()
    const shipping = cartTotal >= 599 ? 0 : 60
    const finalAmount = cartTotal + shipping

    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart')
            return
        }
        const loadProfile = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            
            if (!user) {
                router.push('/auth/login?next=/checkout')
                return
            }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
                
            if (profileData) {
                setProfile(profileData)
                if (profileData.address) {
                    setAddress(profileData.address as any)
                }
            }
        }
        loadProfile()
    }, [items, router])

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // 1. Create order on server
            const res = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shipping_address: address,
                    subtotal: cartTotal,
                    shipping,
                    total: finalAmount
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to create order')

            clearCart()
            router.push(`/account/orders?success=true&order=${data.orderId}`)
            
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    if (!profile) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div></div>

    return (
        <div className="min-h-screen bg-[#F9F4EE]">
            <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
                
                {/* Shipping Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-bold font-[var(--font-playfair)] text-[#2E2E2E] mb-6">Shipping Details</h2>
                    
                    <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Street Address</label>
                            <input type="text" required value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C47F17]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">City</label>
                                <input type="text" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C47F17]" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">State</label>
                                <input type="text" required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C47F17]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">PIN Code</label>
                            <input type="text" required value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C47F17]" />
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24 h-fit">
                    <h2 className="text-2xl font-bold font-[var(--font-playfair)] text-[#2E2E2E] mb-6">Order Summary</h2>
                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                        {items.map(item => (
                            <div key={item.product_id} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#F9F4EE] rounded-lg relative overflow-hidden shrink-0">
                                    {item.product.images?.[0] && <Image src={item.product.images[0]} fill alt="" className="object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate text-[#2E2E2E]">{item.product.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <span className="font-bold text-sm text-[#2E2E2E]">{formatCurrency((item.product.sale_price ?? item.product.price) * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-[#C47F17] pt-2">
                            <span>Total</span>
                            <span>{formatCurrency(finalAmount)}</span>
                        </div>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl">{error}</div>}

                    <button 
                        type="submit" 
                        form="checkout-form"
                        disabled={loading}
                        className="w-full bg-[#C47F17] hover:bg-[#a86c12] text-white py-4 rounded-xl font-bold transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-lock" />}
                        {loading ? 'Processing...' : `Pay ${formatCurrency(finalAmount)}`}
                    </button>
                </div>

            </div>
        </div>
    )
}
