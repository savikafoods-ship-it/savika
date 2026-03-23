import Link from 'next/link'
import { Flame, CookingPot, Package, Gift, Gem, Sprout, Store } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const categories: { icon: LucideIcon; label: string; sub: string; slug: string; bg: string; iconColor: string }[] = [
    { icon: Flame, label: 'Whole Spices', sub: '24+ varieties', slug: 'whole-spices', bg: '#FFF0DC', iconColor: '#C17F24' },
    { icon: CookingPot, label: 'Ground & Powdered', sub: '18+ products', slug: 'ground-powdered', bg: '#FFFBEA', iconColor: '#D4A017' },
    { icon: Package, label: 'Blends & Masalas', sub: '12+ blends', slug: 'blends-masalas', bg: '#FFF5F0', iconColor: '#D4562E' },
    { icon: Gift, label: 'Gift Packs', sub: 'Premium sets', slug: 'gift-packs', bg: '#F0FFF4', iconColor: '#2ECC71' },
    { icon: Gem, label: 'Exotics & Rare', sub: '8 curated picks', slug: 'exotics-rare', bg: '#F8F0FF', iconColor: '#9B59B6' },
    { icon: Sprout, label: 'Organic Range', sub: 'Farm-certified', slug: 'whole-spices', bg: '#F0FFF8', iconColor: '#1ABC9C' },
]

export default function CategoryPills() {
    return (
        <section className="bg-transparent border-y border-[#F0E8DC] py-6 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-start justify-center gap-4 overflow-x-auto scrollbar-hide pb-2">
                    {categories.map((cat) => {
                        const Icon = cat.icon
                        return (
                            <Link
                                key={cat.slug + cat.label}
                                href={`/category/${cat.slug}`}
                                className="flex flex-col items-center gap-2 shrink-0 group"
                                style={{ minWidth: '80px' }}
                            >
                                <div
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-[#C17F24] transition-all duration-200 group-hover:scale-105 shadow-sm"
                                    style={{ backgroundColor: cat.bg }}
                                >
                                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: cat.iconColor }} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] sm:text-xs font-semibold text-[#2E2E2E] group-hover:text-[#C17F24] transition-colors leading-tight">{cat.label}</p>
                                    <p className="text-[9px] sm:text-[10px] text-[#8E562E] mt-0.5">{cat.sub}</p>
                                </div>
                            </Link>
                        )
                    })}

                    {/* Shop All pill */}
                    <Link
                        href="/shop"
                        className="flex flex-col items-center gap-2 shrink-0 group"
                        style={{ minWidth: '80px' }}
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C17F24] flex items-center justify-center group-hover:bg-[#8B5E16] transition-colors duration-200 group-hover:scale-105 shadow-lg shadow-[#C17F24]/25">
                            <Store className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="text-center">
                            <p className="text-[11px] sm:text-xs font-semibold text-[#C17F24] leading-tight">Shop All</p>
                            <p className="text-[9px] sm:text-[10px] text-[#8E562E] mt-0.5">All products</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
