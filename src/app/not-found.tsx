import Link from 'next/link'
import { AlertTriangle, Home, Search } from 'lucide-react'

export const metadata = {
    title: 'Page Not Found - Savika Foods',
}

export default function NotFound() {
    return (
        <main className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto animate-fadeUp">
                <div className="w-24 h-24 bg-[#FFF0DC] rounded-full flex items-center justify-center mx-auto mb-8">
                    <AlertTriangle className="w-12 h-12 text-[#C47F17]" />
                </div>
                <h1 className="text-5xl font-black text-[#2E2E2E] tracking-tight mb-2">404</h1>
                <h2 className="text-2xl font-bold text-[#2E2E2E] mb-4">Spice Not Found</h2>
                <p className="text-[#5A5A5A] mb-8 leading-relaxed">
                    Oops! It looks like you've wandered off the spice route. The flavor you're looking for doesn't exist or has moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/" className="inline-flex items-center justify-center gap-2 bg-[#C17F24] hover:bg-[#8B5E16] text-white px-6 py-3 rounded-xl font-bold transition-all">
                        <Home className="w-5 h-5" /> Back to Store
                    </Link>
                    <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-white border border-[#C17F24] text-[#C17F24] hover:bg-[#FFF0DC] px-6 py-3 rounded-xl font-bold transition-all">
                        <Search className="w-5 h-5" /> Browse Catalog
                    </Link>
                </div>
            </div>
        </main>
    )
}
