'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, ShoppingCart, Heart, Package, Truck, Shield } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrency, getDiscountPercent } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

interface ProductDetailClientProps {
    product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [qty, setQty] = useState(1)
    const [adding, setAdding] = useState(false)
    const { addItem } = useCartStore()

    const discount = product.comparePrice ? getDiscountPercent(product.comparePrice, product.price) : 0

    const handleAddToCart = () => {
        setAdding(true)
        addItem(product, qty)
        setTimeout(() => setAdding(false), 1000)
    }

    return (
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Image Gallery */}
            <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F9F4EE]">
                    {product.imageIds?.[selectedImage] ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_PRODUCTS}/files/${product.imageIds[selectedImage]}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
                            alt={product.name}
                            fill
                            className="object-contain p-8"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-24 h-24 text-[#C17F24]/30" />
                        </div>
                    )}
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-[#ef4444] text-white text-xs font-bold px-3 py-1 rounded-full">
                            -{discount}% OFF
                        </div>
                    )}
                </div>
                {product.imageIds && product.imageIds.length > 1 && (
                    <div className="flex gap-3">
                        {product.imageIds.map((imgId, i) => (
                            <button key={i} onClick={() => setSelectedImage(i)}
                                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-[#C17F24]' : 'border-transparent'}`}>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_PRODUCTS}/files/${imgId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&width=100&quality=80`}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
                <div>
                    <p className="text-xs text-[#8E562E] uppercase tracking-widest mb-2">{product.category?.name}</p>
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#2E2E2E] leading-tight">{product.name}</h1>
                    <div className="flex items-center gap-2 mt-3">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4" fill="#C17F24" stroke="#C17F24" />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">4.8 - 124 reviews</span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-[#C17F24]">{formatCurrency(product.price)}</span>
                    {product.comparePrice && (
                        <span className="text-xl line-through text-gray-400">{formatCurrency(product.comparePrice)}</span>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm text-[#5a4a3a] leading-relaxed">{product.description}</p>

                {/* Quantity + Cart */}
                <div className="flex gap-3 items-center">
                    <div className="flex items-center border-2 border-[#e8ddd0] rounded-lg overflow-hidden">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-[#C17F24] font-bold hover:bg-[#F9F4EE] transition-colors">-</button>
                        <span className="px-4 py-3 text-sm font-bold text-[#2E2E2E] min-w-[3rem] text-center">{qty}</span>
                        <button onClick={() => setQty(qty + 1)} className="px-4 py-3 text-[#C17F24] font-bold hover:bg-[#F9F4EE] transition-colors">+</button>
                    </div>
                    <button onClick={handleAddToCart} disabled={product.stock === 0}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold transition-all duration-300 ${adding ? 'bg-green-500 text-white' : 'bg-[#C17F24] hover:bg-[#8B5E16] text-white hover:scale-[1.02]'
                            }`}>
                        <ShoppingCart className="w-5 h-5" />
                        {adding ? 'Added to Cart!' : 'Add to Cart'}
                    </button>
                    <button className="p-3.5 rounded-lg border-2 border-[#e8ddd0] hover:border-[#C17F24] hover:text-[#C17F24] transition-all">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>

                {/* Delivery info */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#e8ddd0]">
                    {[
                        { icon: <Package className="w-5 h-5" />, text: 'Premium Packaging' },
                        { icon: <Truck className="w-5 h-5" />, text: 'Free above Rs.599' },
                        { icon: <Shield className="w-5 h-5" />, text: 'FSSAI Certified' },
                    ].map((item) => (
                        <div key={item.text} className="flex flex-col items-center gap-1 text-center text-[#C17F24]">
                            {item.icon}
                            <span className="text-[11px] text-gray-500">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
