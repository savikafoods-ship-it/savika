import Link from 'next/link'
import { Flame, Star, Zap } from 'lucide-react'

interface PromoCard {
    badge: string
    headline: string
    subheading: string
    body: string
    button_label: string
    button_url: string
    bg_image: string | null
    icon: string
}

// Static fallback data - will be replaced with Appwrite fetch in Phase 2
const promo1: PromoCard = {
    badge: 'Limited Time', headline: '50% OFF', subheading: 'On all masala blends',
    body: 'Use code SPICE50 at checkout', button_label: 'Buy Now',
    button_url: '/shop?sale=masala', bg_image: null, icon: 'jar'
}
const promo2: PromoCard = {
    badge: 'Fan Favourite', headline: '50% OFF', subheading: 'Exotic & Rare spices',
    body: 'Desi. Vegan. Powerful.', button_label: 'Buy Now',
    button_url: '/category/exotics-rare', bg_image: null, icon: 'gem'
}

function renderCard(b: PromoCard, fallbackBg: string, BadgeIcon: typeof Flame) {
    const headlineParts = b.headline.split(' ')
    const mainStat = headlineParts[0] || ''
    const subStat = headlineParts.slice(1).join(' ') || ''
    const bgStyle = b.bg_image ? `url(${b.bg_image}) center/cover no-repeat` : fallbackBg

    return (
        <div
            style={{
                background: bgStyle,
                borderRadius: '1.5rem',
                padding: '2rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '220px',
            }}
            className="min-h-[220px] md:min-h-[280px] shadow-sm hover:scale-105 transition-transform duration-300"
        >
            {/* Decorative circles */}
            <div style={{ position: 'absolute', right: '-2rem', top: '-2rem', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,.12)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: '-0.5rem', bottom: '-1.5rem', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,.08)', pointerEvents: 'none' }} />

            {/* Text side */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="inline-flex items-center gap-1.5 bg-black/30 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    <BadgeIcon className="w-3 h-3" />
                    {b.badge}
                </span>
                <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-bold text-5xl text-white">
                        {mainStat}
                    </span>
                    {subStat && <span className="text-2xl font-bold text-white">{subStat}</span>}
                </div>
                <p className="text-base font-bold text-white/95 mb-1">{b.subheading}</p>
                <p className="text-sm text-white/80 mb-5">{b.body}</p>

                <Link
                    href={b.button_url}
                    className="inline-flex items-center gap-2 bg-white text-[#C17F24] font-semibold text-sm px-6 py-3 rounded-full hover:scale-105 transition-transform duration-300"
                >
                    <Zap className="w-3.5 h-3.5" />
                    {b.button_label}
                </Link>
            </div>

            {/* Icon side */}
            <div className="w-[80px] h-[80px] rounded-full shrink-0 bg-white/15 flex items-center justify-center relative z-10 hidden sm:flex">
                <Star className="w-8 h-8 text-white" />
            </div>
        </div>
    )
}

export default function SaleBanners() {
    return (
        <section className="py-12 md:py-20 bg-[#F5F0E8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {renderCard(promo1, 'linear-gradient(135deg, #7a4824 0%, #C17F24 100%)', Flame)}
                    {renderCard(promo2, 'linear-gradient(135deg, #C17F24 0%, #E6A020 100%)', Star)}
                </div>
            </div>
        </section>
    )
}
