import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Gift, Leaf, CheckCircle } from 'lucide-react'

const stats = [
    { value: '50+', label: 'Spice Varieties' },
    { value: '10k+', label: 'Happy Customers' },
    { value: '4.9', label: 'Avg. Rating' },
]

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-stone-900 min-h-[600px] lg:min-h-[700px] flex items-center">
            {/* Background Image */}
            <Image
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=2000"
                alt="Savika Premium Indian Spices"
                fill
                className="object-cover"
                priority={true}
                unoptimized={true}
            />
            {/* Brown Overlay */}
            <div className="absolute inset-0 bg-[#2D1B0B]/75 mix-blend-multiply z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A120B] via-transparent to-transparent opacity-80 z-0" />

            <div className="section-wrap relative z-10 py-16 sm:py-24">
                <div className="grid-hero items-center">

                    {/* LEFT */}
                    <div style={{ order: 1 }}>
                        {/* Eyebrow badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[10px] sm:text-xs font-bold text-amber-100 tracking-widest uppercase">
                                India&apos;s #1 Premium Spice Brand
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
                            Your Kitchen.<br />
                            <span className="text-amber-500 italic relative">
                                Your Spice.
                            </span>
                        </h1>

                        {/* Sub */}
                        <p className="text-stone-200 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                            Hand-picked from India&apos;s finest spice gardens.
                            Freshly ground, artisan-blended, and delivered straight to your door.{' '}
                            <strong className="text-white">Taste real purity.</strong>
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 mb-10">
                            <Link href="/shop" className="btn-gold flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                Explore Spice Range
                            </Link>
                            <Link 
                                href="/category/gift-packs" 
                                className="bg-white/20 text-white border border-white/40 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/30 transition-all flex items-center gap-2 backdrop-blur-sm"
                            >
                                <Gift className="w-4 h-4" />
                                Gift Sets
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-10 border-t border-white/10 pt-8">
                            {stats.map((s) => (
                                <div key={s.label}>
                                    <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
                                    <p className="text-[10px] sm:text-xs text-stone-400 font-bold uppercase tracking-wider mt-1">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Visual - Transparent Card for Premium Feel */}
                    <div className="hidden lg:flex order-2 justify-center items-center relative py-8">
                        <div className="w-[360px] h-[360px] rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center relative shadow-2xl">
                            <div className="text-center">
                                <div className="w-32 h-32 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                                    <span className="text-5xl">🌶️</span>
                                </div>
                                <p className="text-xl font-bold text-white mb-1">Kashmiri Mirch</p>
                                <p className="text-sm text-stone-300">Whole - Single Origin</p>
                            </div>

                            {/* Floating badge - top right */}
                            <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
                                <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center">
                                    <span className="text-lg">🧂</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Pure Turmeric</p>
                                    <p className="text-[10px] text-stone-400 font-medium whitespace-nowrap">Cold-ground</p>
                                </div>
                            </div>

                            {/* Floating badge - bottom left */}
                            <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
                                <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">FSSAI Certified</p>
                                    <p className="text-[10px] text-stone-400 font-medium whitespace-nowrap">Lab tested</p>
                                </div>
                            </div>
                        </div>

                        {/* Natural tag */}
                        <div className="animate-float absolute bottom-4 right-12 bg-amber-600/90 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-md">
                            <Leaf className="w-3 h-3" />
                            100% NATURAL SPICES
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
