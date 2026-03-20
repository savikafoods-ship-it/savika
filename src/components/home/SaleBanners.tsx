import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

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

export default async function SaleBanners() {
    const supabase = await createClient()

    // Fetch the two promo cards from site_content
    const { data: promo1Data } = await supabase.from('site_content').select('value').eq('key', 'promo_card_1').single()
    const { data: promo2Data } = await supabase.from('site_content').select('value').eq('key', 'promo_card_2').single()

    // Fallbacks matching the original static content in case DB is empty yet
    const promo1: PromoCard = promo1Data?.value || {
        badge: 'Limited Time', headline: '50% OFF', subheading: 'On all masala blends', body: 'Use code SPICE50 at checkout', button_label: 'Buy Now', button_url: '/shop?sale=masala', bg_image: null, icon: 'jar'
    }
    const promo2: PromoCard = promo2Data?.value || {
        badge: 'Fan Favourite', headline: '50% OFF', subheading: 'Exotic & Rare spices', body: 'Desi. Vegan. Powerful.', button_label: 'Buy Now', button_url: '/category/exotics-rare', bg_image: null, icon: 'gem'
    }

    const renderCard = (b: PromoCard, fallbackBg: string, badgeIcon: string) => {
        const headlineParts = b.headline.split(' ')
        const mainStat = headlineParts[0] || ''
        const subStat = headlineParts.slice(1).join(' ') || ''

        const bgStyle = b.bg_image ? `url(${b.bg_image}) center/cover no-repeat` : fallbackBg

        // "Icon circle: absolute right-side, semi-transparent white circle, 80px diameter, icon centred"
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
                    <span 
                        className="inline-flex items-center gap-1.5 bg-black/30 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    >
                        <i className={`fa-solid ${badgeIcon} text-[10px]`} />
                        {b.badge}
                    </span>
                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="font-bold text-5xl text-white font-[var(--font-poppins)]">
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
                        <i className="fa-solid fa-bolt text-[12px]" />
                        {b.button_label}
                    </Link>
                </div>

                {/* Icon side */}
                <div className="w-[80px] h-[80px] rounded-full shrink-0 bg-white/15 flex items-center justify-center relative z-10 hidden sm:flex">
                    <i className={`fa-solid fa-${b.icon || 'star'} text-3xl text-white`} />
                </div>
            </div>
        )
    }

    return (
        <section className="py-12 md:py-20 bg-[#F5F0E8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {renderCard(promo1, 'linear-gradient(135deg, #7a4824 0%, #C17F24 100%)', 'fa-fire')}
                    {renderCard(promo2, 'linear-gradient(135deg, #C17F24 0%, #E6A020 100%)', 'fa-star')}
                </div>
            </div>
        </section>
    )
}
