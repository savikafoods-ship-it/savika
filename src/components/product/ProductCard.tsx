'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Check, Star } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrency, getDiscountPercent } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

interface ProductCardProps {
    product: Product
    className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {

    const [adding, setAdding] = useState(false)
    const [imgError, setImgError] = useState(false)
    const { addItem } = useCartStore()

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        setAdding(true)
        addItem(product)
        setTimeout(() => setAdding(false), 900)
    }

    const discountPercent = product.compare_price ? getDiscountPercent(product.compare_price, product.price) : 0

    return (
        <div className={`product-card hover-lift premium-shadow ${className}`}>
            <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                {/* Image */}
                <div className="product-card-img">
                    {product.image_urls?.[0] && !imgError ? (
                        <Image
                            src={product.image_urls[0].startsWith('/') ? product.image_urls[0] : getProductImageUrl(product.image_urls[0])}
                            alt={product.name}
                            fill
                            style={{ padding: '1rem', transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                            className="object-contain group-hover:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="img-ph">
                            <ShoppingCart className="w-12 h-12" style={{ color: 'rgba(196,127,23,.3)' }} />
                        </div>
                    )}
                    {/* Badge */}
                    {discountPercent > 0 && (
                        <span style={{
                            position: 'absolute', top: '0.625rem', left: '0.625rem', zIndex: 10,
                            background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 700,
                            padding: '2px 7px', borderRadius: '9999px'
                        }}>-{discountPercent}%</span>
                    )}
                    {product.is_active && !discountPercent && (
                        <span style={{
                            position: 'absolute', top: '0.625rem', left: '0.625rem', zIndex: 10,
                            background: '#C17F24', color: '#fff', fontSize: '10px', fontWeight: 700,
                            padding: '2px 7px', borderRadius: '9999px'
                        }}>New</span>
                    )}

                </div>

                {/* Body */}
                <div className="product-card-body p-3 sm:p-4">
                    <p style={{ fontSize: '9px', color: '#8E562E', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {product.category?.name ?? 'Spice'}
                    </p>
                    <div className="min-h-[3rem] sm:min-h-[3.5rem]">
                        <p className="font-semibold text-gray-950 text-sm sm:text-base leading-tight line-clamp-2">{product.name}</p>
                        {product.tagline && (
                            <p className="text-amber-700 text-[10px] sm:text-xs italic mt-0.5 line-clamp-1">{product.tagline}</p>
                        )}
                    </div>
                    {/* Stars */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1px', marginBottom: '0.25rem' }}>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="#C17F24" stroke="#C17F24" />
                        ))}
                    </div>
                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="text-sm sm:text-base font-bold text-[#C17F24]">
                            {formatCurrency(product.price)}
                        </span>
                        {product.compare_price && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                {formatCurrency(product.compare_price)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Add to Cart */}
            <div style={{ padding: '0 0.875rem 0.875rem' }}>
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`atc-btn${adding ? ' added' : ''}`}
                >
                    {adding ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                    {product.stock === 0 ? 'Out of Stock' : adding ? 'Added!' : 'Add to Cart'}
                </button>
            </div>
        </div>
    )
}
