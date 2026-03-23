'use client'

import { useState } from 'react'
import { ShoppingBag, Heart, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

export default function ProductCommercePanel({ productData }: { productData: any }) {
    const [selectedWeight, setSelectedWeight] = useState(productData.weight[0])
    const [adding, setAdding] = useState(false)
    const { addItem } = useCartStore()

    const savings = productData.salePrice ? productData.price - productData.salePrice : 0

    const handleAddToCart = () => {
        setAdding(true)
        
        // Map static ProductData to global Product type for CartStore
        const cartProduct: Product = {
            $id: productData.slug,
            name: productData.name,
            slug: productData.slug,
            price: productData.salePrice ?? productData.price,
            comparePrice: productData.salePrice ? productData.price : undefined,
            stock: productData.stock,
            isActive: true,
            categoryId: productData.category.slug,
            imageIds: [] // Cannot pass local static images easily through string array, fallback will show
        }

        // We can pass the static image url via a hack or just rely on the cart's placeholder
        // For accurate pricing based on weight, ideally this would scale the price. 
        // Since pricing isn't mapped per weight in the static data, we use base price.
        
        addItem(cartProduct, 1, selectedWeight) 
        setTimeout(() => setAdding(false), 1000)
    }

    return (
        <div className="space-y-6">
            {/* Weight / Variant selector */}
            <div>
                <p className="text-sm font-semibold text-[#2E2E2E] mb-2">Select Weight</p>
                <div className="flex flex-wrap gap-2">
                    {productData.weight.map((opt: string) => (
                        <button
                            key={opt}
                            onClick={() => setSelectedWeight(opt)}
                            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                                selectedWeight === opt
                                    ? 'border-[#C47F17] bg-[#C47F17] text-white'
                                    : 'border-[#e8ddd0] bg-white text-[#2E2E2E] hover:border-[#C47F17]'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${productData.stock > 20 ? 'bg-green-500' : productData.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-[#2E2E2E]">
                    {productData.stock > 20 ? 'In Stock' : productData.stock > 0 ? `Only ${productData.stock} left` : 'Out of Stock'}
                </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button 
                    onClick={handleAddToCart}
                    disabled={productData.stock === 0}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#C17F24]/30 ${adding ? 'bg-green-500 text-white' : 'bg-[#C17F24] hover:bg-[#8B5E16] text-white'}`}
                >
                    <ShoppingBag className="w-5 h-5" />
                    {adding ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <button 
                    className="flex items-center justify-center gap-2 border-2 border-[#C17F24] text-[#C17F24] hover:bg-[#C17F24] hover:text-white px-5 py-4 rounded-2xl font-bold text-base transition-all duration-300"
                    onClick={() => alert(`Added ${productData.name} to wishlist!`)}
                >
                    <Heart className="w-5 h-5" />
                    Wishlist
                </button>
            </div>

            {/* Delivery estimate */}
            <div className="bg-white rounded-2xl border border-[#e8ddd0] p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#C17F24]" />
                    <div>
                        <p className="text-sm font-semibold text-[#2E2E2E]">Free delivery on orders ₹599+</p>
                        <p className="text-xs text-gray-500">Delivered in 3–7 business days across India</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-[#C17F24]" />
                    <div>
                        <p className="text-sm font-semibold text-[#2E2E2E]">7-Day Easy Returns</p>
                        <p className="text-xs text-gray-500">Not satisfied? Return hassle-free.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#C17F24]" />
                    <div>
                        <p className="text-sm font-semibold text-[#2E2E2E]">100% Authentic & FSSAI Certified</p>
                        <p className="text-xs text-gray-500">Tested for purity, adulteration & pesticides</p>
                    </div>
                </div>
            </div>

            {/* Hero Intro (SEO text) */}
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                <p>{productData.heroIntro}</p>
            </div>
        </div>
    )
}
