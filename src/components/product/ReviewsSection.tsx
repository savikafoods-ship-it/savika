'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarFull, faStarHalfAlt, faMessage, faCircleCheck, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons'
import { createClient } from '@/lib/supabase/client'

interface Review {
    id: string
    rating: number
    comment: string
    created_at: string
    user_id: string
    user_name?: string
    profiles?: {
        full_name: string
    }
}

interface ReviewsSectionProps {
    productId: string
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [guestName, setGuestName] = useState('')
    const [message, setMessage] = useState('')
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()
        fetchReviews()
    }, [productId])

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, profiles(full_name)')
                .eq('product_id', productId)
                .eq('is_approved', true)
                .order('created_at', { ascending: false })

            if (error) throw error
            setReviews(data || [])
        } catch (err) {
            console.error('Error fetching reviews:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setSubmitting(true)
        setMessage('')

        try {
            const reviewData: any = {
                product_id: productId,
                rating,
                comment,
                is_approved: false // Moderation required
            }

            if (user) {
                reviewData.user_id = user.id
            } else {
                // For guests, we can store the name in the user_name column 
                // and leave user_id null (assuming schema allows)
                reviewData.user_name = guestName || 'Anonymous Lover'
            }

            const { error } = await supabase
                .from('reviews')
                .insert(reviewData)

            if (error) throw error
            setMessage('Success! Your review has been submitted for moderation.')
            setComment('')
            setGuestName('')
            setRating(5)
        } catch (err: any) {
            setMessage(`Error: ${err.message}`)
        } finally {
            setSubmitting(false)
        }
    }

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0

    const renderStars = (num: number) => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            if (i <= num) stars.push(<FontAwesomeIcon key={i} icon={faStarFull} className="text-amber-500" />)
            else if (i - 0.5 <= num) stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-amber-500" />)
            else stars.push(<FontAwesomeIcon key={i} icon={faStarEmpty} className="text-gray-300" />)
        }
        return stars
    }

    if (loading) return (
        <div className="py-20 text-center">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-amber-600 text-3xl" />
        </div>
    )

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto border-t border-gray-100 mt-16">
            <div className="grid lg:grid-cols-3 gap-12">
                {/* Left: Summary */}
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-black text-[#2E2E2E] uppercase tracking-tighter mb-6">Customer Love</h2>
                    <div className="bg-[#F5F0E8] rounded-3xl p-8 text-center border border-[#EBE3D5]">
                        <div className="text-6xl font-black text-[#C17F24] mb-2">{averageRating}</div>
                        <div className="flex justify-center gap-1 mb-4">
                            {renderStars(Number(averageRating))}
                        </div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Based on {reviews.length} Reviews</p>
                    </div>

                    {/* Submit Form */}
                    <div className="mt-8">
                        <h3 className="text-sm font-black text-[#2E2E2E] uppercase tracking-widest mb-4">Leave a Review</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!user && (
                                <input 
                                    type="text"
                                    placeholder="Your Full Name"
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#C17F24] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    required
                                />
                            )}
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <button 
                                        key={i} 
                                        type="button" 
                                        onClick={() => setRating(i)}
                                        className={`text-xl transition-transform hover:scale-110 ${i <= rating ? 'text-amber-500' : 'text-gray-300'}`}
                                    >
                                        <FontAwesomeIcon icon={i <= rating ? faStarFull : faStarEmpty} />
                                    </button>
                                ))}
                            </div>
                            <textarea 
                                className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#C17F24] focus:border-transparent outline-none transition-all placeholder:text-gray-300 min-h-[120px]"
                                placeholder="Tell us about your experience with these spices..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full bg-[#C17F24] text-white py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#A66D1F] transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Post Review'}
                            </button>
                            {message && (
                                <p className={`text-[11px] font-black uppercase text-center mt-2 ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                                    <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Right: Reviews List */}
                <div className="lg:col-span-2 space-y-8">
                    {reviews.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-400">
                            <p className="text-lg font-bold italic mb-2">No reviews yet.</p>
                            <p className="text-xs uppercase tracking-widest font-black">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm font-black text-[#2E2E2E] uppercase">{review.profiles?.full_name || review.user_name || 'Anonymous Lover'}</p>
                                            <div className="flex gap-0.5 mt-1">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed italic">"{review.comment}"</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verified Spice Lover</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
