'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faSpinner, 
    faLock, 
    faCheckCircle, 
    faArrowLeft, 
    faTruck, 
    faMapMarkerAlt, 
    faMoneyBillWave,
    faTag,
    faEnvelope,
    faCreditCard,
    faBuildingColumns,
    faPhone
} from '@fortawesome/free-solid-svg-icons'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli",
    "Daman & Diu", "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore()
    const router = useRouter()

    // Flow State
    const [step, setStep] = useState(1) // 1: Info, 2: Payment
    const [loading, setLoading] = useState(false)
    const [ready, setReady] = useState(false)
    const [error, setError] = useState('')
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online')

    // Form Data
    const [formData, setFormData] = useState({
        full_name: '',
        mobile: '',
        email: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        notes: ''
    })

    // Coupon State
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)
    const [couponLoading, setCouponLoading] = useState(false)

    // Totals
    const subtotal = total()
    const gst = Math.round(subtotal * 5 / 105)  // 5% GST included in MRP
    const discount = appliedCoupon?.discount || 0
    const delivery_fee = (subtotal - discount) >= 599 ? 0 : 25
    const finalTotal = subtotal - discount + delivery_fee

    useEffect(() => {
        if (items.length === 0 && !loading) {
            router.push('/cart')
            return
        }
        setReady(true)
    }, [items, router, loading])

    // Load Razorpay SDK
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    // Pincode Auto-fill
    useEffect(() => {
        if (formData.pincode.length === 6) {
            const fetchPincode = async () => {
                try {
                    const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
                    const data = await res.json()
                    if (data[0]?.Status === 'Success') {
                        const postOffice = data[0].PostOffice[0]
                        setFormData(prev => ({
                            ...prev,
                            city: postOffice.District,
                            state: postOffice.State
                        }))
                    }
                } catch (err) {
                    console.warn('Pincode auto-fill failed:', err)
                }
            }
            fetchPincode()
        }
    }, [formData.pincode])

    const handleApplyCoupon = async () => {
        if (!couponCode) return
        setCouponLoading(true)
        setError('')
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, subtotal })
            })
            const data = await res.json()
            if (data.valid) {
                setAppliedCoupon({ code: data.code, discount: data.discount })
            } else {
                setError(data.error || 'Invalid coupon')
            }
        } catch (err) {
            setError('Failed to validate coupon')
        } finally {
            setCouponLoading(false)
        }
    }

    const validateInfo = () => {
        const required = ['full_name', 'mobile', 'email', 'street', 'city', 'state', 'pincode']
        for (const f of required) {
            if (!(formData as any)[f]) return false
        }
        if (!/^[6-9]\d{9}$/.test(formData.mobile)) return false
        if (!/^\d{6}$/.test(formData.pincode)) return false
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return false
        return true
    }

    const handleProceedToPayment = () => {
        setError('')
        setStep(2)
    }

    const handlePlaceOrder = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payment_method: paymentMethod,
                    items: items.map(i => ({
                        product_id: i.productId,
                        name: i.product.name,
                        tagline: i.product.tagline,
                        weight: i.weight,
                        price: i.product.price,
                        quantity: i.quantity,
                        image_url: i.product.image_urls?.[0]
                    })),
                    shipping_address: {
                        full_name: formData.full_name,
                        mobile: formData.mobile,
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        landmark: formData.landmark
                    },
                    coupon_code: appliedCoupon?.code,
                    notes: formData.notes,
                    email: formData.email
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to place order')

            if (data.razorpayOrder) {
                initiateRazorpay(data.razorpayOrder, data.orderId, data.orderNumber)
            } else {
                throw new Error('Failed to initiate online payment')
            }
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    const initiateRazorpay = (rzpOrder: any, orderId: string, orderNumber: string) => {
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: rzpOrder.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: rzpOrder.currency,
            name: "Savika Foods",
            description: `Order ${orderNumber}`,
            image: "/logo.png",
            order_id: rzpOrder.id,
            handler: async function (response: any) {
                try {
                    setLoading(true)
                    const res = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    })
                    const verifyData = await res.json()
                    if (verifyData.success) {
                        clearCart()
                        router.push(`/checkout/success?orderId=${orderId}&orderNumber=${orderNumber}`)
                    } else {
                        throw new Error(verifyData.error || 'Payment verification failed')
                    }
                } catch (err: any) {
                    setError(err.message)
                    setLoading(false)
                }
            },
            prefill: {
                name: formData.full_name,
                email: formData.email,
                contact: formData.mobile
            },
            notes: {
                address: formData.street
            },
            theme: {
                color: "#C17F24"
            },
            modal: {
                ondismiss: function() {
                    setLoading(false)
                }
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    }

    if (!ready) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
            <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 animate-spin text-[#C17F24]" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#F5F0E8] pb-20">
            <div className="max-w-5xl mx-auto px-4 py-12">
                {/* Stepper */}
                <div className="flex items-center justify-center mb-12 select-none">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                            step >= 1 ? 'bg-[#C17F24] border-[#C17F24] text-white shadow-lg' : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                            {step > 1 ? <FontAwesomeIcon icon={faCheckCircle} /> : '1'}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 1 ? 'text-[#C17F24]' : 'text-gray-400'}`}>Delivery Info</span>
                    </div>
                    <div className={`w-12 h-[2px] mx-4 transition-all ${step > 1 ? 'bg-[#C17F24]' : 'bg-gray-300'}`} />
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                            step >= 2 ? 'bg-[#C17F24] border-[#C17F24] text-white shadow-lg' : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                            {step > 2 ? <FontAwesomeIcon icon={faCheckCircle} /> : '2'}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 2 ? 'text-[#C17F24]' : 'text-gray-400'}`}>Review & Pay</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10 items-start">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Delivery Info Card */}
                                <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-50">
                                    <h2 className="text-2xl font-black text-[#2E2E2E] flex items-center gap-3 uppercase tracking-tighter mb-8">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-600 w-5" />
                                        Delivery Info
                                    </h2>
                                    
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Recipient Name *</label>
                                            <input 
                                                type="text" required placeholder="Full Name"
                                                value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}
                                                className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Number *</label>
                                            <div className="relative">
                                                <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                                <input 
                                                    type="tel" required placeholder="10-digit mobile"
                                                    value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                                                    className="w-full h-12 pl-11 pr-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                                            <div className="relative">
                                                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                                <input 
                                                    type="email" required placeholder="you@example.com"
                                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                                    className="w-full h-12 pl-11 pr-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pincode *</label>
                                            <input 
                                                type="text" required placeholder="6-digit PIN"
                                                value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})}
                                                className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Landmark</label>
                                            <input 
                                                type="text" placeholder="Near temple, etc."
                                                value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})}
                                                className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Street Address *</label>
                                            <input 
                                                type="text" required placeholder="House No, Building, Street, Area"
                                                value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})}
                                                className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">City *</label>
                                            <input 
                                                type="text" required placeholder="City"
                                                value={formData.city} onChange={e => setFormData({...formData, city: e.target.value })}
                                                className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">State *</label>
                                            <select 
                                                value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}
                                                className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold"
                                            >
                                                <option value="">Select State</option>
                                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Notes (optional)</label>
                                            <textarea 
                                                placeholder="Any special instructions for your order..."
                                                value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                                                className="w-full h-20 px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold resize-none"
                                            />
                                        </div>
                                    </div>

                                    {error && <div className="mt-6 p-4 bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-tight rounded-xl border border-red-100">{error}</div>}

                                    <button 
                                        type="submit"
                                        disabled={loading || cartItems.length === 0}
                                        onClick={handleProceedToPayment}
                                        className="w-full mt-10 bg-[#C17F24] hover:bg-[#8B5E16] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-3"
                                    >
                                        Review & Choose Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Review Summary Card */}
                                <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-50">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-black text-[#2E2E2E] flex items-center gap-3 uppercase tracking-tighter">
                                            <FontAwesomeIcon icon={faTruck} className="text-amber-600 w-5" />
                                            Order Review
                                        </h2>
                                        <button onClick={() => setStep(1)} className="text-[10px] font-black text-amber-700 underline uppercase tracking-widest">
                                            Edit Details
                                        </button>
                                    </div>

                                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8">
                                        <p className="font-black text-[#2E2E2E] text-[10px] uppercase tracking-widest text-gray-400 mb-3">Deliver To:</p>
                                        <div className="text-sm text-gray-600 font-medium">
                                            <p className="font-bold text-gray-800">{formData.full_name}</p>
                                            <p>{formData.street}</p>
                                            {formData.landmark && <p className="text-gray-500">{formData.landmark}</p>}
                                            <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                                            <p className="mt-2 text-[#C17F24] font-bold text-xs"><FontAwesomeIcon icon={faPhone} className="mr-1" /> {formData.mobile}</p>
                                            <p className="text-gray-400 text-xs"><FontAwesomeIcon icon={faEnvelope} className="mr-1" /> {formData.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Payment Method</h3>
                                        
                                        {/* Unified Online Payment Option */}
                                        <div className="p-6 rounded-2xl border-2 border-amber-600 bg-amber-50 flex items-center gap-5 shadow-md">
                                            <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg">
                                                <FontAwesomeIcon icon={faCreditCard} className="text-xl" />
                                            </div>
                                            <div>
                                                <p className="font-black text-[#2E2E2E] uppercase tracking-tighter">Secure Online Payment</p>
                                                <p className="text-[11px] text-amber-700 font-bold uppercase tracking-widest mt-0.5">UPI, Cards, Netbanking & Wallets</p>
                                            </div>
                                            <div className="ml-auto flex items-center gap-2">
                                                <FontAwesomeIcon icon={faLock} className="text-[10px] text-amber-600" />
                                                <span className="text-[8px] font-black uppercase text-amber-600 tracking-widest">Encrypted</span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center px-4">
                                            Transaction secured by Razorpay. No extra charges for online payment.
                                        </p>
                                    </div>

                                    {error && <div className="mt-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">{error}</div>}

                                    <button 
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="w-full mt-10 bg-[#C17F24] hover:bg-[#8B5E16] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faLock} />}
                                        {loading ? 'Processing...' : `Pay & Place Order • ${formatCurrency(finalTotal)}`}
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setStep(1)} 
                                    className="flex items-center gap-2 text-xs font-black text-[#2E2E2E] uppercase tracking-widest hover:text-amber-700 transition-colors pl-4"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" /> Back to info
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-amber-900/5 border border-gray-100 sticky top-24">
                            <h3 className="font-black text-[#2E2E2E] text-xl uppercase tracking-tighter mb-8 text-center sm:text-left">Cart Summary</h3>
                            
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                                {items.map(item => (
                                    <div key={`${item.productId}-${item.weight}`} className="flex items-center gap-4 group">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 shadow-inner relative">
                                            <Image 
                                                src={getProductImageUrl(item.product.image_urls?.[0] || '')} 
                                                alt="" fill className="object-cover" 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-[#2E2E2E] truncate uppercase tracking-tighter">{item.product.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{item.weight} • x{item.quantity}</p>
                                        </div>
                                        <p className="text-xs font-black text-[#2E2E2E]">{formatCurrency(item.product.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
                                <div className="flex gap-2 mb-4">
                                    <div className="relative flex-1">
                                        <FontAwesomeIcon icon={faTag} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input 
                                            type="text" placeholder="Promo code"
                                            value={couponCode} onChange={e => setCouponCode(e.target.value)}
                                            className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 outline-none focus:border-amber-600 text-xs font-bold"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleApplyCoupon}
                                        disabled={couponLoading || appliedCoupon !== null}
                                        className="h-10 px-4 bg-white border border-amber-600 text-[#C17F24] rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                                    >
                                        {couponLoading ? '...' : 'Apply'}
                                    </button>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400 font-bold uppercase tracking-tighter">Items Total (MRP)</span>
                                        <span className="font-bold text-gray-800">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400 font-bold uppercase tracking-tighter">GST (5% Incl.)</span>
                                        <span className="font-bold text-gray-500">{formatCurrency(gst)}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-xs text-green-600">
                                            <span className="font-bold uppercase tracking-tighter">Discount ({appliedCoupon.code})</span>
                                            <span className="font-bold">-{formatCurrency(appliedCoupon.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400 font-bold uppercase tracking-tighter">Shipping Charges</span>
                                        <span className={`font-bold ${delivery_fee === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                            {delivery_fee === 0 ? 'FREE' : formatCurrency(delivery_fee)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-base font-black text-[#2E2E2E] pt-3 border-t border-[#e8ddd0]">
                                        <span className="uppercase tracking-tighter">Amount to Pay</span>
                                        <span className="text-[#C17F24]">{formatCurrency(finalTotal)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-green-50 p-3 rounded-xl border border-green-100 border-dashed">
                                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                                    <FontAwesomeIcon icon={faTruck} className="text-xs" />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-[10px] font-black text-green-800 uppercase tracking-widest">Est. Delivery En-route</p>
                                    <p className="text-[9px] font-bold text-green-600 uppercase">Within 2 Working Days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
