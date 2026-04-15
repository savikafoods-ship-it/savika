'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag, faHeart, faTruck, faShieldAlt, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

interface WeightVariant {
    label: string
    price: number
}

function parseWeightOptions(raw: any[], metadataPricing: any[], fallbackPrice: number): WeightVariant[] {
    // If we have explicit weight_pricing in metadata (which we guarantee to be {label, price}), use it!
    if (metadataPricing && metadataPricing.length > 0) {
        return metadataPricing.map((opt: any) => ({
            label: opt.label || '100g',
            price: Number(opt.price) || fallbackPrice
        }))
    }
    
    // Fallback to parsing the legacy array (which might just be strings)
    if (!raw || raw.length === 0) return []
    return raw.map((opt: any) => {
        if (typeof opt === 'object' && opt !== null) {
            return { label: opt.label || opt.weight || '100g', price: Number(opt.price) || fallbackPrice }
        }
        if (typeof opt === 'string') {
            try { return JSON.parse(opt) } catch { /* ignore */ }
            return { label: opt, price: fallbackPrice }
        }
        return null
    }).filter(Boolean) as WeightVariant[]
}

export default function ProductCommercePanel({ productData }: { productData: any }) {
    const weightOptions = parseWeightOptions(
        productData.weightOptions || productData.weight_options || [],
        productData.metadata?.weight_pricing || [],
        productData.price
    )

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [adding, setAdding] = useState(false)
    const router = useRouter()
    const { addItem, clearCart } = useCartStore()

    const selectedVariant = weightOptions[selectedIndex] || { label: '100g', price: productData.price }
    const displayPrice = selectedVariant.price
    const comparePrice = productData.compare_price
    const savings = comparePrice && comparePrice > displayPrice ? comparePrice - displayPrice : 0
    const savingsPct = savings > 0 ? Math.round((savings / comparePrice) * 100) : 0

        
    const handleAddToCart = () => {
        setAdding(true)

        // Set product price to the selected variant price so cart total is correct
        const cartProduct: Product = {
            id: productData.id || productData.slug,
            name: `${productData.name} - ${selectedVariant.label}`,
            slug: productData.slug,
            price: displayPrice,
            compare_price: comparePrice && comparePrice > displayPrice ? comparePrice : undefined,
            stock: productData.stock,
            is_active: true,
            category_id: productData.category?.id || productData.category?.slug,
            image_urls: productData.image_urls || []
        }

        addItem(cartProduct, 1, selectedVariant.label)
        setTimeout(() => setAdding(false), 1200)
    }

    const handleBuyNow = () => {
        // Clear cart first for "Buy Now" to buy ONLY the selected item
        clearCart()

        // Add to cart - showCart: false to prevent drawer from opening
        const cartProduct: Product = {
            id: productData.id || productData.slug,
            name: `${productData.name} - ${selectedVariant.label}`,
            slug: productData.slug,
            price: displayPrice,
            compare_price: comparePrice && comparePrice > displayPrice ? comparePrice : undefined,
            stock: productData.stock,
            is_active: true,
            category_id: productData.category?.id || productData.category?.slug,
            image_urls: productData.image_urls || []
        }

        addItem(cartProduct, 1, selectedVariant.label, false)
        // Redirect to checkout
        router.push('/checkout')
    }

    return (
        <div className="space-y-6">
            {/* Price Display */}
            <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#2C1A0E]">
                        ₹{displayPrice}
                    </span>
                    {savings > 0 && (
                        <>
                            <span className="text-xl text-gray-400 line-through">₹{comparePrice}</span>
                            <span className="text-sm bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                                Save ₹{savings} ({savingsPct}%)
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Weight / Variant selector */}
            {weightOptions.length > 0 && (
                <div>
                    <p className="text-sm font-semibold text-[#2E2E2E] mb-2">Select Weight</p>
                    <div className="flex flex-wrap gap-2 w-full overflow-visible">
                        {weightOptions.map((opt, i) => (
                            <button
                                key={opt.label}
                                onClick={() => setSelectedIndex(i)}
                                className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                    selectedIndex === i
                                        ? 'border-[#C47F17] bg-[#C47F17] text-white'
                                        : 'border-[#e8ddd0] bg-white text-[#2E2E2E] hover:border-[#C47F17]'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${productData.stock > 20 ? 'bg-green-500' : productData.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-[#2E2E2E]">
                    {productData.stock > 20 ? 'In Stock' : productData.stock > 0 ? `Only ${productData.stock} left` : 'Out of Stock'}
                </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={productData.stock === 0}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#C17F24]/30 cursor-pointer ${adding ? 'bg-green-500 text-white' : 'bg-white border-2 border-[#C17F24] text-[#C17F24] hover:bg-[#FFF0DC]'}`}
                    >
                        <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
                        {adding ? 'Added to Cart!' : 'Add to Cart'}
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={productData.stock === 0}
                        className="flex-[1.5] flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#C17F24] hover:bg-[#8B5E16] text-white font-black text-lg transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-[#C17F24]/40 cursor-pointer"
                    >
                        Buy Now
                    </button>
                </div>
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
