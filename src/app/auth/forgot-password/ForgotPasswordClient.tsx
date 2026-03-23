'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Loader2 } from 'lucide-react'

export default function ForgotPasswordClient() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setSuccess(true)
            } else {
                const data = await res.json()
                setError(data.error || 'Failed to send reset email')
            }
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <Mail className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">Check your email</h2>
                    <p className="text-gray-500 text-sm">We&apos;ve sent password reset instructions to <strong>{email}</strong>.</p>
                    <Link href="/auth/login" className="mt-6 inline-block text-[#C17F24] font-semibold hover:underline">Back to Sign In</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] p-6">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                    <Image src="/logo.png" alt="Savika" width={48} height={48} className="mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-[#2E2E2E]">Reset Password</h1>
                    <p className="text-sm text-gray-500 mt-2">Enter your email and we&apos;ll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-1">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C17F24] focus:ring-2 focus:ring-[#C17F24]/20"
                            placeholder="you@example.com" />
                    </div>
                    {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>}
                    <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#C17F24] hover:bg-[#8B5E16] text-white py-3 rounded-lg font-bold transition-transform hover:scale-[1.02] disabled:opacity-60">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <div className="text-center mt-4">
                        <Link href="/auth/login" className="text-sm text-[#C17F24] hover:underline">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
