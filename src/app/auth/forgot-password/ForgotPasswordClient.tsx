'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordClient() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        })
        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        setSuccess(true)
        setLoading(false)
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F4EE] px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-envelope text-4xl text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold font-[var(--font-playfair)] text-[#2E2E2E] mb-2">Check your email</h2>
                    <p className="text-gray-500 font-[var(--font-poppins)] text-sm">We've sent password reset instructions to <strong>{email}</strong>.</p>
                    <Link href="/auth/login" className="mt-6 inline-block text-[#C47F17] font-[var(--font-poppins)] font-semibold hover:underline">Back to Sign In →</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9F4EE] p-6">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                    <Image src="/logo.png" alt="Savika" width={48} height={48} className="mx-auto mb-4" />
                    <h1 className="text-2xl font-bold font-[var(--font-playfair)]">Reset Password</h1>
                    <p className="text-sm text-gray-500 mt-2">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-1">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C47F17] focus:ring-2 focus:ring-[#C47F17]/20"
                            placeholder="you@example.com" />
                    </div>
                    {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}
                    <button type="submit" disabled={loading}
                        className="w-full bg-[#C47F17] hover:bg-[#a86c12] text-white py-3 rounded-xl font-bold transition-transform hover:scale-[1.02] disabled:opacity-60">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <div className="text-center mt-4">
                        <Link href="/auth/login" className="text-sm text-[#C47F17] hover:underline">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
