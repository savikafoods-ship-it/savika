import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Flame as PepperHot, ArrowRight, PackageOpen, Store, Sprout, Trophy, Truck, RotateCcw, CircleHelp, ChevronDown } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

// ─── ISR: revalidate every hour ─────────────────────────────────────────
export const revalidate = 3600

// ─── Category definitions ────────────────────────────────────────────────
interface CategoryMeta {
    slug: string
    name: string
    headline: string
    description: string
    longDescription: string
    metaTitle: string
    metaDescription: string
    keywords: string[]
    faqs: { q: string; a: string }[]
}

const CATEGORIES: Record<string, CategoryMeta> = {
    'whole-spices': {
        slug: 'whole-spices',
        name: 'Whole Spices',
        headline: 'Buy Premium Whole Spices Online in India',
        description: 'Hand-selected whole spices sourced directly from their origin regions. Maximum freshness, zero processing.',
        longDescription: 'Whole spices are the foundation of authentic Indian cooking. Unlike pre-ground powders that lose aromatics within weeks of grinding, whole spices retain their essential oils and flavour compounds for 12–36 months. Our whole spice range is sourced directly from origin-verified farms - Kashmiri Mirch from Pulwama, Malabar Black Pepper from Wayanad, Cardamom from Idukki - and packed fresh without any processing, irradiation, or artificial preservatives.',
        metaTitle: 'Buy Whole Spices Online in India | Premium Kashmiri & Malabar Varieties | Savika',
        metaDescription: 'Shop premium whole spices online - Kashmiri Mirch, Malabar Pepper, Cardamom, Star Anise & more. Direct farm sourcing, FSSAI certified, pan-India delivery.',
        keywords: ['whole spices online india', 'buy whole spices india', 'kashmiri mirch online', 'malabar pepper india', 'premium whole spices india'],
        faqs: [
            { q: 'Why should I buy whole spices instead of powder?', a: 'Whole spices retain their essential oils and flavour compounds far longer than powder - typically 18–36 months vs 3–6 months.' },
            { q: 'How do I store whole spices?', a: 'Store in airtight glass or stainless steel containers away from direct sunlight, heat and moisture. Never keep near the stove.' },
            { q: 'Do your whole spices have any preservatives?', a: 'None. All Savika whole spices are packed as-is - cleaned, sorted, and sealed. No preservatives, no artificial colour, no anti-caking agents.' },
        ],
    },
    // ...other categories would go here, omitting them for brevity but keeping structure
    'ground-powdered': {
        slug: 'ground-powdered',
        name: 'Ground & Powdered Spices',
        headline: 'Buy Freshly Ground Spice Powders Online in India',
        description: 'Stone-ground in small batches from premium whole spices. Each powder retains maximum aroma, colour, and active compounds.',
        longDescription: 'Most commercial spice powders are ground months in advance and packed with anti-caking agents to survive the supply chain. At Savika, our ground spices are stone-ground in small 25kg batches from freshly sourced whole spices.',
        metaTitle: 'Buy Fresh Ground Spice Powders Online in India | Savika',
        metaDescription: 'Buy freshly stone-ground spice powders. No preservatives, no fillers. FSSAI certified. Free shipping ₹599+.',
        keywords: ['ground spices online india', 'fresh spice powder india', 'turmeric powder online india', 'red chilli powder india'],
        faqs: [
            { q: 'What makes Savika ground spices different from supermarket brands?', a: 'We stone-grind in small batches from freshly sourced whole spices - typically within 2-4 weeks of grinding. No fillers, no salt, no anti-caking agents.' },
            { q: 'Do ground spices expire faster than whole spices?', a: 'Yes. Ground spices lose aroma faster because more surface area is exposed to air. Use them within 6-12 months for peak flavour.' },
        ],
    },
    'blends-masalas': {
        slug: 'blends-masalas',
        name: 'Blends & Masalas',
        headline: 'Buy Artisan Spice Blends & Masalas Online in India',
        description: 'Hand-blended from individually sourced whole spices. No fillers, no salt, no MSG. Each recipe perfected over iterations.',
        longDescription: 'A great spice blend is only as good as its worst component. Most commercial blends are made from pre-ground powders of unknown origin. Our masalas are different: every component spice is sourced from its optimal growing region and stone-ground together in small batches.',
        metaTitle: 'Buy Artisan Spice Blends & Masalas Online in India | Savika',
        metaDescription: 'Buy fresh artisan spice blends - Garam Masala, Biryani Masala. Hand-blended, stone-ground. No fillers. FSSAI certified.',
        keywords: ['spice blends online india', 'buy masala online india', 'garam masala online india', 'artisan masala india'],
        faqs: [
            { q: 'Are your masalas suitable for vegetarians?', a: 'Yes. All Savika spice blends are 100% plant-based - pure spices, no animal products, no MSG.' },
            { q: 'Is there salt in your masalas?', a: 'Never. All Savika masalas are salt-free. This gives you full control over seasoning in your dishes.' },
        ],
    },
    'gift-packs': {
        slug: 'gift-packs',
        name: 'Gift Packs',
        headline: 'Buy Premium Spice Gift Packs Online in India',
        description: 'Curated spice collections in beautiful packaging - perfect for Diwali, birthdays, weddings, and corporate gifting.',
        longDescription: 'Give the gift of authentic Indian flavours. Our spice gift packs are curated collections of our most popular products, packaged in premium boxes designed to impress.',
        metaTitle: 'Buy Premium Spice Gift Packs Online India | Savika',
        metaDescription: 'Buy premium Indian spice gift sets online. Perfect for Diwali, weddings, corporate gifting. Beautiful packaging, pan-India delivery.',
        keywords: ['spice gift packs india', 'buy spice gift set india', 'diwali spice gift india', 'corporate spice gifts india'],
        faqs: [
            { q: 'Can I customize the gift pack message?', a: 'Yes. Add a personal message at checkout and we will include a description card.' },
        ],
    },
    'exotics-rare': {
        slug: 'exotics-rare',
        name: 'Exotics & Rare Spices',
        headline: 'Buy Rare & Exotic Indian Spices Online',
        description: 'India\'s rarest spices - Pampore Saffron, Coorg Vanilla, Malabar Long Pepper. Each variety selected for authenticity.',
        longDescription: 'India is home to spices so rare that most Indians never encounter them in their lifetimes. Our Exotics & Rare collection brings these ingredients out of obscurity and onto your kitchen shelf.',
        metaTitle: 'Buy Rare & Exotic Indian Spices Online | Savika',
        metaDescription: 'Buy rare Indian spices online - Kashmiri Saffron, Long Pepper, Coorg Vanilla. Direct farm sourcing, small-batch. FSSAI certified.',
        keywords: ['rare indian spices online', 'buy kashmiri saffron india', 'exotic spices india', 'rare spices online india'],
        faqs: [
            { q: 'Are rare spices suitable for everyday cooking?', a: 'Some work wonderfully in everyday cooking. Others like Saffron are used in small quantities for special occasion dishes.' },
        ],
    },
}

