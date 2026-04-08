'use client'

import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faCartShopping, faUser, faClock, faRotate, faChevronRight, 
    faTrash, faEnvelope, faPhone, faBagShopping 
} from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '@/lib/utils'

interface Cart {
    id: string
    user_id: string
    items: any[]
    updated_at: string
    profiles: {
        full_name: string
        email: string
        mobile: string
    }
}

interface AbandonedCartsClientProps {
    carts: Cart[]
}

export default function AbandonedCartsClient({ carts }: AbandonedCartsClientProps) {
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

    const calculateTotal = (items: any[]) => {
        return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    }

    const timeAgo = (dateStr: string) => {
        const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
        if (seconds < 60) return 'Just now'
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-[800] text-white tracking-tight">Abandoned Carts</h1>
                    <p className="text-sm text-gray-400 mt-1">{today}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all text-sm font-bold"
                    >
                        <FontAwesomeIcon icon={faRotate} className="w-3.5 h-3.5" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-4">
                {carts.length === 0 ? (
                    <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-20 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <FontAwesomeIcon icon={faCartShopping} className="text-3xl text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No abandoned carts found</h3>
                        <p className="text-gray-500 max-w-md">When customers add items to their cart but don't check out, they will appear here.</p>
                    </div>
                ) : (
                    carts.map((cart) => (
                        <div key={cart.id} className="bg-[#18181B] rounded-2xl border border-white/5 overflow-hidden hover:border-amber-500/30 transition-all group">
                            <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-6">
                                {/* Left: User Info */}
                                <div className="flex items-start gap-4 lg:w-1/3">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                                        <FontAwesomeIcon icon={faUser} className="text-amber-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-white font-[700] text-base truncate">{cart.profiles?.full_name || 'Guest User'}</h3>
                                        <div className="flex flex-col gap-1 mt-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                                                <span className="truncate">{cart.profiles?.email || 'No email provided'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <FontAwesomeIcon icon={faPhone} className="w-3 h-3" />
                                                <span>{cart.profiles?.mobile || 'No phone provided'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle: Cart Summary */}
                                <div className="flex-1 flex flex-wrap gap-8 items-center border-t border-white/5 lg:border-t-0 pt-6 lg:pt-0">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Items</p>
                                        <div className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faBagShopping} className="text-amber-500 w-3.5 h-3.5" />
                                            <span className="text-white font-bold">{cart.items.length} Products</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Value</p>
                                        <p className="text-white font-black text-lg">{formatCurrency(calculateTotal(cart.items))}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Last Active</p>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold">{timeAgo(cart.updated_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex items-center gap-2 self-end lg:self-center">
                                    <button 
                                        onClick={() => {
                                            // Optional: Implementation for nudge/delete
                                            alert('In a real scenario, this would send an automated nudge or discount code.')
                                        }}
                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                    >
                                        Send Nudge
                                    </button>
                                </div>
                            </div>

                            {/* Cart Item Preview (Expanding?) */}
                            <div className="px-6 py-4 bg-black/20 border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-hide">
                                {cart.items.map((item, idx) => (
                                    <div key={idx} className="flex-shrink-0 flex items-center gap-3 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                                        <div className="w-8 h-8 rounded bg-black/40 flex items-center justify-center text-[10px] font-bold text-amber-500">
                                            {item.quantity}x
                                        </div>
                                        <div className="text-xs">
                                            <p className="text-white font-bold truncate max-w-[100px]">{item.product.name}</p>
                                            <p className="text-gray-500 text-[10px]">{item.weight}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
