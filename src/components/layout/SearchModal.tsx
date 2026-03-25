'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
                    .select('id, name, description, price, slug')
                    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
                    .eq('is_active', true)
                    .limit(8)

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

    return (
        <div className="fixed inset-0 z-[100] flex flex-col pt-20 px-4 bg-[#F5F0E8]/95 backdrop-blur-sm">
            <div className="max-w-2xl w-full mx-auto relative animate-in fade-in slide-in-from-top-4 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute -top-12 right-0 bg-white/50 hover:bg-white text-[#2E2E2E] p-2 rounded-full transition-colors"
                >
                    <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#e8ddd0]">
                    <div className="p-4 flex items-center gap-3 border-b border-[#e8ddd0]">
                        <FontAwesomeIcon icon={faSearch} className="w-5 h-5 text-gray-400" />
                        <input 
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for spices, blends, categories..."
                            className="flex-1 bg-transparent border-none outline-none text-lg text-[#2E2E2E] placeholder:text-gray-400"
                        />
                        {loading && <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin text-[#C17F24]" />}
                    </div>

                    {query.length >= 2 && !loading && results.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No products found matching &quot;{query}&quot;
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="p-2">
                            {results.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => {
                                        onClose()
                                        router.push(`/product/${product.slug}`)
                                    }}
                                    className="w-full text-left p-3 hover:bg-[#F9F4EE] rounded-xl flex items-center justify-between group transition-colors"
                                >
                                    <div>
                                        <p className="font-bold text-[#2E2E2E]">{product.name}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                                    </div>
                                    <span className="text-[#C17F24] font-bold">₹{product.price}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
