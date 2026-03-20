import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types/database'

// Mock products - replace with Supabase fetch from createClient().from('products').select(...)
const ALL_PRODUCTS: Product[] = [
    { id: '1', slug: 'kashmiri-mirch-whole', name: 'Kashmiri Mirch - Whole', description: 'Hand-picked from the valleys of Kashmir, these vibrant red chilies add colour without excessive heat.', price: 299, sale_price: 199, stock: 50, category_id: 'cat1', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', created_at: '' } },
    { id: '2', slug: 'premium-turmeric-powder', name: 'Premium Turmeric Powder', description: 'Single-origin Erode turmeric, freshly milled for maximum curcumin content.', price: 249, stock: 80, category_id: 'cat2', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', created_at: '' } },
    { id: '3', slug: 'garam-masala-artisan', name: 'Artisan Garam Masala', description: 'A complex, warming blend of 12 whole spices, slow-roasted and stone-ground.', price: 399, sale_price: 299, stock: 35, category_id: 'cat3', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', created_at: '' } },
    { id: '4', slug: 'malabar-black-pepper', name: 'Malabar Black Pepper', description: 'The OG of Indian spices. Bold, robust, and intensely aromatic.', price: 349, stock: 60, category_id: 'cat1', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', created_at: '' } },
    { id: '5', slug: 'star-anise-whole', name: 'Star Anise - Premium Whole', description: 'Star anise from Assam - licorice-sweet, fragrant and bolder than any import.', price: 399, sale_price: 299, stock: 40, category_id: 'cat1', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', created_at: '' } },
    { id: '6', slug: 'coriander-powder', name: 'Coriander Powder - Freshly Ground', description: 'Freshly ground from Rajasthan coriander seeds. Warm, nutty, everyday essential.', price: 189, stock: 90, category_id: 'cat2', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', created_at: '' } },
    { id: '7', slug: 'biryani-masala', name: 'Royal Biryani Masala', description: 'The secret behind restaurant-quality biryani. A fragrant, layered blend.', price: 449, sale_price: 349, stock: 25, category_id: 'cat3', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', created_at: '' } },
    { id: '8', slug: 'kashmiri-saffron', name: 'Kashmiri Saffron - Grade A', description: 'Hand-harvested from the Pampore fields. Certified Grade A by J&K Govt.', price: 1299, stock: 15, category_id: 'cat5', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat5', slug: 'exotics-rare', name: 'Exotics & Rare', created_at: '' } },
]

export const metadata: Metadata = {
    title: 'Shop All Premium Indian Spices Online | Savika',
    description: 'Browse 50+ premium whole spices, ground masalas, and artisan blends. Pure, FSSAI certified. Buy spices online India with fast delivery.',
    openGraph: { title: 'Shop Savika – Premium Indian Spices', description: 'Browse 50+ premium spice varieties.', locale: 'en_IN' },
    alternates: { canonical: 'https://savika.in/shop' },
}

const CATEGORIES = [
    { label: 'All', value: 'all' },
    { label: 'Whole Spices', value: 'whole-spices' },
    { label: 'Ground & Powdered', value: 'ground-powdered' },
    { label: 'Blends & Masalas', value: 'blends-masalas' },
    { label: 'Gift Packs', value: 'gift-packs' },
    { label: 'Exotics & Rare', value: 'exotics-rare' },
]

export default function ShopPage() {
    const breadcrumb = [
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://savika.in' }, { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://savika.in/shop' }] }
    ]

    return (
        <div className="min-h-screen bg-[#F9F4EE]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

            {/* Header */}
            <div className="bg-white border-b border-[#e8ddd0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <nav className="flex items-center gap-2 text-xs text-gray-400 font-[var(--font-poppins)] mb-3">
                        <Link href="/" className="hover:text-[#C47F17]">Home</Link>
                        <span>/</span>
                        <span className="text-[#C47F17]">Shop</span>
                    </nav>
                    <h1 className="text-3xl lg:text-4xl font-bold font-[var(--font-playfair)] text-[#2E2E2E]">
                        All <span className="text-[#C47F17] italic">Spices</span>
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 font-[var(--font-poppins)]">Showing {ALL_PRODUCTS.length} products</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.value} href={cat.value === 'all' ? '/shop' : `/category/${cat.value}`}
                            className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold font-[var(--font-poppins)] border transition-all duration-200 ${cat.value === 'all'
                                    ? 'bg-[#C47F17] text-white border-[#C47F17]'
                                    : 'bg-white text-[#2E2E2E] border-[#e8ddd0] hover:border-[#C47F17] hover:text-[#C47F17]'
                                }`}>
                            {cat.label}
                        </Link>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {ALL_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}