// ─── Mock products per category - replace with Appwrite fetch ───────────
const CATEGORY_PRODUCTS: Record<string, Product[]> = {
    'whole-spices': [
        { $id: '1', slug: 'kashmiri-mirch-whole', name: 'Kashmiri Mirch Whole', description: 'Hand-picked from the valleys of Kashmir - vibrant red colour, mild heat.', price: 199, comparePrice: 299, stock: 50, categoryId: 'cat1', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', imageId: '', sortOrder: 0, $createdAt: '', $updatedAt: '' } },
    ],
    'ground-powdered': [
        { $id: '2', slug: 'premium-turmeric-powder', name: 'Premium Turmeric Powder', description: 'Single-origin Lakadong turmeric, freshly milled for maximum curcumin.', price: 249, stock: 80, categoryId: 'cat2', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', imageId: '', sortOrder: 1, $createdAt: '', $updatedAt: '' } },
    ],
    'blends-masalas': [
        { $id: '3', slug: 'garam-masala-artisan', name: 'Artisan Garam Masala', description: 'Complex 14-spice blend, slow-roasted and stone-ground.', price: 349, comparePrice: 399, stock: 35, categoryId: 'cat3', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' } },
    ],
    'exotics-rare': [
        { $id: '8', slug: 'kashmiri-saffron', name: 'Kashmiri Saffron Grade A', description: 'Hand-harvested from Pampore fields.', price: 1299, stock: 15, categoryId: 'cat5', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat5', slug: 'exotics-rare', name: 'Exotics & Rare', imageId: '', sortOrder: 4, $createdAt: '', $updatedAt: '' } },
    ],
    'gift-packs': [],
}

type Props = { params: Promise<{ slug: string }> }

// ─── generateStaticParams ──────────────────────────────────────────────
export async function generateStaticParams() {
    return Object.keys(CATEGORIES).map((slug) => ({ slug }))
}

// ─── generateMetadata ──────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const cat = CATEGORIES[slug]
    if (!cat) return { title: 'Category Not Found | Savika' }

    return {
        title: cat.metaTitle,
        description: cat.metaDescription,
        keywords: cat.keywords.join(', '),
        openGraph: {
            title: cat.metaTitle,
            description: cat.metaDescription,
            url: `https://savikafoods.in/category/${slug}`,
            siteName: 'Savika',
            locale: 'en_IN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: cat.metaTitle,
            description: cat.metaDescription,
        },
        alternates: {
            canonical: `https://savikafoods.in/category/${slug}`,
        },
    }
}

// ─── Page ──────────────────────────────────────────────────────────────
export default async function CategoryPage({ params }: Props) {
    const { slug } = await params
    const cat = CATEGORIES[slug]
    if (!cat) notFound()

    const products = CATEGORY_PRODUCTS[slug] ?? []

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://savikafoods.in' },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://savikafoods.in/shop' },
            { '@type': 'ListItem', position: 3, name: cat.name, item: `https://savikafoods.in/category/${slug}` },
        ],
    }

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: cat.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    }

    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: cat.name,
        description: cat.description,
        url: `https://savikafoods.in/category/${slug}`,
        breadcrumb: breadcrumbSchema,
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8]">
            {/* JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

            {/* ── Breadcrumb ── */}
            <div className="bg-white border-b border-[#e8ddd0] py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400">
                        <Link href="/" className="hover:text-[#C17F24] transition-colors">Home</Link>
                        <ChevronRight className="w-2 h-2" />
                        <Link href="/shop" className="hover:text-[#C17F24] transition-colors">Shop</Link>
                        <ChevronRight className="w-2 h-2" />
                        <span className="text-[#C17F24] font-medium">{cat.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">

                {/* ── Hero Header ── */}
                <section className="max-w-3xl">
                    <p className="text-xs font-bold text-[#C17F24] uppercase tracking-widest mb-2 flex items-center gap-1">
                        <PepperHot className="w-3 h-3" /> Savika - {cat.name}
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E2E2E] leading-tight mb-4">
                        {cat.headline}
                    </h1>
                    <p className="text-base text-gray-600 leading-relaxed mb-4">{cat.description}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{cat.longDescription}</p>
                </section>

                {/* ── Filter bar: Link to other categories ── */}
                <section>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Browse Categories</p>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(CATEGORIES).map((c) => (
                            <Link
                                key={c.slug}
                                href={`/category/${c.slug}`}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${c.slug === slug
                                    ? 'bg-[#C17F24] text-white border-[#C17F24]'
                                    : 'bg-white text-[#2E2E2E] border-[#e8ddd0] hover:border-[#C17F24] hover:text-[#C17F24]'
                                    }`}
                            >
                                {c.name}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ── Products Grid ── */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-extrabold text-[#2E2E2E]">
                            {products.length > 0 ? `${products.length} Products` : 'Products'}
                        </h2>
                        <Link href="/shop" className="text-sm text-[#C17F24] font-semibold hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.$id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-[#e8ddd0]">
                            <PackageOpen className="w-10 h-10 text-[#C17F24]/40 mb-4 mx-auto" />
                            <p className="text-gray-500 font-medium">Products coming soon.</p>
                            <Link href="/shop" className="mt-4 inline-flex items-center justify-center gap-2 text-[#C17F24] font-semibold text-sm hover:underline">
                                <Store className="w-4 h-4" /> Browse all spices
                            </Link>
                        </div>
                    )}
                </section>

                {/* ── Why Savika Trust Strip ── */}
                <section className="bg-[#111] rounded-3xl p-8">
                    <h2 className="text-lg font-extrabold text-white mb-6 text-center">Why Buy From Savika?</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {[
                            { icon: Sprout, title: '100% Natural', sub: 'No additives or preservatives' },
                            { icon: Trophy, title: 'FSSAI Certified', sub: 'Safety & quality tested' },
                            { icon: Truck, title: 'Pan-India Delivery', sub: '3-7 business days' },
                            { icon: RotateCcw, title: 'Easy Returns', sub: '7-day hassle-free' },
                        ].map((b) => {
                            const Icon = b.icon
                            return (
                                <div key={b.title} className="flex flex-col items-center gap-2">
                                    <div className="w-11 h-11 rounded-full bg-[#C17F24]/20 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-[#C17F24]" />
                                    </div>
                                    <p className="text-xs font-bold text-white">{b.title}</p>
                                    <p className="text-[11px] text-gray-400">{b.sub}</p>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* ── FAQ Section ── */}
                <section className="max-w-3xl">
                    <h2 className="text-2xl font-extrabold text-[#2E2E2E] mb-6 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#C17F24]/20 flex items-center justify-center">
                            <CircleHelp className="w-4 h-4 text-[#C17F24]" />
                        </div>
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {cat.faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="group bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-[#2E2E2E] hover:bg-[#F9F4EE] transition-colors">
                                    <span>{faq.q}</span>
                                    <ChevronDown className="w-4 h-4 text-[#C17F24] group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-5 pb-5 pt-4 text-sm text-gray-600 leading-relaxed border-t border-[#e8ddd0]">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* ── Internal Links ── */}
                <section className="pb-4">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Explore More</p>
                    <div className="flex flex-wrap gap-3">
                        {Object.values(CATEGORIES)
                            .filter((c) => c.slug !== slug)
                            .map((c) => (
                                <Link
                                    key={c.slug}
                                    href={`/category/${c.slug}`}
                                    className="flex items-center gap-2 bg-white border border-[#e8ddd0] hover:border-[#C17F24] text-[#2E2E2E] hover:text-[#C17F24] font-semibold px-4 py-2.5 rounded-full text-sm transition-all"
                                >
                                    <ArrowRight className="w-4 h-4 text-[#C17F24]" />
                                    {c.name}
                                </Link>
                            ))}
                        <Link
                            href="/shop"
                            className="flex items-center gap-2 bg-[#C17F24]/10 border border-[#C17F24]/30 hover:bg-[#C17F24] hover:text-white text-[#C17F24] font-semibold px-4 py-2.5 rounded-full text-sm transition-all"
                        >
                            <Store className="w-4 h-4" />
                            Complete Spice Collection
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}
