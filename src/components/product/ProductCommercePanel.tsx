'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag, faHeart, faTruck, faShieldAlt, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

export default function ProductCommercePanel({ productData }: { productData: any }) {
    const [selectedVariant, setSelectedVariant] = useState(productData.weightOptions[0])
    const [adding, setAdding] = useState(false)
    const { addItem } = useCartStore()

    const currentPrice = selectedVariant.price
    const currentSalePrice = selectedVariant.salePrice
    const savings = currentSalePrice ? currentPrice - currentSalePrice : 0
    const savingsPct = savings > 0 ? Math.round((savings / currentPrice) * 100) : 0

    const handleAddToCart = () => {
        setAdding(true)
        
        const cartProduct: Product = {
            id: productData.id || productData.slug, // Use real ID if available, otherwise slug for now
            name: productData.name,
            slug: productData.slug,
            price: currentSalePrice ?? currentPrice,
            compare_price: currentSalePrice ? currentPrice : undefined,
            stock: productData.stock,
            is_active: true,
            category_id: productData.category?.id || productData.category?.slug,
            image_urls: productData.image_urls || [productData.image]
        }
        
        addItem(cartProduct, 1, selectedVariant.label) 
        setTimeout(() => setAdding(false), 1000)
    }

    return (
        <div className="space-y-6">
            {/* Price Display */}
            <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-[#2C1A0E]">
                        ₹{currentSalePrice ?? currentPrice}
                    </span>
                    {currentSalePrice && (
                        <>
                            <span className="text-xl text-gray-400 line-through">₹{currentPrice}</span>
                            <span className="text-sm bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                                Save ₹{savings} ({savingsPct}%)
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Weight / Variant selector */}
            <div>
                <p className="text-sm font-semibold text-[#2E2E2E] mb-2">Select Weight</p>
                <div className="flex flex-wrap gap-2">
                    {productData.weightOptions.map((opt: any) => (
                        <button
                            key={opt.label}
                            onClick={() => setSelectedVariant(opt)}
                            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                                selectedVariant.label === opt.label
                                    ? 'border-[#C47F17] bg-[#C47F17] text-white'
                                    : 'border-[#e8ddd0] bg-white text-[#2E2E2E] hover:border-[#C47F17]'
                            }`}
                        >
                            {opt.label}
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
                    <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
                    {adding ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <button 
                    className="flex items-center justify-center gap-2 border-2 border-[#C17F24] text-[#C17F24] hover:bg-[#C17F24] hover:text-white px-5 py-4 rounded-2xl font-bold text-base transition-all duration-300"
                    onClick={() => alert(`Added ${productData.name} to wishlist!`)}
                >
                    <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
                    Wishlist
                </button>
            </div>

            {/* Delivery estimate */}
            <div className="bg-white rounded-2xl border border-[#e8ddd0] p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faTruck} className="w-5 h-5 text-[#C17F24]" />
                    <div>
                        <p className="text-sm font-semibold text-[#2E2E2E]">Free delivery on orders ₹599+</p>
                        <p className="text-xs text-gray-500">Delivered in 3–7 business days across India</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faRotateLeft} className="w-5 h-5 text-[#C17F24]" />
                    <div>
                        <p className="text-sm font-semibold text-[#2E2E2E]">7-Day Easy Returns</p>
                        <p className="text-xs text-gray-500">Not satisfied? Return hassle-free.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-[#C17F24]" />
                    <div>
                        <p className="text-sm font-semibold text-[#2E2E2E]">100% Authentic & FSSAI Certified</p>
                        <p className="text-xs text-gray-500">Tested for purity, adulteration & pesticides</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
