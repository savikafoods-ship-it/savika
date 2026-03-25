'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faHeart, 
    faSearch, 
    faShoppingBag 
} from '@fortawesome/free-solid-svg-icons'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

export default function WishlistPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchWishlist() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    setLoading(false)
                    return
                }

                // Fetch user profile to get wishlist_ids
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('wishlist_ids')
                    .eq('id', user.id)
                    .single()

                const ids = profile?.wishlist_ids || []

                if (ids.length > 0) {
                    const { data: productsData } = await supabase
                        .from('products')
                        .select('*, category:categories(*)')
                        .in('id', ids)
                    
                    setProducts(productsData || [])
                }
            } catch (err) {
                console.error("Wishlist fetch error:", err)
            } finally {
                setLoading(false)
            }
        }
        
        fetchWishlist()
    }, [supabase])

    return (
        <div className="min-h-screen bg-[#F5F0E8] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center gap-3 mb-8 border-b border-[#e8ddd0] pb-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <FontAwesomeIcon icon={faHeart} className="w-6 h-6 text-[#C17F24]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#2E2E2E]">My Wishlist</h1>
                        <p className="text-gray-500 font-medium text-sm mt-1">{products.length} Items Saved</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="bg-white rounded-3xl h-[400px] animate-pulse border border-[#e8ddd0]" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#e8ddd0] p-12 text-center max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-[#F9F4EE] rounded-full flex items-center justify-center mx-auto mb-6">
                            <FontAwesomeIcon icon={faSearch} className="w-10 h-10 text-[#C17F24]/40" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#2E2E2E] mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                            Looking for some inspiration? Explore our premium Indian spices and click the heart icon to save them for later.
                        </p>
                        <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-[#111] hover:bg-[#C17F24] text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-[1.02]">
                            <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
                            Discover Spices
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
