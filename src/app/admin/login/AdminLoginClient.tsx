'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faShieldAlt, 
    faEye, 
    faEyeSlash, 
    faExclamationCircle, 
    faSpinner, 
    faLock,
    faArrowLeft 
} from '@fortawesome/free-solid-svg-icons'
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
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
            {/* Premium Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src="/images/admin-login-bg.png" 
                    alt="Spice Background" 
                    fill 
                    priority
                    className="object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-transparent" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />
            </div>

            {/* Content Container */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-4"
            >
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="bg-white rounded-full p-2 shadow-[0_0_20px_rgba(193,127,36,0.3)] group-hover:shadow-[0_0_30px_rgba(193,127,36,0.5)] transition-all duration-500">
                                <Image src="/logo.png" alt="Savika Logo" width={80} height={80} className="h-12 w-auto object-contain rounded-full" />
                            </div>
                            <div className="flex flex-col justify-center text-left">
                                <span className="text-3xl font-extrabold text-[#C17F24] tracking-tighter leading-none mb-1">SAVIKA</span>
                                <span className="block text-[10px] text-white/60 uppercase tracking-[0.3em] leading-none font-medium">Premium Spices</span>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Glassmorphism Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    {/* Subtle Internal Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C17F24]/10 rounded-full blur-3xl group-hover:bg-[#C17F24]/20 transition-all duration-700" />
                    
                    <div className="relative z-10">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
                            <p className="text-sm text-white/50">Restricted access for Savika administrators.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {unauthorizedFromMiddleware && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="mb-6 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3 shadow-lg"
                                >
                                    <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>Access Denied: You do not have permission to view this section.</span>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mb-6 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3 shadow-lg"
                                >
                                    <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Account Email</label>
                                <div className="relative group/input">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@savikafoods.in"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-[#C17F24] focus:ring-4 focus:ring-[#C17F24]/10 transition-all duration-300 placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Key Password</label>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPw(!showPw)}
                                        className="text-[10px] text-[#C17F24] hover:text-white transition-colors uppercase tracking-wider font-bold"
                                    >
                                        {showPw ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-[#C17F24] focus:ring-4 focus:ring-[#C17F24]/10 transition-all duration-300 placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full overflow-hidden rounded-2xl bg-[#C17F24] p-[1.5px] shadow-[0_0_20px_rgba(193,127,36,0.2)] hover:shadow-[0_0_30px_rgba(193,127,36,0.4)] transition-all duration-500 disabled:opacity-50"
                            >
                                <div className="relative bg-[#C17F24] group-hover:bg-[#8B5E16] transition-colors rounded-[14.5px] py-4 flex items-center justify-center gap-3">
                                    {loading ? (
                                        <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin text-white" />
                                    ) : (
                                        <>
                                            <span className="font-bold text-sm text-white tracking-wide">AUTHENTICATE</span>
                                            <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        <div className="mt-8 flex justify-center">
                            <Link 
                                href="/" 
                                className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white transition-all group"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                <span>Return to Savika Store</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Credits */}
                <p className="mt-8 text-center text-[10px] text-white/20 uppercase tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} Savika Spices & Foods &bull; Internal System
                </p>
            </motion.div>
        </div>
    )
}
