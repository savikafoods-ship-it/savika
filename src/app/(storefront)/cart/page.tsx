'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { 
    ShoppingBag, 
    Minus, 
    Plus, 
    Trash2, 
    ShieldCheck, 
    Truck, 
    RotateCcw 
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCartStore()
    const cartTotal = total()
    const shippingThreshold = 599
    const shipping = cartTotal >= shippingThreshold ? 0 : 25
    const remainingForFreeShipping = Math.max(0, shippingThreshold - cartTotal)

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-inner">
                        <ShoppingBag className="w-10 h-10 text-amber-700/60" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2 uppercase tracking-tight">Your cart is empty</h2>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">It looks like you haven't added any spices to your cart yet. Discover our premium collections today.</p>
                    <Link href="/shop" className="inline-block bg-[#C17F24] hover:bg-[#8B5E16] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95">
                        Browse Shop
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8] pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Step 01 / 03</p>
                        <h1 className="text-4xl font-black text-[#2E2E2E] tracking-tighter">
                            Your <span className="text-[#C17F24] italic">Cart</span>
                        </h1>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{items.length} items selected</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10 items-start">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={`${item.productId}-${item.weight}`} className="bg-white rounded-3xl p-5 flex gap-5 shadow-sm border border-gray-100 group transition-all hover:shadow-md">
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-50 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                                    <Image 
                                        src={getProductImageUrl(item.product.image_urls?.[0] || '')} 
                                        alt={item.product.name} 
                                        fill 
                                        className="object-cover" 
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <Link href={`/product/${item.product.slug}`} className="font-extrabold text-[#2E2E2E] hover:text-[#C17F24] text-base sm:text-lg tracking-tight transition-colors">
                                                {item.product.name}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase tracking-tighter">
                                                    {item.weight}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeItem(item.productId, item.weight)} 
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-end justify-between mt-4">
                                        <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                                            <button 
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1, item.weight)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-amber-700 transition-colors"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-black text-[#2E2E2E]">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1, item.weight)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-amber-700 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold mb-0.5 uppercase tracking-tighter">Subtotal</p>
                                            <p className="font-black text-[#2E2E2E] text-lg">{formatCurrency(item.product.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-4">
                            <Link href="/shop" className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-2 transition-all hover:gap-3 underline-offset-4 hover:underline">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-amber-900/5 border border-gray-100 sticky top-24">
                            <h3 className="font-black text-[#2E2E2E] text-xl uppercase tracking-tighter mb-8">Summary</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="font-bold text-[#2E2E2E]">{formatCurrency(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Delivery Fee</span>
                                    <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-bold text-[#2E2E2E]'}>
                                        {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 mt-4">
                                        <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-amber-600 h-full transition-all duration-500" 
                                                style={{ width: `${(cartTotal / shippingThreshold) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-amber-800 mt-2 font-bold uppercase tracking-widest text-center">
                                            Add {formatCurrency(remainingForFreeShipping)} more for FREE delivery
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-6 mb-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
                                    <span className="text-3xl font-black text-[#C17F24] leading-none">{formatCurrency(cartTotal + shipping)}</span>
                                </div>
                            </div>

                            <Link href="/checkout"
                                className="block w-full text-center bg-[#C17F24] hover:bg-[#8B5E16] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mb-6">
                                Proceed to Checkout
                            </Link>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 bg-gray-50 p-2.5 rounded-lg border border-gray-100 leading-none">
                                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>SECURE CHECKOUT EXPERIENCE</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 bg-gray-50 p-2.5 rounded-lg border border-gray-100 leading-none">
                                    <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>2-DAY DELIVERY EN ROUTE</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 bg-gray-50 p-2.5 rounded-lg border border-gray-100 leading-none">
                                    <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>7-DAY EASY RETURN POLICY</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
