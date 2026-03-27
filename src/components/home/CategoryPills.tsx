import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Flame, CookingPot, Package, Gift, Gem, Sprout, Store, HelpCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Category {
    id: string
    name: string
    slug: string
    image_url?: string
    sort_order?: number
}

const iconMap: Record<string, LucideIcon> = {
    'whole': Flame,
    'ground': CookingPot,
    'powder': CookingPot,
    'blend': Package,
    'masala': Package,
    'gift': Gift,
    'rare': Gem,
    'exotic': Gem,
    'organic': Sprout,
}

const colorMap = [
    { bg: '#FFF0DC', iconColor: '#C17F24' },
    { bg: '#FFFBEA', iconColor: '#D4A017' },
    { bg: '#FFF5F0', iconColor: '#D4562E' },
    { bg: '#F0FFF4', iconColor: '#2ECC71' },
    { bg: '#F8F0FF', iconColor: '#9B59B6' },
    { bg: '#F0FFF8', iconColor: '#1ABC9C' },
]

async function getCategories() {
    try {
        const supabase = await createClient()
        const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true })
        return data || []
    } catch {
        return []
    }
}

export default async function CategoryPills() {
    const dbCategories = await getCategories()
    
    const displayCategories = dbCategories.map((cat: Category, i: number) => {
        const nameLower = cat.name.toLowerCase()
        let Icon = HelpCircle
        for (const [key, icon] of Object.entries(iconMap)) {
            if (nameLower.includes(key)) {
                Icon = icon
                break
            }
        }
        
        const colors = colorMap[i % colorMap.length]
        return {
            ...cat,
            Icon,
            ...colors
        }
    })
    return (
        <section className="bg-transparent border-y border-[#F0E8DC] py-6 scroll-mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-start justify-start md:justify-center gap-6 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-2 snap-x snap-mandatory">
                    {displayCategories.map((cat) => {
                        const Icon = cat.Icon
                        return (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="flex flex-col items-center gap-3 shrink-0 group snap-start"
                                style={{ minWidth: '85px' }}
                            >
                                <div
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-[#C17F24] transition-all duration-200 group-hover:scale-105 shadow-sm"
                                    style={{ backgroundColor: cat.bg }}
                                >
                                    {cat.image_url ? (
                                        <img src={cat.image_url} alt={cat.name} className="w-10 h-10 object-contain" />
                                    ) : (
                                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: cat.iconColor }} />
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] sm:text-xs font-semibold text-[#2E2E2E] group-hover:text-[#C17F24] transition-colors leading-tight">{cat.name}</p>
                                    <p className="text-[9px] sm:text-[10px] text-[#8E562E] mt-0.5">Shop now</p>
                                </div>
                            </Link>
                        )
                    })}

                    {/* Shop All pill */}
                    <Link
                        href="/shop"
                        className="flex flex-col items-center gap-3 shrink-0 group snap-start"
                        style={{ minWidth: '85px' }}
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
