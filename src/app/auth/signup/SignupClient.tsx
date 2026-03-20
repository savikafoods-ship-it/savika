'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function SignupClient() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name, email }
            }
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
                        <i className="fa-solid fa-circle-check text-4xl text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold font-[var(--font-playfair)] text-[#2E2E2E] mb-2">Check your email!</h2>
                    <p className="text-gray-500 font-[var(--font-poppins)] text-sm">We've sent a confirmation link to <strong>{email}</strong>.</p>
                    <Link href="/auth/login" className="mt-6 inline-block text-[#C47F17] font-[var(--font-poppins)] font-semibold hover:underline">Back to Sign In →</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex bg-[#F9F4EE]">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#8E562E] to-[#C47F17] items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                    <i className="fa-solid fa-pepper-hot text-[20rem] text-[#C47F17]" />
                </div>
                <div className="relative text-center text-white">
                    <h2 className="text-4xl font-bold font-[var(--font-playfair)] mb-4">Join Savika</h2>
                    <p className="text-white/80 font-[var(--font-poppins)] text-lg">Pure spices. Premium experience.</p>
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
                        <h1 className="text-3xl font-bold font-[var(--font-playfair)] text-[#2E2E2E] mt-4">Create Account</h1>
                        <p className="text-sm text-gray-500 font-[var(--font-poppins)] mt-1">Already registered?{' '}
                            <Link href="/auth/login" className="text-[#C47F17] hover:underline font-semibold">Sign in</Link>
                        </p>
                    </div>
                    <form onSubmit={handleSignup} className="space-y-5">
                        {[
                            { id: 'name', label: 'Full Name', type: 'text', value: name, setter: setName, placeholder: 'Priya Sharma' },
                            { id: 'email', label: 'Email Address', type: 'email', value: email, setter: setEmail, placeholder: 'you@example.com' },
                            { id: 'password', label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: '8+ characters' },
                        ].map((field) => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="block text-sm font-semibold text-[#2E2E2E] font-[var(--font-poppins)] mb-1.5">{field.label}</label>
                                <input id={field.id} type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)} required
                                    className="w-full px-4 py-3 rounded-xl border border-[#e8ddd0] bg-white text-[#2E2E2E] font-[var(--font-poppins)] text-sm focus:outline-none focus:border-[#C47F17] focus:ring-2 focus:ring-[#C47F17]/20 transition-all"
                                    placeholder={field.placeholder} minLength={field.id === 'password' ? 8 : undefined} />
                            </div>
                        ))}
                        {error && <p className="text-sm text-red-500 font-[var(--font-poppins)] bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#C47F17] hover:bg-[#a86c12] text-white py-3.5 rounded-xl font-bold font-[var(--font-poppins)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60">
                            {loading && <i className="fa-solid fa-spinner fa-spin text-sm" />}
                            {loading ? 'Creating Account...' : 'Create My Account →'}
                        </button>
                        <p className="text-xs text-gray-400 text-center font-[var(--font-poppins)]">By signing up, you agree to our{' '}
                            <Link href="/terms" className="text-[#C47F17] hover:underline">Terms</Link> and{' '}
                            <Link href="/privacy" className="text-[#C47F17] hover:underline">Privacy Policy</Link>.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
