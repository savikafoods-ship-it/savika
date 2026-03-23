'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ShoppingBag, Minus, Plus, Trash2, Tag } from 'lucide-react'

import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
    const [coupon, setCoupon] = useState('')
    const cartTotal = total()
    const shipping = cartTotal >= 599 ? 0 : 60

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto rounded-full bg-[#FFF0DC] flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-[#C17F24]/60" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#2E2E2E] mb-3">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Discover India&apos;s finest spices and fill your kitchen with flavour.</p>
                    <Link href="/shop" className="inline-block bg-[#C17F24] hover:bg-[#8B5E16] text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105">
                        Shop All Spices
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#2E2E2E] mb-8">
                    Your Cart{' '}
                    <span className="text-[#C17F24] text-xl font-normal italic">({items.length} items)</span>
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const price = item.product.price
                            return (
                                <div key={`${item.productId}-${item.weight}`} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#F9F4EE] shrink-0">
                                        {item.product.imageIds?.[0] ? (
                                            <Image src={item.product.imageIds[0].startsWith('/') ? item.product.imageIds[0] : `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || ''}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_PRODUCTS || ''}/files/${item.product.imageIds[0]}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''}`} alt={item.product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-8 h-8 text-[#C17F24]/40" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/product/${item.product.slug}`} className="font-semibold text-[#2E2E2E] hover:text-[#C17F24] block truncate">
                                            {item.product.name}
                                        </Link>
                                        {item.weight && <p className="text-xs text-[#8E562E] mt-0.5">{item.weight}</p>}
                                        <p className="text-[#C17F24] font-bold mt-1">{formatCurrency(price)}</p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center border border-[#e8ddd0] rounded-lg overflow-hidden">
                                                <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.weight)} className="px-3 py-1.5 text-[#C17F24] hover:bg-[#F9F4EE] transition-colors">
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-3 py-1.5 text-sm font-bold text-[#2E2E2E]">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.weight)} className="px-3 py-1.5 text-[#C17F24] hover:bg-[#F9F4EE] transition-colors">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <span className="font-bold text-[#2E2E2E]">{formatCurrency(price * item.quantity)}</span>
                                            <button onClick={() => removeItem(item.productId, item.weight)} className="ml-auto text-red-400 hover:text-red-600 transition-colors p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-[#2E2E2E] text-lg mb-6">Order Summary</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-semibold text-[#2E2E2E]">{formatCurrency(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className={shipping === 0 ? 'text-green-500 font-semibold' : 'font-semibold text-[#2E2E2E]'}>
                                        {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-xs text-[#8E562E]">Add {formatCurrency(599 - cartTotal)} more for free shipping!</p>
                                )}
                                <div className="border-t border-[#e8ddd0] pt-3 flex justify-between">
                                    <span className="font-bold text-[#2E2E2E]">Total</span>
                                    <span className="font-bold text-xl text-[#C17F24]">{formatCurrency(cartTotal + shipping)}</span>
                                </div>
                            </div>

                            {/* Coupon */}
                            <div className="flex gap-2 mb-6">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)}
                                        placeholder="Coupon code"
                                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#e8ddd0] bg-white text-sm focus:outline-none focus:border-[#C17F24]" />
                                </div>
                                <button className="px-4 py-2.5 rounded-lg border border-[#C17F24] text-[#C17F24] text-sm font-semibold hover:bg-[#C17F24] hover:text-white transition-all">
                                    Apply
                                </button>
                            </div>

                            <Link href="/checkout"
                                className="block w-full text-center bg-[#C17F24] hover:bg-[#8B5E16] text-white py-3.5 rounded-lg font-bold transition-all hover:scale-[1.02]">
                                Proceed to Checkout
                            </Link>
                            <Link href="/shop" className="block text-center text-sm text-[#C17F24] mt-3 hover:underline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
