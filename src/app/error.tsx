'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ServerCrash, RotateCcw } from 'lucide-react'

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Savika Fatal Error:', error)
    }, [error])

    return (
        <main className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto animate-fadeUp">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ServerCrash className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-4">Something went wrong!</h1>
                <p className="text-[#5A5A5A] mb-8 leading-relaxed">
                    We've encountered an unexpected issue while preparing your spices. Our team has been notified.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 bg-[#C17F24] hover:bg-[#8B5E16] text-white px-6 py-3 rounded-xl font-bold transition-all"
                    >
                        <RotateCcw className="w-5 h-5" /> Try Again
                    </button>
                    <Link href="/" className="inline-flex items-center justify-center gap-2 bg-white border border-[#C17F24] text-[#C17F24] hover:bg-[#FFF0DC] px-6 py-3 rounded-xl font-bold transition-all">
                        Go Home
                    </Link>
                </div>
            </div>
        </main>
    )
}
