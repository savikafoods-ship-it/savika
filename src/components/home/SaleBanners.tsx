import Link from 'next/link'
import { Flame, Star, Diamond, ArrowRight } from 'lucide-react'

interface PromoCard {
  badge: string
  headline: string
  subheading: string
  body: string
  buttonLabel: string
  buttonUrl: string
  icon: 'flame' | 'star' | 'diamond' | 'jar'
}

const iconMap = {
  flame: Flame,
  star: Star,
  diamond: Diamond,
  jar: Flame,
}

const fallbackCards: PromoCard[] = [
  {
    badge: 'Limited Time',
    headline: '50% OFF',
    subheading: 'On all masala blends',
    body: 'Use code SPICE50 at checkout',
    buttonLabel: 'Buy Now',
    buttonUrl: '/shop',
    icon: 'flame',
  },
  {
    badge: 'Fan Favourite',
    headline: '50% OFF',
    subheading: 'Exotic & Rare spices',
    body: 'Desi. Vegan. Powerful.',
    buttonLabel: 'Buy Now',
    buttonUrl: '/shop?category=exotic',
    icon: 'star',
  },
]

async function fetchPromoCards(): Promise<PromoCard[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/content`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return fallbackCards
    const data = await res.json()
    return [
      data.promo_card_1 || fallbackCards[0],
      data.promo_card_2 || fallbackCards[1],
    ]
  } catch {
    return fallbackCards
  }
}

export default async function SaleBanners() {
  const cards = await fetchPromoCards()

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {cards.map((card, i) => {
          const Icon = iconMap[card.icon] || Flame
          const isDark = i === 0
          return (
            <div
              key={i}
              className={`relative rounded-2xl p-6 sm:p-8 overflow-hidden transition-transform duration-300 hover:scale-[1.01] ${
                isDark
                  ? 'bg-gradient-to-br from-[#3B1E08] via-[#5A2D10] to-[#7A3D15]'
                  : 'bg-gradient-to-br from-[#C17F24] via-[#D4A855] to-[#E6C672]'
              }`}
            >
              {/* Background icon */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                <Icon className="w-28 h-28 sm:w-32 sm:h-32" />
              </div>

              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 bg-black/30 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Icon className="w-3 h-3 text-amber-300" />
                {card.badge}
              </span>

              <div className="relative z-10">
                <h3 className="text-white text-4xl sm:text-5xl font-[800] leading-none mb-1">
                  {card.headline}
                </h3>
                <p className={`text-sm font-bold mb-1 ${isDark ? 'text-amber-200' : 'text-white'}`}>
                  {card.subheading}
                </p>
                <p className={`text-sm mb-5 ${isDark ? 'text-amber-300/80' : 'text-white/80'}`}>
                  {card.body}
                </p>
                <Link
                  href={card.buttonUrl}
                  className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105 ${
                    isDark
                      ? 'bg-white text-[#3B1E08] hover:bg-amber-100'
                      : 'bg-white text-[#C17F24] hover:bg-amber-50'
                  }`}
                >
                  {card.buttonLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
