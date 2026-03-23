import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

// Mock products - replace with Appwrite fetch
const ALL_PRODUCTS: Product[] = [
    { $id: '1', slug: 'kashmiri-mirch-whole', name: 'Kashmiri Mirch - Whole', description: 'Hand-picked from the valleys of Kashmir, these vibrant red chilies add colour without excessive heat.', price: 299, comparePrice: 199, stock: 50, categoryId: 'cat1', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', imageId: '', sortOrder: 0, $createdAt: '', $updatedAt: '' } },
    { $id: '2', slug: 'premium-turmeric-powder', name: 'Premium Turmeric Powder', description: 'Single-origin Erode turmeric, freshly milled for maximum curcumin content.', price: 249, stock: 80, categoryId: 'cat2', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', imageId: '', sortOrder: 1, $createdAt: '', $updatedAt: '' } },
    { $id: '3', slug: 'garam-masala-artisan', name: 'Artisan Garam Masala', description: 'A complex, warming blend of 12 whole spices, slow-roasted and stone-ground.', price: 399, comparePrice: 299, stock: 35, categoryId: 'cat3', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' } },
    { $id: '4', slug: 'malabar-black-pepper', name: 'Malabar Black Pepper', description: 'The OG of Indian spices. Bold, robust, and intensely aromatic.', price: 349, stock: 60, categoryId: 'cat1', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', imageId: '', sortOrder: 0, $createdAt: '', $updatedAt: '' } },
    { $id: '5', slug: 'star-anise-whole', name: 'Star Anise - Premium Whole', description: 'Star anise from Assam - licorice-sweet, fragrant and bolder than any import.', price: 399, comparePrice: 299, stock: 40, categoryId: 'cat1', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', imageId: '', sortOrder: 0, $createdAt: '', $updatedAt: '' } },
]

export const metadata: Metadata = {
    title: 'Shop All Premium Indian Spices Online | Savika',
    description: 'Browse 50+ premium whole spices, ground masalas, and artisan blends. Pure, FSSAI certified. Buy spices online India with fast delivery.',
    openGraph: { title: 'Shop Savika – Premium Indian Spices', description: 'Browse 50+ premium spice varieties.', locale: 'en_IN' },
    alternates: { canonical: 'https://savikafoods.in/shop' },
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
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://savikafoods.in' }, { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://savikafoods.in/shop' }] }
    ]

    return (
        <div className="min-h-screen bg-[#F5F0E8]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

            {/* Header */}
            <div className="bg-white border-b border-[#e8ddd0]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <nav className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <Link href="/" className="hover:text-[#C17F24]">Home</Link>
                        <span>/</span>
                        <span className="text-[#C17F24]">Shop</span>
                    </nav>
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#2E2E2E]">
                        All <span className="text-[#C17F24] italic">Spices</span>
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">Showing {ALL_PRODUCTS.length} products</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.value} href={cat.value === 'all' ? '/shop' : `/category/${cat.value}`}
                            className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${cat.value === 'all'
                                ? 'bg-[#C17F24] text-white border-[#C17F24]'
                                : 'bg-white text-[#2E2E2E] border-[#e8ddd0] hover:border-[#C17F24] hover:text-[#C17F24]'
                                }`}>
                            {cat.label}
                        </Link>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {ALL_PRODUCTS.map((product) => (
                        <ProductCard key={product.$id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}
