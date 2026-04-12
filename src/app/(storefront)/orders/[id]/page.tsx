'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faArrowLeft, 
    faTruck, 
    faCheckCircle, 
    faBoxOpen, 
    faHome,
    faClock,
    faSpinner,
    faLocationDot,
    faCircleInfo,
    faIndianRupeeSign,
    faCopy
} from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

export default function OrderTrackingPage() {
    const { id } = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${id}`)
                if (!res.ok) throw new Error('Order not found or unauthorized')
                const data = await res.json()
                setOrder(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [id])

    const copyOrderCode = () => {
        if (order?.order_number) {
            navigator.clipboard.writeText(order.order_number)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (loading) return (
            <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 animate-spin text-[#C17F24]" />
            </div>
    )

    if (error || !order) return (
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
            <div className="text-center p-10 bg-white rounded-3xl shadow-xl max-w-md">
                <h2 className="text-2xl font-black text-[#2E2E2E] mb-4 uppercase tracking-tighter">Oops! {error}</h2>
                <Link href="/shop" className="inline-block bg-[#C17F24] text-white px-8 py-3 rounded-xl font-bold transition-all">
                    Return to Shop
                </Link>
            </div>
        </div>
    )

    const etaDate = new Date(order.created_at)
    etaDate.setDate(etaDate.getDate() + 2)
    const etaString = etaDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

    const gst = order.gst || Math.round((order.subtotal || 0) * 5 / 105)



    return (
        <div className="min-h-screen bg-[#F5F0E8] pb-24 pt-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-amber-700 transition shadow-sm border border-gray-100">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-black text-[#2E2E2E] tracking-tighter uppercase">Order Details</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-sm font-black text-amber-700 tracking-wider">{order.order_number}</p>
                            <button onClick={copyOrderCode} className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>
                                {copied ? 'Copied!' : <><FontAwesomeIcon icon={faCopy} className="mr-1" />Copy</>}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-xl mx-auto items-start">

                    {/* Order Details */}
                    <div className="space-y-6">
                        {/* Items */}
                        <div className="bg-[#18181b] rounded-[2rem] p-8 shadow-2xl text-white border border-white/5">
                            <h3 className="font-black text-xs uppercase tracking-[0.3em] mb-6 text-amber-500 flex items-center gap-2">
                                <FontAwesomeIcon icon={faBoxOpen} />
                                Order Details
                            </h3>

                            <div className="space-y-5 mb-8">
                                {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative">
                                            <Image src={getProductImageUrl(item.image_url)} alt="" fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black truncate uppercase tracking-tighter">{item.name}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase">{item.weight} • x{item.quantity}</p>
                                        </div>
                                        <p className="text-xs font-black">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Price Bifurcation */}
                            <div className="pt-6 border-t border-white/5 space-y-3">
                                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                                    <FontAwesomeIcon icon={faIndianRupeeSign} className="text-amber-500" />
                                    Price Breakdown
                                </h4>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400 font-bold">Items Total (MRP)</span>
                                    <span className="text-white font-bold">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400 font-bold">GST (5% Incl.)</span>
                                    <span className="text-gray-500 font-bold">{formatCurrency(gst)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-xs text-green-500">
                                        <span className="font-bold">Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                                        <span className="font-bold">-{formatCurrency(order.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400 font-bold">Shipping Charges</span>
                                    <span className={`font-bold ${order.delivery_fee === 0 ? 'text-green-500' : 'text-white'}`}>
                                        {order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base font-black pt-3 border-t border-white/10">
                                    <span className="uppercase tracking-tighter">Total</span>
                                    <span className="text-amber-500 text-xl">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] mb-4 text-gray-400 flex items-center gap-2">
                                <FontAwesomeIcon icon={faLocationDot} className="text-amber-600" />
                                Delivery Address
                            </h3>
                            <div className="text-sm text-gray-600 font-medium leading-relaxed">
                                <p className="font-black text-[#2E2E2E]">{order.shipping_address?.full_name}</p>
                                <p>{order.shipping_address?.street}</p>
                                <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
                                <p className="mt-2 text-[#C17F24] font-bold text-xs">{order.shipping_address?.mobile}</p>
                            </div>
                        </div>

                        {/* COD Note */}
                        {order.payment_method === 'cod' && (
                            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                                 <div className="flex items-start gap-4">
                                    <FontAwesomeIcon icon={faCircleInfo} className="text-amber-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1">COD Info</p>
                                        <p className="text-xs text-amber-800 leading-normal font-medium">Please keep <strong>{formatCurrency(order.total)}</strong> ready on the day of delivery. Our courier partner will call you beforehand.</p>
                                    </div>
                                 </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
