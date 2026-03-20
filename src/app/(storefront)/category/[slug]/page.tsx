import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types/database'

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
        description: 'Hand-selected whole spices sourced directly from their origin regions - Kashmir, Kerala, Rajasthan and beyond. Maximum freshness, zero processing.',
        longDescription: 'Whole spices are the foundation of authentic Indian cooking. Unlike pre-ground powders that lose aromatics within weeks of grinding, whole spices retain their essential oils and flavour compounds for 12–36 months. Our whole spice range is sourced directly from origin-verified farms - Kashmiri Mirch from Pulwama, Malabar Black Pepper from Wayanad, Cardamom from Idukki - and packed fresh without any processing, irradiation, or artificial preservatives. Use whole spices for tadkas, biryanis, pickles, and slow-cooked gravies where depth of flavour matters most.',
        metaTitle: 'Buy Whole Spices Online in India | Premium Kashmiri & Malabar Varieties | Savika',
        metaDescription: 'Shop premium whole spices online - Kashmiri Mirch, Malabar Pepper, Cardamom, Star Anise & more. Direct farm sourcing, FSSAI certified, pan-India delivery. Savika.',
        keywords: ['whole spices online india', 'buy whole spices india', 'kashmiri mirch online', 'malabar pepper india', 'whole spices price india', 'premium whole spices india'],
        faqs: [
            { q: 'Why should I buy whole spices instead of powder?', a: 'Whole spices retain their essential oils and flavour compounds far longer than powder - typically 18–36 months vs 3–6 months. You get more aroma, more flavour, and full control over grind size.' },
            { q: 'How do I store whole spices?', a: 'Store in airtight glass or stainless steel containers away from direct sunlight, heat and moisture. Never keep near the stove. Properly stored whole spices last 18–36 months.' },
            { q: 'Do your whole spices have any preservatives?', a: 'None. All Savika whole spices are packed as-is - cleaned, sorted, and sealed. No preservatives, no artificial colour, no anti-caking agents.' },
        ],
    },
    'ground-powdered': {
        slug: 'ground-powdered',
        name: 'Ground & Powdered Spices',
        headline: 'Buy Freshly Ground Spice Powders Online in India',
        description: 'Stone-ground in small batches from premium whole spices. Each powder retains maximum aroma, colour, and active compounds compared to factory-ground alternatives.',
        longDescription: 'Most commercial spice powders are ground months in advance (or even years) and packed with anti-caking agents to survive the supply chain. At Savika, our ground spices are stone-ground in small 25kg batches from freshly sourced whole spices. This means you receive a powder that is days - not months - old. The difference is immediately apparent in colour intensity, aroma strength, and cooking results. Our Lakadong turmeric averages 7–9% curcumin vs 2–3% in commercial brands. Our Rajasthan coriander powder smells like the whole seed because it essentially is.',
        metaTitle: 'Buy Fresh Ground Spice Powders Online in India | Turmeric, Chilli, Coriander | Savika',
        metaDescription: 'Buy freshly stone-ground spice powders - turmeric, red chilli, coriander, cumin. No preservatives, no fillers. FSSAI certified. Free shipping ₹599+. Shop Savika.',
        keywords: ['ground spices online india', 'fresh spice powder india', 'turmeric powder online india', 'red chilli powder india', 'coriander powder india', 'buy spice powder india'],
        faqs: [
            { q: 'What makes Savika ground spices different from supermarket brands?', a: 'We stone-grind in small batches from freshly sourced whole spices - typically within 2–4 weeks of grinding vs months or years for supermarket brands. No fillers, no salt, no anti-caking agents.' },
            { q: 'Why is your turmeric more yellow than others?', a: 'We source Lakadong turmeric from Meghalaya which tests at 7–9% curcumin - 3–4x more than standard commercial turmeric. Higher curcumin = deeper yellow colour naturally.' },
            { q: 'Do ground spices expire faster than whole spices?', a: 'Yes. Ground spices lose aroma faster because more surface area is exposed to air. Use them within 6–12 months for peak flavour. Store in airtight, dark containers.' },
        ],
    },
    'blends-masalas': {
        slug: 'blends-masalas',
        name: 'Blends & Masalas',
        headline: 'Buy Artisan Spice Blends & Masalas Online in India',
        description: 'Hand-blended from individually sourced whole spices. No fillers, no salt, no MSG. Each recipe perfected over 40+ iterations by our culinary team.',
        longDescription: 'A great spice blend is only as good as its worst component. Most commercial blends are made from pre-ground powders of unknown origin, mixed with salt, fillers, or anti-caking agents. Our masalas are different: every component spice is sourced from its optimal growing region, individually quality-checked, dry-roasted at the precise optimal temperature, then blended and stone-ground together in small batches. Our Artisan Garam Masala uses 14 components. Our Biryani Masala uses 22. Each recipe was developed over months of iterations to achieve the flavour profile Indian home cooks recognize from restaurant kitchens.',
        metaTitle: 'Buy Artisan Spice Blends & Masalas Online in India | Garam Masala, Biryani Masala | Savika',
        metaDescription: 'Buy fresh artisan spice blends - Garam Masala, Biryani Masala, Chettinad Masala. Hand-blended, stone-ground. No fillers. FSSAI certified. Savika India.',
        keywords: ['spice blends online india', 'buy masala online india', 'garam masala online india', 'biryani masala online india', 'fresh masala powder india', 'artisan masala india'],
        faqs: [
            { q: 'Are your masalas suitable for vegetarians?', a: 'Yes. All Savika spice blends are 100% plant-based - pure spices, no animal products, no MSG.' },
            { q: 'How many spices are in your Garam Masala?', a: '14 whole spices: black & green cardamom, cinnamon, cloves, black pepper, cumin, coriander, bay leaf, star anise, mace, nutmeg, dried ginger, fennel, and Kashmiri chilli.' },
            { q: 'Is there salt in your masalas?', a: 'Never. All Savika masalas are salt-free. This gives you full control over seasoning in your dishes.' },
        ],
    },
    'gift-packs': {
        slug: 'gift-packs',
        name: 'Gift Packs',
        headline: 'Buy Premium Spice Gift Packs Online in India',
        description: 'Curated spice collections in beautiful packaging - perfect for Diwali, birthdays, weddings, and corporate gifting. Pan-India delivery with custom messages.',
        longDescription: 'Give the gift of authentic Indian flavours. Our spice gift packs are curated collections of our most popular products, packaged in premium boxes designed to impress. Whether you are looking for a thoughtful Diwali gift, a unique corporate gift that stands out, or a housewarming present for a foodie friend, our gift packs deliver on presentation and quality equally. Each pack comes with a description card detailing the origin story of each spice. Custom branding available for corporate orders of 50+ units.',
        metaTitle: 'Buy Premium Spice Gift Packs Online India | Diwali & Corporate Gifting | Savika',
        metaDescription: 'Buy premium Indian spice gift sets online. Perfect for Diwali, weddings, corporate gifting. Beautiful packaging, pan-India delivery. Custom branding available. Shop Savika.',
        keywords: ['spice gift packs india', 'buy spice gift set india', 'diwali spice gift india', 'corporate spice gifts india', 'spice hamper india', 'premium gift packs india'],
        faqs: [
            { q: 'Can I customize the gift pack message?', a: 'Yes. Add a personal message at checkout and we will include a handwritten-style message card in the pack.' },
            { q: 'Do you offer corporate gifting?', a: 'Yes. For orders of 50+ units, we offer custom labelling and bulk pricing. Contact us at hello@savika.in for corporate gifting quotes.' },
            { q: 'What is the shelf life of spices in gift packs?', a: 'All spices are freshly packed with a minimum 12-month shelf life from the date of manufacture, printed on each individual pack.' },
        ],
    },
    'exotics-rare': {
        slug: 'exotics-rare',
        name: 'Exotics & Rare Spices',
        headline: 'Buy Rare & Exotic Indian Spices Online',
        description: 'India\'s rarest spices - Pampore Saffron, Coorg Vanilla, Malabar Long Pepper, Assam Star Anise. Each variety selected from a single micro-region for authenticity.',
        longDescription: 'India is home to spices so rare that most Indians never encounter them in their lifetimes. Our Exotics & Rare collection brings these ingredients out of obscurity and onto your kitchen shelf. Kashmiri Saffron from the Pampore fields - the only region where saffron is grown in India, producing just 16 tonnes per year. Coorg Vanilla from Karnataka\'s coffee estates. Long Pepper, the precursor to black pepper in ancient trade routes, now almost completely forgotten. Each product in this collection is sourced in small quantities directly from artisan farmers who have preserved these cultivation traditions for generations.',
        metaTitle: 'Buy Rare & Exotic Indian Spices Online | Kashmiri Saffron, Long Pepper | Savika',
        metaDescription: 'Buy rare Indian spices online - Kashmiri Saffron, Long Pepper, Coorg Vanilla, Star Anise. Direct farm sourcing, small-batch. FSSAI certified. Shop Savika.',
        keywords: ['rare indian spices online', 'buy kashmiri saffron india', 'exotic spices india', 'long pepper india', 'rare spices online india', 'premium exotic spices india'],
        faqs: [
            { q: 'How can I tell if Kashmiri Saffron is genuine?', a: 'Genuine Kashmiri Saffron has thick, trumpet-shaped stigmas with a bright red colour that fades to yellow at the tip. When steeped in warm water, it releases colour slowly over 10–15 minutes (not immediately) and has a distinctive honey-floral aroma with a slightly metallic note.' },
            { q: 'Are rare spices suitable for everyday cooking?', a: 'Some (like Long Pepper and Star Anise) work wonderfully in everyday cooking. Others like Saffron are used in small quantities for special occasion dishes. We provide usage guides with every product.' },
        ],
    },
}

