'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginClient() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        router.push('/account/orders')
        router.refresh()
    }

    return (
        <div className="min-h-screen flex bg-[#F9F4EE]">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#C47F17] to-[#8E562E] items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                    <i className="fa-solid fa-pepper-hot text-[20rem] text-[#C47F17]" />
                </div>
                <div className="relative text-center text-white">
                    <h2 className="text-4xl font-bold font-[var(--font-playfair)] mb-4">Welcome Back</h2>
                    <p className="text-white/80 font-[var(--font-poppins)] text-lg">Your spice journey continues.</p>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                            <Image src="/logo.png" alt="Savika Logo" width={64} height={64} className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
                            <div className="flex flex-col justify-center text-left">
                                <span className="text-2xl font-extrabold text-[#C47F17] tracking-tight leading-none mb-0.5">SAVIKA</span>
                                <span className="block text-[9px] text-[#8E562E] uppercase tracking-[0.2em] leading-none">Premium Spices</span>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold font-[var(--font-playfair)] text-[#2E2E2E] mt-4">Sign In</h1>
                        <p className="text-sm text-gray-500 font-[var(--font-poppins)] mt-1">Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-[#C47F17] hover:underline font-semibold">Create one</Link>
                        </p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-[#2E2E2E] font-[var(--font-poppins)] mb-1.5">Email Address</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                className="w-full px-4 py-3 rounded-xl border border-[#e8ddd0] bg-white text-[#2E2E2E] font-[var(--font-poppins)] text-sm focus:outline-none focus:border-[#C47F17] focus:ring-2 focus:ring-[#C47F17]/20 transition-all"
                                placeholder="you@example.com" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-[#2E2E2E] font-[var(--font-poppins)] mb-1.5">Password</label>
                            <div className="relative">
                                <input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                                    className="w-full px-4 py-3 rounded-xl border border-[#e8ddd0] bg-white text-[#2E2E2E] font-[var(--font-poppins)] text-sm focus:outline-none focus:border-[#C47F17] focus:ring-2 focus:ring-[#C47F17]/20 transition-all pr-11"
                                    placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C47F17]">
                                    {showPw ? <i className="fa-regular fa-eye-slash text-sm" /> : <i className="fa-regular fa-eye text-sm" />}
                                </button>
                            </div>
                            <div className="text-right mt-1.5">
                                <Link href="/auth/forgot-password" className="text-xs text-[#C47F17] hover:underline font-[var(--font-poppins)]">Forgot password?</Link>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500 font-[var(--font-poppins)] bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#C47F17] hover:bg-[#a86c12] text-white py-3.5 rounded-xl font-bold font-[var(--font-poppins)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? <i className="fa-solid fa-spinner fa-spin text-sm" /> : null}
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
