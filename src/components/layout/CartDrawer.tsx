'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
    const drawerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    const cartTotal = total()

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
                    onClick={closeCart}
                />
            )}

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8ddd0]">
                    <div>
                        <h2 className="text-lg font-bold text-[#2E2E2E]">Your Cart</h2>
                        <p className="text-xs text-[#8E562E]">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={closeCart} className="p-2 rounded-lg hover:bg-[#F9F4EE] text-[#2E2E2E] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4 px-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-[#FFF0DC] flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-[#C47F17]/50" />
                            </div>
                            <div>
                                <p className="font-semibold text-[#2E2E2E]">Your cart is empty</p>
                                <p className="text-sm text-gray-500 mt-1">Add some premium spices to get started!</p>
                            </div>
                            <button onClick={closeCart} className="bg-[#C17F24] hover:bg-[#8B5E16] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                                Explore Spices
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => {
                                const price = item.product.price
                                return (
                                    <div key={`${item.productId}-${item.weight}`} className="flex gap-4 p-3 rounded-xl bg-[#F9F4EE]">
                                        <div className="relative w-18 h-18 rounded-lg overflow-hidden bg-white shrink-0">
                                            {item.product.imageIds?.[0] ? (
                                                <Image src={item.product.imageIds[0].startsWith('/') ? item.product.imageIds[0] : `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || ''}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_PRODUCTS || ''}/files/${item.product.imageIds[0]}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''}`} alt={item.product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-[#e8ddd0] flex items-center justify-center">
                                                    <ShoppingBag className="w-6 h-6 text-[#C47F17]/50" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#2E2E2E] truncate">{item.product.name}</p>
                                            {item.weight && <p className="text-xs text-[#8E562E] mt-0.5">{item.weight}</p>}
                                            <p className="text-sm font-bold text-[#C47F17] mt-1">{formatCurrency(price)}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.weight)}
                                                    className="w-7 h-7 rounded-lg border border-[#C47F17]/40 flex items-center justify-center text-[#C47F17] hover:bg-[#C47F17] hover:text-white transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-bold text-[#2E2E2E] w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.weight)}
                                                    className="w-7 h-7 rounded-lg border border-[#C47F17]/40 flex items-center justify-center text-[#C47F17] hover:bg-[#C47F17] hover:text-white transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.productId, item.weight)}
                                                    className="ml-auto p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-[#e8ddd0] px-6 py-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Subtotal</span>
                            <span className="text-lg font-bold text-[#2E2E2E]">{formatCurrency(cartTotal)}</span>
                        </div>
                        <p className="text-xs text-gray-400 text-center">Shipping & taxes calculated at checkout</p>
                        <div className="space-y-2">
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="block w-full text-center bg-[#C17F24] hover:bg-[#8B5E16] text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
                            >
                                Proceed to Checkout
                            </Link>
                            <Link
                                href="/cart"
                                onClick={closeCart}
                                className="block w-full text-center border border-[#C17F24] text-[#C17F24] py-3 rounded-lg font-semibold hover:bg-[#F9F4EE] transition-colors"
                            >
                                View Cart
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
