'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppFloat() {
    const [isVisible, setIsVisible] = useState(false)
    const phoneNumber = '919898176667' // Replace with actual number
    const defaultMessage = 'Hello Savika! I would like to know more about your premium spices.'

    // Show button after slightly scrolling down
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!isVisible) return null

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group"
            aria-label="Chat with us on WhatsApp"
        >
            <MessageCircle className="w-7 h-7" />
            
            {/* Tooltip */}
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-[#2E2E2E] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                Chat with us
                <span className="absolute top-1/2 -translate-y-1/2 -right-1 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-white" />
            </span>
        </a>
    )
}
