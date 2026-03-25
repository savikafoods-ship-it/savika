import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldAlt, faEye, faEyeSlash, faExclamationCircle, faSpinner, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginClient() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    const unauthorizedFromMiddleware = searchParams.get('error') === 'unauthorized'

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (loginError) throw loginError
            
            router.push('/admin/dashboard')
            router.refresh()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Invalid credentials'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#111111]">
            <div className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-xl p-8 shadow-2xl">

                {/* Logo */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-2 hover:scale-105 transition-transform">
                        <div className="bg-white rounded-full p-1.5 shadow-sm">
                            <Image src="/logo.png" alt="Savika Logo" width={64} height={64} className="h-10 w-auto object-contain rounded-full" />
                        </div>
                        <div className="flex flex-col justify-center text-left">
                            <span className="text-2xl font-extrabold text-[#C17F24] tracking-tight leading-none mb-0.5">SAVIKA</span>
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
                        <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 mt-0.5 shrink-0" />
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
                            placeholder="savikafoods@gmail.com"
                            className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#262626] text-white text-sm focus:outline-none focus:border-[#C17F24] focus:ring-2 focus:ring-[#C17F24]/20 transition-all placeholder:text-gray-600"
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
                                placeholder="Enter password"
                                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#262626] text-white text-sm focus:outline-none focus:border-[#C17F24] focus:ring-2 focus:ring-[#C17F24]/20 transition-all pr-11 placeholder:text-gray-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C17F24]"
                            >
                                <FontAwesomeIcon icon={showPw ? faEyeSlash : faEye} className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="px-4 py-3 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm flex items-start gap-2">
                            <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#C17F24] hover:bg-[#8B5E16] text-white py-3.5 rounded-lg font-bold text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" /> Verifying...</>
                        ) : (
                            <><FontAwesomeIcon icon={faLockOpen} className="w-4 h-4" /> Sign In to Admin</>
                        )}
                    </button>
                </form>

                <div className="mt-6 border-t border-white/10 pt-6">
                    <p className="text-center text-xs text-gray-500">
                        <Link href="/" className="hover:text-[#C17F24] transition-colors">
                            Return to Storefront
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
