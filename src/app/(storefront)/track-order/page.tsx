'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faSearch, faSpinner, faBox, faTruck, faCheckCircle, 
    faClock, faMapMarkerAlt, faMoneyBillWave, faEnvelope,
    faExclamationTriangle, faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

const STATUS_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: faClock },
    { key: 'confirmed', label: 'Confirmed', icon: faCheckCircle },
    { key: 'processing', label: 'Processing', icon: faBox },
    { key: 'shipped', label: 'Shipped', icon: faTruck },
    { key: 'delivered', label: 'Delivered', icon: faCheckCircle },
]

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [order, setOrder] = useState<any>(null)

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderNumber || !email) return
        
        setLoading(true)
        setError('')
        setOrder(null)

        try {
            const res = await fetch('/api/orders/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_number: orderNumber, email })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setOrder(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getStatusIndex = (status: string) => {
        if (status === 'cancelled') return -1
        return STATUS_STEPS.findIndex(s => s.key === status)
    }

    const currentStep = order ? getStatusIndex(order.status) : -1

    return (
        <div className="min-h-screen bg-[#F5F0E8] py-12 pb-24">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C17F24]/10 mb-4">
                        <FontAwesomeIcon icon={faTruck} className="w-7 h-7 text-[#C17F24]" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-[#2E2E2E] uppercase tracking-tighter">Track Your Order</h1>
                    <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">Enter your order number and the email used during checkout to see your order status.</p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleTrack} className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-gray-50 mb-8">
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Number *</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faBox} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                <input 
                                    type="text"
                                    placeholder="#82D6C5F1"
                                    value={orderNumber}
                                    onChange={e => setOrderNumber(e.target.value)}
                                    className="w-full h-12 pl-11 pr-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold uppercase"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                                <input 
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full h-12 pl-11 pr-5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#C17F24] text-sm font-bold"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !orderNumber || !email}
                        className="w-full bg-[#C17F24] hover:bg-[#8B5E16] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faSearch} />}
                        {loading ? 'Searching...' : 'Track Order'}
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 flex items-center gap-4">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 w-5 h-5 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-red-700">{error}</p>
                            <p className="text-xs text-red-400 mt-1">Double-check your order number and the email you used during checkout.</p>
                        </div>
                    </div>
                )}

                {/* Order Result */}
                {order && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Status Timeline */}
                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-gray-50">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-[#2E2E2E] uppercase tracking-tighter">Order {order.order_number}</h2>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    order.status === 'delivered' ? 'bg-green-50 text-green-600 border border-green-100' :
                                    order.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                                    'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                    {order.status}
                                </span>
                            </div>

                            {order.status === 'cancelled' ? (
                                <div className="bg-red-50 p-4 rounded-xl text-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6 text-red-400 mb-2" />
                                    <p className="text-sm font-bold text-red-700">This order has been cancelled.</p>
                                    <p className="text-xs text-red-400 mt-1">Contact us if you have questions.</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-1 sm:gap-2">
                                    {STATUS_STEPS.map((step, idx) => (
                                        <div key={step.key} className="flex-1 flex flex-col items-center text-center">
                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                                                idx <= currentStep ? 'bg-[#C17F24] text-white shadow-lg' : 'bg-gray-100 text-gray-300'
                                            }`}>
                                                <FontAwesomeIcon icon={step.icon} className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </div>
                                            <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-wide ${
                                                idx <= currentStep ? 'text-[#C17F24]' : 'text-gray-300'
                                            }`}>
                                                {step.label}
                                            </span>
                                            {idx < STATUS_STEPS.length - 1 && (
                                                <div className={`hidden sm:block absolute mt-4 ml-[100%] w-full h-[2px] ${
                                                    idx < currentStep ? 'bg-[#C17F24]' : 'bg-gray-200'
                                                }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Tracking Info */}
                            {order.tracking_id && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Tracking Info</p>
                                    <p className="text-sm font-bold text-blue-800">{order.courier_name}: {order.tracking_id}</p>
                                </div>
                            )}
                        </div>

                        {/* Items */}
                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-gray-50">
                            <h3 className="text-sm font-black text-[#2E2E2E] uppercase tracking-widest mb-4">Items Ordered</h3>
                            <div className="space-y-3">
                                {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div>
                                            <p className="text-sm font-bold text-[#2E2E2E]">{item.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{item.weight} × {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-[#2E2E2E]">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                                <span className="font-black text-[#2E2E2E] uppercase tracking-tighter">Total</span>
                                <span className="font-black text-[#C17F24] text-lg">{formatCurrency(order.total)}</span>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-gray-50">
                            <h3 className="text-sm font-black text-[#2E2E2E] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#C17F24] w-3.5" /> Delivery Address
                            </h3>
                            <div className="text-sm text-gray-600">
                                <p className="font-bold text-gray-800">{order.shipping_address?.full_name}</p>
                                <p>{order.shipping_address?.street}</p>
                                <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
                                <p className="mt-2 text-[#C17F24] font-bold text-xs">{order.shipping_address?.mobile}</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-black text-[#C17F24] uppercase tracking-widest hover:text-[#8B5E16] transition-colors">
                                Continue Shopping <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
