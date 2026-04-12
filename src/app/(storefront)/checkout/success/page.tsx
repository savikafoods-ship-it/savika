'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faCheckCircle, 
    faBoxOpen, 
    faTruck, 
    faHome, 
    faCopy, 
    faBagShopping,
    faChevronRight,
    faSyncAlt,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '@/lib/utils'

function SuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const orderId = searchParams.get('orderId')
    const orderNumber = searchParams.get('orderNumber') || 'SAV-XXXXX'

    const [copied, setCopied] = useState(false)
    const [orderDate, setOrderDate] = useState<string>('')
    const [etaDate, setEtaDate] = useState<string>('')

    useEffect(() => {
        const now = new Date()
        setOrderDate(now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }))
        
        // 2-day estimation
        const eta = new Date()
        eta.setDate(eta.getDate() + 2)
        setEtaDate(eta.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }))

        // Security check: if no orderId, redirect back
        if (!orderId) {
            router.push('/shop')
        }
    }, [orderId, router])

    const copyOrderNumber = () => {
        navigator.clipboard.writeText(orderNumber)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-2xl mx-auto px-4 animate-in fade-in duration-700">
            {/* Success Animation Area */}
            <div className="text-center mb-12">
                <div className="relative inline-block">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-5xl animate-bounce" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center border-2 border-white">
                        <FontAwesomeIcon icon={faBagShopping} className="text-amber-600 text-xs" />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-[#2E2E2E] mt-8 tracking-tighter">
                    Order <span className="text-[#C17F24] italic text-5xl">Placed!</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">
                    We've received your request and are preparing your spices.
                </p>
            </div>

            {/* Order Number Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-amber-900/5 border border-gray-100 mb-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                <div className="relative z-10 flex flex-col items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Order Number</p>
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-black text-[#C17F24] tracking-tighter">{orderNumber}</h2>
                        <button 
                            onClick={copyOrderNumber}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:text-amber-700'
                            }`}
                        >
                            <FontAwesomeIcon icon={faCopy} className="text-xs" />
                        </button>
                    </div>
                    {copied && <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-2">Copied to Clipboard!</span>}
                </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-[#18181b] rounded-[2rem] p-8 shadow-2xl text-white mb-8 border border-white/5">
                <h3 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-amber-500 flex items-center gap-3">
                    <FontAwesomeIcon icon={faTruck} />
                    Delivery Estimation
                </h3>
                
                <div className="space-y-10 relative">
                    {/* Vertical line connector */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-white/10" />

                    <div className="flex gap-6 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-xs shadow-lg shadow-amber-900/40">
                            <FontAwesomeIcon icon={faBoxOpen} />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-tighter">Order Confirmed</p>
                            <p className="text-[10px] font-bold text-[#a1a1aa] uppercase italic mt-0.5">{orderDate}</p>
                        </div>
                    </div>

                    <div className="flex gap-6 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-[#27272a] border border-white/10 flex items-center justify-center text-xs">
                            <FontAwesomeIcon icon={faSyncAlt} className="text-amber-500" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-tighter">Processing & Packing</p>
                            <p className="text-[11px] text-[#a1a1aa] font-medium leading-tight mt-1 max-w-[240px]">
                                Handpicking and custom packing your spices within 24 hours.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-6 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-xs">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-tighter text-green-500">Estimated Delivery</p>
                            <p className="font-black text-2xl text-white tracking-tighter mt-1">{etaDate}</p>
                            <p className="text-[10px] font-bold text-green-500/80 uppercase tracking-widest mt-1">Within 2 Working Days</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center text-amber-500">
                       <FontAwesomeIcon icon={faTruck} />
                    </div>
                    <p className="text-[11px] font-bold text-[#a1a1aa] leading-relaxed uppercase tracking-wider">
                       Cash is due upon delivery. Please keep exact change ready for our delivery partner.
                    </p>
                </div>
            </div>

            {/* Thank You & Actions */}
            <div className="bg-green-50 rounded-[2rem] p-8 border border-green-100 mb-6 text-center">
                <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] mb-2">🎉 Order Received!</p>
                <p className="text-sm text-green-800 font-medium leading-relaxed max-w-sm mx-auto">
                    Your spices are being prepared with love. We'll handpick and custom pack your order shortly.
                </p>
            </div>

            <div className="space-y-4">
                <Link href="/shop"
                    className="w-full h-14 bg-[#C17F24] hover:bg-[#8B5E16] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 group"
                >
                    <FontAwesomeIcon icon={faBagShopping} className="text-[10px]" />
                    Continue Shopping
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px] group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/"
                    className="w-full h-14 bg-white hover:bg-gray-50 border-2 border-gray-200 text-[#2E2E2E] rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                    <FontAwesomeIcon icon={faHome} className="text-[10px]" />
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-[#F5F0E8] pb-24 pt-12">
            <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                    <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-[#C17F24]" />
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    )
}
