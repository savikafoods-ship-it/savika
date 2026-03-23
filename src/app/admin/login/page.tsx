import type { Metadata } from 'next'
import { Suspense } from 'react'
import AdminLoginClient from './AdminLoginClient'

export const metadata: Metadata = {
    title: 'Admin Login | Savika',
    robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#111111] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-[#C17F24] animate-spin"></div></div>}>
            <AdminLoginClient />
        </Suspense>
    )
}
