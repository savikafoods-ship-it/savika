'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            setTimeout(() => inputRef.current?.focus(), 100)
        } else {
            document.body.style.overflow = 'auto'
            setQuery('')
            setResults([])
        }
        return () => { document.body.style.overflow = 'auto' }
    }, [isOpen])

    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([])
            return
        }

        const debounceTimer = setTimeout(async () => {
            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('id, name, description, price, slug, image_urls, metadata')
                    .or(`name.ilike.%${query}%,description.ilike.%${query}%,tagline.ilike.%${query}%`)
                    .eq('is_active', true)
                    .limit(10)

                if (error) throw error
                setResults(data || [])
            } catch (err) {
                console.error('Search error:', err)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [query, supabase])

    if (!isOpen) return null

    const POPULAR_SEARCHES = ['Turmeric', 'Red Chilli', 'Garam Masala', 'Coriander']
    const QUICK_CATEGORIES = [
        { name: 'Ground Spices', slug: 'ground-powdered' },
        { name: 'Artisan Blends', slug: 'blends-masalas' },
        { name: 'Rare Exotics', slug: 'exotics-rare' }
    ]

    return (
        <div className="fixed inset-0 z-[100] flex flex-col pt-12 sm:pt-20 px-4 bg-[#F5F0E8]/90 backdrop-blur-md">
            <div className="max-w-2xl w-full mx-auto relative animate-in fade-in slide-in-from-top-4 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute -top-12 right-0 bg-white/50 hover:bg-white text-[#2E2E2E] w-10 h-10 rounded-full flex items-center justify-center transition-all hover:rotate-90"
                >
                    <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                </button>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e8ddd0]">
                    <div className="p-5 flex items-center gap-4 border-b border-[#e8ddd0]">
                        <div className="w-10 h-10 rounded-xl bg-[#F9F4EE] flex items-center justify-center">
                            <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-[#C17F24]" />
                        </div>
                        <input 
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="What are you cooking today?"
                            className="flex-1 bg-transparent border-none outline-none text-xl text-[#2E2E2E] placeholder:text-gray-400 font-medium"
                        />
                        {loading && <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin text-[#C17F24]" />}
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
                        {/* Empty state / Suggestions */}
                        {!query.trim() && (
                            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Popular Searches</p>
                                    <div className="flex flex-wrap gap-2">
                                        {POPULAR_SEARCHES.map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => setQuery(s)}
                                                className="px-4 py-2 bg-[#F9F4EE] hover:bg-[#C17F24] hover:text-white text-[#2E2E2E] rounded-full text-xs font-semibold transition-all"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Quick Categories</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {QUICK_CATEGORIES.map(cat => (
                                            <button 
                                                key={cat.slug}
                                                onClick={() => {
                                                    onClose()
                                                    router.push(`/category/${cat.slug}`)
                                                }}
                                                className="p-4 bg-white border border-[#e8ddd0] hover:border-[#C17F24] rounded-2xl text-left transition-all group"
                                            >
                                                <p className="text-sm font-bold text-[#2E2E2E] group-hover:text-[#C17F24]">{cat.name}</p>
                                                <p className="text-[10px] text-gray-400">Browse collection &rarr;</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {query.length >= 2 && !loading && results.length === 0 && (
                            <div className="p-16 text-center animate-in fade-in zoom-in-95 duration-300">
                                <div className="w-16 h-16 bg-[#F9F4EE] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FontAwesomeIcon icon={faSearch} className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-[#2E2E2E] font-bold mb-1">No spices found</p>
                                <p className="text-gray-400 text-sm">We couldn&apos;t find anything matching &quot;{query}&quot;</p>
                            </div>
                        )}

                        {/* Search Results */}
                        {results.length > 0 && (
                            <div className="p-3 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3 pt-2">Search Results ({results.length})</p>
                                {results.map((product) => {
                                    const origin = product.metadata?.generated_content?.what_is?.origin || product.metadata?.origin;
                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                onClose()
                                                router.push(`/product/${product.slug}`)
                                            }}
                                            className="w-full text-left p-2 sm:p-3 hover:bg-[#F9F4EE] rounded-2xl flex items-center gap-3 sm:gap-4 group transition-all border border-transparent hover:border-[#e8ddd0]"
                                        >
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-[#e8ddd0] relative">
                                                {product.image_urls?.[0] ? (
                                                    <Image 
                                                        src={product.image_urls[0]} 
                                                        alt={product.name}
                                                        fill
                                                        sizes="(max-width: 640px) 48px, 64px"
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-[#F9F4EE]">
                                                        <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-1 sm:gap-x-2 sm:gap-y-1 mb-0.5">
                                                    <p className="font-bold text-[#2E2E2E] text-xs sm:text-base group-hover:text-[#C17F24] transition-colors truncate max-w-[120px] sm:max-w-none">{product.name}</p>
                                                    {origin && (
                                                        <span className="text-[8px] sm:text-[10px] bg-[#F9F4EE] text-[#C17F24] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter whitespace-nowrap">
                                                            {origin}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1 pr-2">
                                                    {product.metadata?.generated_content?.what_is?.description || product.description}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[#C17F24] font-black text-sm sm:text-base">₹{product.price}</p>
                                                <p className="hidden sm:block text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-[#C17F24]">View Detail</p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
