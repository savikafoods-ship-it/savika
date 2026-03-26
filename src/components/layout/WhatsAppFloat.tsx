'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919898176667'
const WHATSAPP_MESSAGE = encodeURIComponent('Hi, I need help with my Savika Foods order')

export default function WhatsAppFloat() {
  const pathname = usePathname()
  
  // Hide WhatsApp button on admin routes
  if (pathname?.startsWith('/admin')) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs
                      rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                      transition-opacity duration-200 pointer-events-none">
        Chat with us on WhatsApp
      </div>
      {/* Button */}
      <Link
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Savika Foods on WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500
                   hover:bg-green-600 shadow-lg hover:shadow-xl
                   transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <i className="fa-brands fa-whatsapp text-white text-3xl leading-none" />
      </Link>
      {/* Pulse ring animation */}
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20
                       pointer-events-none" />
    </div>
  )
}
