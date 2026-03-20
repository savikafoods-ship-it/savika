'use client'

import { useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginClient() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()

    const unauthorizedFromMiddleware = searchParams.get('error') === 'unauthorized'

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const supabase = createClient()
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        
        if (signInError) {
            setError(signInError.message)
            setLoading(false)
            return
        }

        const { data: adminData } = await supabase.from('admins').select('role').eq('id', data.user.id).single()
        
        if (!adminData || adminData.role !== 'admin') {
            await supabase.auth.signOut()
            setError('Access Denied. This portal is for administrators only.')
            setLoading(false)
            return
        }

        router.push('/admin/dashboard')
        router.refresh()
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212]">
            <div className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 shadow-2xl">

                {/* Logo */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-2 hover:scale-105 transition-transform">
                        <div className="bg-white rounded-full p-1.5 shadow-sm">
                            <Image src="/logo.png" alt="Savika Logo" width={64} height={64} className="h-10 w-auto object-contain rounded-full" />
                        </div>
                        <div className="flex flex-col justify-center text-left">
                            <span className="text-2xl font-extrabold text-[#C47F17] tracking-tight leading-none mb-0.5">SAVIKA</span>
                            <span className="block text-[9px] text-[#8E562E] uppercase tracking-[0.2em] leading-none">Premium Spices</span>
                        </div>
                    </Link>
                    <span className="block text-xs text-gray-500 uppercase tracking-widest mt-0.5">Admin Portal</span>
                </div>

                <h1 className="text-xl font-bold text-white mb-1">Administrator Sign In</h1>
                <p className="text-sm text-gray-500 mb-6">Restricted access. Authorised personnel only.</p>

                {/* Middleware redirect error */}
                {unauthorizedFromMiddleware && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-start gap-2">
                        <i className="fa-solid fa-shield-halved mt-0.5" />
                        <span>You do not have permission to access the admin panel.</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-300 mb-1.5">
                            Admin Email
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="admin@savika.in"
                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#262626] text-white text-sm focus:outline-none focus:border-[#C47F17] focus:ring-2 focus:ring-[#C47F17]/20 transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div>
                        <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-300 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#262626] text-white text-sm focus:outline-none focus:border-[#C47F17] focus:ring-2 focus:ring-[#C47F17]/20 transition-all pr-11 placeholder:text-gray-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C47F17]"
                            >
                                <i className={`fa-regular ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="px-4 py-3 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-start gap-2">
                            <i className="fa-solid fa-circle-exclamation mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#C47F17] hover:bg-[#a86c12] text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <><i className="fa-solid fa-spinner fa-spin" /> Verifying...</>
                        ) : (
                            <><i className="fa-solid fa-lock-open" /> Sign In to Admin</>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-600 mt-6">
                    <Link href="/auth/login" className="hover:text-[#C47F17] transition-colors">
                        ← Back to Customer Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
