'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, CheckCircle } from 'lucide-react'
import { account } from '@/lib/appwrite/client'
import { ID } from 'appwrite'

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
        setError('')
        try {
            await account.create(ID.unique(), email, password, name)
            // Auto-login after signup
            await account.createEmailPasswordSession(email, password)
            setSuccess(true)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create account'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8] px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#2E2E2E] mb-2">Account Created!</h2>
                    <p className="text-gray-500 text-sm">Welcome to Savika Foods, {name}.</p>
                    <Link href="/account" className="mt-6 inline-block text-[#C17F24] font-semibold hover:underline">Go to My Account</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex bg-[#F5F0E8]">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#8B5E16] to-[#C17F24] items-center justify-center p-12 relative overflow-hidden">
                <div className="relative text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Join Savika</h2>
                    <p className="text-white/80 text-lg">Pure spices. Premium experience.</p>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                            <Image src="/logo.png" alt="Savika Logo" width={64} height={64} className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
                            <div className="flex flex-col justify-center text-left">
                                <span className="text-2xl font-extrabold text-[#C17F24] tracking-tight leading-none mb-0.5">SAVIKA</span>
                                <span className="block text-[9px] text-[#8E562E] uppercase tracking-[0.2em] leading-none">Premium Spices</span>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold text-[#2E2E2E] mt-4">Create Account</h1>
                        <p className="text-sm text-gray-500 mt-1">Already registered?{' '}
                            <Link href="/auth/login" className="text-[#C17F24] hover:underline font-semibold">Sign in</Link>
                        </p>
                    </div>
                    <form onSubmit={handleSignup} className="space-y-5">
                        {[
                            { id: 'name', label: 'Full Name', type: 'text', value: name, setter: setName, placeholder: 'Priya Sharma' },
                            { id: 'email', label: 'Email Address', type: 'email', value: email, setter: setEmail, placeholder: 'you@example.com' },
                            { id: 'password', label: 'Password', type: 'password', value: password, setter: setPassword, placeholder: '8+ characters' },
                        ].map((field) => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="block text-sm font-semibold text-[#2E2E2E] mb-1.5">{field.label}</label>
                                <input id={field.id} type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)} required
                                    className="w-full px-4 py-3 rounded-lg border border-[#e8ddd0] bg-white text-[#2E2E2E] text-sm focus:outline-none focus:border-[#C17F24] focus:ring-2 focus:ring-[#C17F24]/20 transition-all"
                                    placeholder={field.placeholder} minLength={field.id === 'password' ? 8 : undefined} />
                            </div>
                        ))}
                        {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#C17F24] hover:bg-[#8B5E16] text-white py-3.5 rounded-lg font-bold transition-all duration-300 hover:scale-[1.02] disabled:opacity-60">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Creating Account...' : 'Create My Account'}
                        </button>
                        <p className="text-xs text-gray-400 text-center">By signing up, you agree to our{' '}
                            <Link href="/terms" className="text-[#C17F24] hover:underline">Terms</Link> and{' '}
                            <Link href="/privacy" className="text-[#C17F24] hover:underline">Privacy Policy</Link>.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
