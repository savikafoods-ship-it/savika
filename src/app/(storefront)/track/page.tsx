'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTruck, faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderNumber.trim()) return

        setLoading(true)
        // NimbusPost tracking usually works with AWB or Order ID
        // Redirect to the NimbusPost tracking portal with the ID
        const baseUrl = process.env.NEXT_PUBLIC_NIMBUSPOST_TRACKING_URL || 'https://ship.nimbuspost.com/shipping/tracking/'
        window.location.href = `${baseUrl}${orderNumber.trim()}`
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8] py-20 px-4">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-amber-900/10 border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <FontAwesomeIcon icon={faTruck} className="text-3xl text-[#885E16]" />
                    </div>
                    
                    <h1 className="text-3xl font-black text-[#2E2E2E] mb-2 tracking-tight">Track Your Journey</h1>
                    <p className="text-gray-500 text-sm font-medium mb-10 uppercase tracking-widest">Enter your Order ID or Tracking Number</p>

                    <form onSubmit={handleTrack} className="space-y-6">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="e.g. #SAV-12345 or AWB123456"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full h-16 px-6 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#885E16] focus:bg-white transition-all font-bold text-lg text-[#2E2E2E]"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <FontAwesomeIcon icon={faSearch} />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading || !orderNumber.trim()}
                            className="w-full h-16 bg-[#885E16] hover:bg-[#6b4a11] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : null}
                            Track Shipment
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-50">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-loose">
                            Usually tracking info is updated <br />
                            <span className="text-[#885E16]">within 24-48 hours</span> of order confirmation
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/shop" className="text-sm font-bold text-gray-500 hover:text-[#885E16] transition-colors">
                        Return to Shop
                    </Link>
                </div>
            </div>
        </div>
    )
}
