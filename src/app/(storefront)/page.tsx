import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import CategoryPills from '@/components/home/CategoryPills'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import SaleBanners from '@/components/home/SaleBanners'
import WhySavika from '@/components/home/WhySavika'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import BestSellers from '@/components/home/BestSellers'
import InstagramGrid from '@/components/home/InstagramGrid'
import TrustBadges from '@/components/home/TrustBadges'

export const metadata: Metadata = {
    title: 'Savika | Premium Indian Spices Online – Pure, Authentic, Delivered',
    description: 'Buy premium Indian spices online. 100% pure whole spices, ground masalas, and artisan blends. FSSAI certified. Fast delivery across India. Shop Savika.',
    keywords: 'premium Indian spices online, buy spices online India, pure spices India, best garam masala India, authentic masala online',
    openGraph: {
        title: 'Savika – Premium Indian Spices',
        description: 'Pure, hand-picked spices from the heart of India. Delivered to your door.',
        url: 'https://savikafoods.in',
        siteName: 'Savika',
        images: [{ url: 'https://savikafoods.in/og-image.jpg', width: 1200, height: 630 }],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Savika – Premium Indian Spices',
        description: 'Pure, hand-picked spices from the heart of India.',
        images: ['https://savikafoods.in/og-image.jpg'],
    },
    alternates: {
        canonical: 'https://savikafoods.in',
        languages: { 'en-IN': 'https://savikafoods.in' },
    },
}

export default function HomePage() {
    return (
        <>
            {/* JSON-LD Organization Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Organization',
                        name: 'Savika',
                        url: 'https://savikafoods.in',
                        logo: 'https://savikafoods.in/logo.png',
                        sameAs: [
                            'https://www.instagram.com/savikafoods.in',
                            'https://www.facebook.com/savikafoods.in',
                        ],
                        contactPoint: {
                            '@type': 'ContactPoint',
                            telephone: '+91-98981-76667',
                            contactType: 'customer service',
                            areaServed: 'IN',
                            availableLanguage: ['English', 'Hindi'],
                        },
                    }),
                }}
            />
            <HeroSection />
            <CategoryPills />
            <FeaturedProducts />
            <SaleBanners />
            <WhySavika />
            <CategoryShowcase />
            <BestSellers />
            <InstagramGrid />
            <TrustBadges />
        </>
    )
}
