'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faTrash, faSpinner, faStar, faFilter, faMessage } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

export default function ReviewModerationPage() {
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        setLoading(true)
        try {
            let query = supabase
                .from('reviews')
                .select('*, products(name, image_urls), profiles(full_name)')
                .order('created_at', { ascending: false })

            const { data, error } = await query
            if (error) throw error
            setReviews(data || [])
        } catch (err) {
            console.error('Error fetching reviews:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (id: string, action: 'delete') => {
        try {
            if (action === 'delete') {
                if (!window.confirm('Are you sure you want to permanently delete this review?')) return
                const { error } = await supabase.from('reviews').delete().eq('id', id)
                if (error) throw error
            }
            setReviews(reviews.filter(r => r.id !== id))
        } catch (err) {
            console.error(`Error performing ${action}:`, err)
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Review Management</h1>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage customer feedback & social proof</p>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-[#C17F24]" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-[#1A1A1A] rounded-3xl p-12 text-center border border-white/5">
                    <FontAwesomeIcon icon={faMessage} className="text-gray-800 text-4xl mb-4" />
                    <p className="text-gray-500 font-bold italic">No reviews found in this category.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-[#1A1A1A] rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row gap-6 relative overflow-hidden transition-all hover:border-white/10 group">
                            {/* Product Info */}
                            <div className="w-full md:w-48 shrink-0 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative shrink-0">
                                    <Image 
                                        src={getProductImageUrl(review.products?.image_urls?.[0])} 
                                        alt="" 
                                        fill 
                                        className="object-cover" 
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-[#C17F24] uppercase tracking-widest truncate">{review.products?.name || `Product: ${review.product_id}`}</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase truncate">By {review.profiles?.full_name || review.user_name || 'Guest User'}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FontAwesomeIcon 
                                            key={i} 
                                            icon={faStar} 
                                            className={`text-[10px] ${i < review.rating ? 'text-amber-500' : 'text-gray-800'}`} 
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed italic">"{review.comment}"</p>
                                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                                    Posted on {new Date(review.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleAction(review.id, 'delete')}
                                    className="h-10 w-10 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center p-2.5 cursor-pointer shadow-lg active:scale-95"
                                    title="Delete Review"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
