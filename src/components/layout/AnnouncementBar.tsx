'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true)
    const [message, setMessage] = useState('Free shipping on all orders over ₹999! 🚚')

    // Optional: Hide bar if user previously dismissed it
    useEffect(() => {
        if (localStorage.getItem('savika_announcement_dismissed')) {
            setIsVisible(false)
        }
    }, [])

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem('savika_announcement_dismissed', 'true')
    }

    if (!isVisible) return null

    return (
        <div className="bg-[#111111] text-white py-2 px-4 relative z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-center relative">
                <p className="text-xs sm:text-sm font-medium text-center pr-8">
                    {message}
                </p>
                <button 
                    onClick={handleDismiss}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    aria-label="Dismiss announcement"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
