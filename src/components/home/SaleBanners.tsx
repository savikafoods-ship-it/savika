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
  imageUrl?: string
  bgStart?: string
  bgEnd?: string
  textColor?: string
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
    bgStart: '#3B1E08',
    bgEnd: '#7A3D15',
    textColor: '#FFFFFF',
  },
  {
    badge: 'Fan Favourite',
    headline: '50% OFF',
    subheading: 'Exotic & Rare spices',
    body: 'Desi. Vegan. Powerful.',
    buttonLabel: 'Buy Now',
    buttonUrl: '/shop?category=exotic',
    icon: 'star',
    bgStart: '#C17F24',
    bgEnd: '#E6C672',
    textColor: '#FFFFFF',
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
          const bgStyle = {
            background: `linear-gradient(to bottom right, ${card.bgStart || (i === 0 ? '#3B1E08' : '#C17F24')}, ${card.bgEnd || (i === 0 ? '#7A3D15' : '#E6C672')})`,
            color: card.textColor || '#FFFFFF'
          }

          return (
            <div
              key={i}
              style={bgStyle}
              className="relative rounded-2xl p-6 sm:p-8 overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
            >
              {/* Background Art (Image or Icon) */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none scale-110 sm:scale-125">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt="" className="w-28 h-28 sm:w-36 sm:h-36 object-contain" />
                ) : (
                  <Icon className="w-28 h-28 sm:w-32 sm:h-32" />
                )}
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Icon className="w-3 h-3" style={{ color: i === 0 ? '#FCD34D' : '#FDE68A' }} />
                  {card.badge}
                </span>

                <h3 className="text-4xl sm:text-5xl font-[800] leading-none mb-1">
                  {card.headline}
                </h3>
                <p className="text-sm font-bold mb-1 opacity-90">
                  {card.subheading}
                </p>
                <p className="text-sm mb-5 opacity-80 max-w-[240px]">
                  {card.body}
                </p>
                <Link
                  href={card.buttonUrl}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
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
