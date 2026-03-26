import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faChevronRight, 
    faCheckCircle, 
    faStar, 
    faShoppingBag, 
    faHeart, 
    faTruck, 
    faRotateLeft, 
    faShieldAlt, 
    faLeaf, 
    faUtensils, 
    faHandshake, 
    faBan, 
    faBookOpen, 
    faHeartPulse, 
    faAward, 
    faQuestionCircle, 
    faChevronDown, 
    faFire, 
    faStore, 
    faArrowRight, 
    faMapMarkerAlt, 
    faGlobe, 
    faUniversity, 
    faMap, 
    faBoxOpen, 
    faClock, 
    faArchive 
} from '@fortawesome/free-solid-svg-icons'
import { 
    BookOpen, 
    HeartPulse, 
    Utensils, 
    HelpCircle,
    MapPin,
    Globe,
    Leaf,
    School,
    Map,
    ChevronDown
} from 'lucide-react'
import ProductCommercePanel from '@/components/product/ProductCommercePanel'
import { createClient, createStaticClient } from '@/lib/supabase/server'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

// ─── ISR: revalidate every hour ─────────────────────────────────────────
export const revalidate = 3600

// ─── Product Metadata (rich content not in DB yet) ─────────────────────────

async function getProduct(slug: string) {
    const supabase = await createClient()
    
    const { data: product } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .single()
    return product
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
    const supabase = createStaticClient()
    const { data: products } = await supabase.from('products').select('slug')
    return (products || []).map((p: any) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const p = await getProduct(slug)
    
    if (!p) return { title: 'Product Not Found | Savika' }

    const name = p.name
    const description = p.description || ''
    const image = p.image_urls?.[0] || '/images/logo.png'

    return {
        title: p.metadata?.metaTitle || `${name} | Savika`,
        description: p.metadata?.metaDescription || p.tagline || description,
        keywords: (p.metadata?.keywords || []).join(', '),
        openGraph: {
            title: p.metadata?.metaTitle || name,
            description: p.metadata?.metaDescription || description,
            url: `https://savikafoods.in/product/${slug}`,
            siteName: 'Savika',
            images: [{ url: image.startsWith('/') ? image : getProductImageUrl(image), width: 1200, height: 630, alt: name }],
            locale: 'en_IN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: p.metadata?.metaTitle || name,
            description: p.metadata?.metaDescription || description,
            images: [image.startsWith('/') ? image : getProductImageUrl(image)],
        },
    }
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params
    const p = await getProduct(slug)
    
    if (!p) notFound()

    // Map DB fields to component variables with fallbacks
    const enrichedProduct = {
        ...p,
        localName: p.local_name || '',
        heroIntro: p.description || '',
        whatIsThis: p.generated_content?.what_is?.description || p.description || '',
        origin: p.generated_content?.what_is?.origin || p.metadata?.origin || 'India',
        botanicalName: p.generated_content?.what_is?.botanical_name || p.metadata?.botanicalName || '',
        culturalImportance: p.metadata?.culturalImportance || 'Traditional Indian Spice',
        regionalUsage: p.metadata?.regionalUsage || 'Pan-India',
        benefits: (p.generated_content?.health_benefits?.length > 0) 
            ? p.generated_content.health_benefits.map((b: any) => ({ title: b.name, desc: b.description }))
            : (p.metadata?.benefits || []),
        culinaryUses: p.generated_content?.culinary_uses || p.metadata?.culinaryUses || [],
        storageLife: p.metadata?.storageLife || '12 months',
        storageInstructions: p.metadata?.storageInstructions || 'Store in a cool, dry place.',
        sourcingStory: p.metadata?.sourcingStory || 'Sourced directly from verified farmers.',
        faqs: (p.generated_content?.faqs?.length > 0)
            ? p.generated_content.faqs.map((f: any) => ({ q: f.question, a: f.answer }))
            : (p.metadata?.faqs || []),
        weightOptions: p.weight_options || []
    }

    const currentPrice = enrichedProduct.price
    const currentSalePrice = enrichedProduct.sale_price
    const savings = currentSalePrice ? currentPrice - currentSalePrice : 0
    const savingsPct = savings > 0 ? Math.round((savings / currentPrice) * 100) : 0

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: enrichedProduct.name,
        description: enrichedProduct.heroIntro?.slice(0, 500) || enrichedProduct.description?.slice(0, 500),
        image: [getProductImageUrl(enrichedProduct.image_urls?.[0])],
        brand: { '@type': 'Brand', name: 'Savika' },
        sku: enrichedProduct.id,
        offers: {
            '@type': 'Offer',
            price: enrichedProduct.sale_price ?? enrichedProduct.price,
            priceCurrency: 'INR',
            availability: enrichedProduct.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://savikafoods.in/product/${slug}`,
        },
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://savikafoods.in' },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://savikafoods.in/shop' },
            { '@type': 'ListItem', position: 3, name: enrichedProduct.category?.name, item: `https://savikafoods.in/category/${enrichedProduct.category?.slug}` },
            { '@type': 'ListItem', position: 4, name: enrichedProduct.name, item: `https://savikafoods.in/product/${slug}` },
        ],
    }

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (enrichedProduct.faqs || []).map((f: any) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    }

    return (
        <div className="min-h-screen bg-[#F9F4EE]">
            {/* JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            {/* ── Breadcrumb ── */}
            <div className="bg-white border-b border-[#e8ddd0] py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400">
                        <Link href="/" className="hover:text-[#C17F24] transition-colors">Home</Link>
                        <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2" />
                        <Link href="/shop" className="hover:text-[#C17F24] transition-colors">Shop</Link>
                        <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2" />
                        <Link href={`/category/${enrichedProduct.category?.slug}`} className="hover:text-[#C17F24] transition-colors">{enrichedProduct.category?.name}</Link>
                        <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2" />
                        <span className="text-[#C17F24] font-medium line-clamp-1">{enrichedProduct.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">

                {/* ══════════════════════════════════════════════════
                    SECTION 1 - HERO + COMMERCE
                ══════════════════════════════════════════════════ */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Product Gallery */}
                    <div className="space-y-3">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl">
                            <Image
                                src={getProductImageUrl(enrichedProduct.image_urls?.[0])}
                                alt={`${enrichedProduct.name} - Buy Online India | Savika`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                            {savingsPct > 0 && (
                                <div className="absolute top-4 left-4 bg-[#C47F17] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    {savingsPct}% OFF
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 text-[#2E2E2E] text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-green-600" />
                                FSSAI Certified
                            </div>
                        </div>
                        {/* Thumbnail row placeholder */}
                        <div className="grid grid-cols-4 gap-2">
                            {enrichedProduct.image_urls?.slice(0, 4).map((url: string, i: number) => (
                                <div key={i} className="aspect-square rounded-xl bg-white shadow border-2 border-transparent hover:border-[#C47F17] transition-all cursor-pointer overflow-hidden relative">
                                    <Image src={getProductImageUrl(url)} alt={`${enrichedProduct.name} view ${i}`} fill sizes="80px" className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Commerce Panel */}
                    <div className="space-y-6">
                        {/* H1 */}
                        <div>
                            <p className="text-sm text-[#C47F17] font-semibold uppercase tracking-widest mb-1">
                                {enrichedProduct.category?.name}
                            </p>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1A0E] leading-tight">
                                Buy {enrichedProduct.name} Online in India
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 italic">{enrichedProduct.localName}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FontAwesomeIcon 
                                        key={i} 
                                        icon={faStar} 
                                        className={`w-4 h-4 ${i < Math.floor(enrichedProduct.rating || 4.8) ? 'text-[#C17F24]' : 'text-gray-300'}`} 
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-[#2E2E2E]">{enrichedProduct.rating || 4.8}</span>
                            <span className="text-sm text-gray-400">({enrichedProduct.review_count || enrichedProduct.reviewCount || 0} reviews)</span>
                        </div>

                        {/* ProductCommercePanel replaces the static WeightSelector and buttons */}
                        <ProductCommercePanel productData={enrichedProduct} />
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 2 - WHAT IS THIS SPICE?
                ══════════════════════════════════════════════════ */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-[#e8ddd0]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#C17F24]/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-[#C17F24]" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-[#2C1A0E]">What Is {enrichedProduct.name.split(' ')[0]}?</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                        <div className="lg:col-span-2 space-y-4">
                            {enrichedProduct.whatIsThis?.split('\n\n').map((para: string, i: number) => (
                                <p key={i} className="text-gray-600 leading-relaxed">{para}</p>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <InfoCard label="Origin" value={enrichedProduct.origin} icon={MapPin} />
                            <InfoCard label="Local Name" value={enrichedProduct.localName} icon={Globe} />
                            <InfoCard label="Botanical Name" value={enrichedProduct.botanicalName} icon={Leaf} italic />
                            <InfoCard label="Cultural Role" value={enrichedProduct.culturalImportance} icon={School} />
                            <InfoCard label="Regional Use" value={enrichedProduct.regionalUsage} icon={Map} />
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 3 - HEALTH BENEFITS
                ══════════════════════════════════════════════════ */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#C17F24]/10 flex items-center justify-center">
                            <HeartPulse className="w-5 h-5 text-[#C17F24]" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-[#2C1A0E]">Health Benefits of {enrichedProduct.name.split(' ')[0]}</h2>
                    </div>
                    <p className="text-gray-500 mt-2 mb-6 max-w-2xl">
                        Backed by traditional Ayurvedic wisdom and modern nutritional science.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {enrichedProduct.benefits?.map((b: any, i: number) => (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-[#e8ddd0] hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-xl bg-[#C47F17]/10 flex items-center justify-center mb-3">
                                    <Leaf className="w-4 h-4 text-[#C17F24]" />
                                </div>
                                <h3 className="font-bold text-[#2C1A0E] mb-2">{b.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4 italic">
                        * These statements are for informational purposes only. This product is not intended to diagnose, treat, cure, or prevent any disease.
                    </p>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 4 - CULINARY USES
                ══════════════════════════════════════════════════ */}
                <section className="bg-[#2C1A0E] rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#C17F24]/20 flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-[#C17F24]" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-white">Culinary Uses & Cooking Tips</h2>
                    </div>
                    <p className="text-gray-400 mt-2 mb-6">How to use {enrichedProduct.name} like an Indian chef</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrichedProduct.culinaryUses?.map((u: any, i: number) => (
                            <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <Utensils className="w-4 h-4 text-[#C17F24]" />
                                    <h3 className="font-bold text-white">{u.dish}</h3>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{u.tip}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 5 - WHY CHOOSE SAVIKA
                ══════════════════════════════════════════════════ */}
                <section>
                    <SectionHeading icon={faAward} text="Why Choose Savika?" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                        {[
                            { icon: faUtensils, title: 'Stone Ground Fresh', desc: 'Ground in small batches to preserve essential oils and peak flavour' },
                            { icon: faHandshake, title: 'Ethical Direct Sourcing', desc: 'Directly from verified farms - no middlemen, fair farmer prices' },
                            { icon: faBan, title: 'Zero Preservatives', desc: 'No artificial colour, no salt, no anti-caking agents - ever' },
                            { icon: faTruck, title: 'Pan-India Shipping', desc: 'Delivered to all 28 states within 3-7 business days' },
                        ].map((f) => (
                            <div key={f.title} className="bg-[#FFF8F0] rounded-2xl p-5 border border-[#e8ddd0] text-center">
                                <div className="w-12 h-12 rounded-full bg-[#C17F24]/15 flex items-center justify-center mx-auto mb-3">
                                    <FontAwesomeIcon icon={f.icon} className="w-5 h-5 text-[#C17F24]" />
                                </div>
                                <h3 className="font-bold text-[#2C1A0E] mb-1">{f.title}</h3>
                                <p className="text-xs text-gray-500">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 6 - STORAGE & SHELF LIFE
                ══════════════════════════════════════════════════ */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-7 border border-[#e8ddd0]">
                        <h2 className="text-xl font-extrabold text-[#2C1A0E] mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBoxOpen} className="w-5 h-5 text-[#C17F24]" />
                            Storage &amp; Shelf Life
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#C47F17]/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-[#C17F24]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#2C1A0E] text-sm">Shelf Life</p>
                                    <p className="text-sm text-gray-500">{enrichedProduct.storageLife}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#C47F17]/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <FontAwesomeIcon icon={faArchive} className="w-3 h-3 text-[#C17F24]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#2C1A0E] text-sm">How to Store</p>
                                    <p className="text-sm text-gray-500">{enrichedProduct.storageInstructions}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ──────── Sourcing Story ──────── */}
                    <section className="bg-[#FFF8F0] rounded-3xl p-7 border border-[#e8ddd0]">
                        <h2 className="text-xl font-extrabold text-[#2C1A0E] mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faLeaf} className="w-5 h-5 text-[#C17F24]" />
                            Sourcing Story
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{enrichedProduct.sourcingStory}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#C47F17]">
                            <FontAwesomeIcon icon={faLeaf} className="w-3 h-3" />
                            <span>Farm-to-kitchen transparency</span>
                        </div>
                    </section>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 7 - FAQ
                ══════════════════════════════════════════════════ */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#C17F24]/10 flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-[#C17F24]" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-[#2C1A0E]">Frequently Asked Questions</h2>
                    </div>
                    <div className="mt-6 space-y-3 max-w-3xl">
                        {enrichedProduct.faqs?.map((faq: any, i: number) => (
                            <details
                                key={i}
                                className="group bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-semibold text-[#2C1A0E] hover:bg-[#FFF8F0] transition-colors">
                                    <span>{faq.q}</span>
                                    <ChevronDown className="w-4 h-4 text-[#C17F24] group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-[#e8ddd0] pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    SECTION 8 - INTERNAL LINKS / RELATED PRODUCTS
                ══════════════════════════════════════════════════ */}
                <section className="pb-4">
                    <SectionHeading icon={faFire} text="You May Also Like" />
                    <div className="flex flex-wrap gap-4 mt-5">
                        {enrichedProduct.relatedProducts?.map((rp: any) => (
                            <Link
                                key={rp.slug}
                                href={`/product/${rp.slug}`}
                                className="flex items-center gap-2 bg-white border border-[#e8ddd0] hover:border-[#C47F17] hover:bg-[#FFF8F0] text-[#2C1A0E] font-semibold px-4 py-2.5 rounded-full text-sm transition-all"
                            >
                                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-[#C17F24]" />
                                {rp.name}
                            </Link>
                        ))}
                        <Link
                            href="/shop"
                            className="flex items-center gap-2 bg-[#C47F17]/10 border border-[#C47F17]/30 hover:bg-[#C47F17] hover:text-white text-[#C47F17] font-semibold px-4 py-2.5 rounded-full text-sm transition-all"
                        >
                            <FontAwesomeIcon icon={faStore} className="w-3 h-3" />
                            View Complete Indian Spice Collection
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}

// ─── Sub-components ──────────────────────────────────────────────────────

function SectionHeading({ icon, text, dark }: { icon: any; text: string; dark?: boolean }) {
    return (
        <h2 className={`text-2xl font-extrabold flex items-center gap-3 ${dark ? 'text-white' : 'text-[#2C1A0E]'}`}>
            <div className="w-9 h-9 rounded-xl bg-[#C17F24]/20 flex items-center justify-center">
                <FontAwesomeIcon icon={icon} className="w-4 h-4 text-[#C17F24]" />
            </div>
            {text}
        </h2>
    )
}

function InfoCard({ label, value, icon: Icon, italic }: { label: string; value: string; icon: any; italic?: boolean }) {
    return (
        <div className="bg-[#FFF8F0] rounded-xl p-4 border border-[#e8ddd0]">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3.5 h-3.5 text-[#C17F24]" />
                <span className="text-xs font-bold text-[#8E562E] uppercase tracking-wider">{label}</span>
            </div>
            <p className={`text-sm text-[#2C1A0E] font-medium ${italic ? 'italic' : ''}`}>{value || 'Not Specified'}</p>
        </div>
    )
}

function WeightSelector({ options }: { options: string[] }) {
    // Client interaction - uses details/summary for no-JS fallback
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt, i) => (
                <button
                    key={opt}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${i === 1
                        ? 'border-[#C47F17] bg-[#C47F17] text-white'
                        : 'border-[#e8ddd0] bg-white text-[#2E2E2E] hover:border-[#C47F17]'
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    )
}
