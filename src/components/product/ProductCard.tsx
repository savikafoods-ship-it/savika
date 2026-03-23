'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Check, Star } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrency, getDiscountPercent } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { getProductImageUrl } from '@/lib/appwrite/imageUrl'

interface ProductCardProps {
    product: Product
    className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [adding, setAdding] = useState(false)
    const [imgError, setImgError] = useState(false)
    const { addItem } = useCartStore()

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        setAdding(true)
        addItem(product)
        setTimeout(() => setAdding(false), 900)
    }

    const discountPercent = product.comparePrice ? getDiscountPercent(product.comparePrice, product.price) : 0

    return (
        <div className={`product-card ${className}`}>
            <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                {/* Image */}
                <div className="product-card-img">
                    {product.imageIds?.[0] && !imgError ? (
                        <Image
                            src={product.imageIds[0].startsWith('/') ? product.imageIds[0] : getProductImageUrl(product.imageIds[0], 400, 80)}
                            alt={product.name}
                            fill
                            className="object-contain"
                            style={{ padding: '1rem', transition: 'transform 400ms' }}
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
                    {product.isActive && !discountPercent && (
                        <span style={{
                            position: 'absolute', top: '0.625rem', left: '0.625rem', zIndex: 10,
                            background: '#C17F24', color: '#fff', fontSize: '10px', fontWeight: 700,
                            padding: '2px 7px', borderRadius: '9999px'
                        }}>New</span>
                    )}
                    {/* Wishlist */}
                    <button
                        onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted) }}
                        aria-label="Toggle Wishlist"
                        style={{
                            position: 'absolute', top: '0.625rem', right: '0.625rem', zIndex: 10,
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: '#fff', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,.1)'
                        }}
                    >
                        <Heart className="w-4 h-4" fill={isWishlisted ? '#C17F24' : 'none'} stroke={isWishlisted ? '#C17F24' : '#999'} />
                    </button>
                </div>

                {/* Body */}
                <div className="product-card-body">
                    <p style={{ fontSize: '10px', color: '#8E562E', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {product.category?.name ?? 'Spice'}
                    </p>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2E2E2E', lineHeight: 1.35, marginBottom: '0.5rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {product.name}
                    </h3>
                    {/* Stars */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1px', marginBottom: '0.5rem' }}>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3" fill="#C17F24" stroke="#C17F24" />
                        ))}
                        <span style={{ fontSize: '10px', color: '#999', marginLeft: '4px' }}>(4.8)</span>
                    </div>
                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#C17F24' }}>
                            {formatCurrency(product.price)}
                        </span>
                        {product.comparePrice && (
                            <span style={{ fontSize: '0.8125rem', textDecoration: 'line-through', color: '#aaa' }}>
                                {formatCurrency(product.comparePrice)}
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