// ─── Mock products per category - replace with Supabase fetch ───────────
const CATEGORY_PRODUCTS: Record<string, Product[]> = {
    'whole-spices': [
        { id: '1', slug: 'kashmiri-mirch-whole', name: 'Kashmiri Mirch Whole', description: 'Hand-picked from the valleys of Kashmir - vibrant red colour, mild heat.', price: 299, sale_price: 199, stock: 50, category_id: 'cat1', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', created_at: '' } },
        { id: '4', slug: 'malabar-black-pepper', name: 'Malabar Black Pepper', description: 'Bold, robust, intensely aromatic pepper from Kerala\'s Malabar coast.', price: 349, stock: 60, category_id: 'cat1', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', created_at: '' } },
        { id: '5', slug: 'star-anise-whole', name: 'Star Anise Whole', description: 'Fragrant star anise from Assam - licorice-sweet and bold.', price: 399, sale_price: 299, stock: 40, category_id: 'cat1', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', created_at: '' } },
    ],
    'ground-powdered': [
        { id: '2', slug: 'premium-turmeric-powder', name: 'Premium Turmeric Powder', description: 'Single-origin Lakadong turmeric, freshly milled for maximum curcumin.', price: 249, stock: 80, category_id: 'cat2', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', created_at: '' } },
        { id: '6', slug: 'coriander-powder', name: 'Coriander Powder', description: 'Freshly ground from Rajasthan coriander seeds - warm and nutty.', price: 189, stock: 90, category_id: 'cat2', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', created_at: '' } },
    ],
    'blends-masalas': [
        { id: '3', slug: 'garam-masala-artisan', name: 'Artisan Garam Masala', description: 'Complex 14-spice blend, slow-roasted and stone-ground.', price: 399, sale_price: 299, stock: 35, category_id: 'cat3', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', created_at: '' } },
        { id: '7', slug: 'biryani-masala', name: 'Royal Biryani Masala', description: 'Restaurant-quality biryani masala - fragrant layered blend of 22 spices.', price: 449, sale_price: 349, stock: 25, category_id: 'cat3', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', created_at: '' } },
    ],
    'exotics-rare': [
        { id: '8', slug: 'kashmiri-saffron', name: 'Kashmiri Saffron Grade A', description: 'Hand-harvested from Pampore fields - certified Grade A by J&K Government.', price: 1299, stock: 15, category_id: 'cat5', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat5', slug: 'exotics-rare', name: 'Exotics & Rare', created_at: '' } },
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
            url: `https://savika.in/category/${slug}`,
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
            canonical: `https://savika.in/category/${slug}`,
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
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://savika.in' },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://savika.in/shop' },
            { '@type': 'ListItem', position: 3, name: cat.name, item: `https://savika.in/category/${slug}` },
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
        url: `https://savika.in/category/${slug}`,
        breadcrumb: breadcrumbSchema,
    }

    return (
        <div className="min-h-screen bg-[#F9F4EE]">
            {/* JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

            {/* ── Breadcrumb ── */}
            <div className="bg-white border-b border-[#e8ddd0] py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400">
                        <Link href="/" className="hover:text-[#C47F17] transition-colors">Home</Link>
                        <i className="fa-solid fa-chevron-right text-[8px]" />
                        <Link href="/shop" className="hover:text-[#C47F17] transition-colors">Shop</Link>
                        <i className="fa-solid fa-chevron-right text-[8px]" />
                        <span className="text-[#C47F17] font-medium">{cat.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">

                {/* ── Hero Header ── */}
                <section className="max-w-3xl">
                    <p className="text-xs font-bold text-[#C47F17] uppercase tracking-widest mb-2">
                        <i className="fa-solid fa-pepper-hot mr-1" /> Savika - {cat.name}
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1A0E] leading-tight mb-4">
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
                                    ? 'bg-[#C47F17] text-white border-[#C47F17]'
                                    : 'bg-white text-[#2E2E2E] border-[#e8ddd0] hover:border-[#C47F17] hover:text-[#C47F17]'
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
                        <h2 className="text-xl font-extrabold text-[#2C1A0E]">
                            {products.length > 0 ? `${products.length} Products` : 'Products'}
                        </h2>
                        <Link href="/shop" className="text-sm text-[#C47F17] font-semibold hover:underline flex items-center gap-1">
                            View All <i className="fa-solid fa-arrow-right text-xs" />
                        </Link>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-[#e8ddd0]">
                            <i className="fa-solid fa-box-open text-4xl text-[#C47F17]/40 mb-4 block" />
                            <p className="text-gray-500 font-medium">Products coming soon.</p>
                            <Link href="/shop" className="mt-4 inline-flex items-center gap-2 text-[#C47F17] font-semibold text-sm hover:underline">
                                <i className="fa-solid fa-store text-xs" /> Browse all spices
                            </Link>
                        </div>
                    )}
                </section>

                {/* ── Why Savika Trust Strip ── */}
                <section className="bg-[#2C1A0E] rounded-3xl p-8">
                    <h2 className="text-lg font-extrabold text-white mb-6 text-center">Why Buy From Savika?</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {[
                            { icon: 'fa-seedling', title: '100% Natural', sub: 'No additives or preservatives' },
                            { icon: 'fa-trophy', title: 'FSSAI Certified', sub: 'Safety & quality tested' },
                            { icon: 'fa-truck', title: 'Pan-India Delivery', sub: '3–7 business days' },
                            { icon: 'fa-rotate-left', title: 'Easy Returns', sub: '7-day hassle-free' },
                        ].map((b) => (
                            <div key={b.title} className="flex flex-col items-center gap-2">
                                <div className="w-11 h-11 rounded-full bg-[#C47F17]/20 flex items-center justify-center">
                                    <i className={`fa-solid ${b.icon} text-[#C47F17]`} />
                                </div>
                                <p className="text-xs font-bold text-white">{b.title}</p>
                                <p className="text-[11px] text-gray-400">{b.sub}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FAQ Section ── */}
                <section className="max-w-3xl">
                    <h2 className="text-2xl font-extrabold text-[#2C1A0E] mb-6 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#C47F17]/20 flex items-center justify-center">
                            <i className="fa-solid fa-circle-question text-[#C47F17]" />
                        </div>
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {cat.faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="group bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-[#2C1A0E] hover:bg-[#FFF8F0] transition-colors">
                                    <span>{faq.q}</span>
                                    <i className="fa-solid fa-chevron-down text-[#C47F17] text-xs group-open:rotate-180 transition-transform" />
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
                                    className="flex items-center gap-2 bg-white border border-[#e8ddd0] hover:border-[#C47F17] text-[#2C1A0E] hover:text-[#C47F17] font-semibold px-4 py-2.5 rounded-full text-sm transition-all"
                                >
                                    <i className="fa-solid fa-arrow-right text-[#C47F17] text-xs" />
                                    {c.name}
                                </Link>
                            ))}
                        <Link
                            href="/shop"
                            className="flex items-center gap-2 bg-[#C47F17]/10 border border-[#C47F17]/30 hover:bg-[#C47F17] hover:text-white text-[#C47F17] font-semibold px-4 py-2.5 rounded-full text-sm transition-all"
                        >
                            <i className="fa-solid fa-store text-xs" />
                            Complete Spice Collection
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}
