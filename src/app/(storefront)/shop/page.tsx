import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

// Mock products - replace with Appwrite fetch
const ALL_PRODUCTS: Product[] = [
    {
        $id: '1', name: 'Red Chilli Powder', tagline: 'Tikha Swad', slug: 'red-chilli-powder',
        category: { $id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', imageId: '', sortOrder: 1, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat2', price: 185, stock: 100, isActive: true,
        imageIds: ['/images/products/kashmiri-mirch-whole.jpg'],
        description: 'Pure red chilli powder with the authentic fiery heat of Indian kitchens.'
    },
    {
        $id: '2', name: 'Garam Masala', tagline: 'Rich Aroma', slug: 'garam-masala',
        category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat3', price: 295, stock: 80, isActive: true,
        imageIds: ['/images/products/garam-masala-artisan.jpg'],
        description: 'A perfectly balanced blend of whole spices, slow-roasted and stone-ground.'
    },
    {
        $id: '3', name: 'Turmeric Powder', tagline: 'Rang Aur Shuddhta', slug: 'turmeric-powder',
        category: { $id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', imageId: '', sortOrder: 1, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat2', price: 145, stock: 120, isActive: true,
        imageIds: ['/images/products/premium-turmeric-powder.jpg'],
        description: 'Cold-ground pure turmeric with high curcumin content.'
    },
    {
        $id: '4', name: 'Coriander Powder', tagline: 'Khushboo Bhara Taste', slug: 'coriander-powder',
        category: { $id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', imageId: '', sortOrder: 1, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat2', price: 165, stock: 90, isActive: true,
        imageIds: ['/images/products/coriander-powder.jpg'],
        description: 'Freshly ground coriander with an unmistakable khushboo.'
    },
    {
        $id: '5', name: 'Chicken Masala', tagline: 'Perfect Non-Veg Taste', slug: 'chicken-masala',
        category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat3', price: 225, stock: 150, isActive: true,
        imageIds: ['/images/products/biryani-masala.jpg'],
        description: 'Specially crafted masala blend for chicken curries, tikka, and gravies.'
    },
    {
        $id: '6', name: 'Meat Masala', tagline: 'Dumdar Flavour', slug: 'meat-masala',
        category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat3', price: 245, stock: 120, isActive: true,
        imageIds: ['/images/products/black-pepper-malabar.jpg'],
        description: 'A bold, robust blend for mutton, lamb, and beef preparations.'
    },
    {
        $id: '7', name: 'Deshi Ghati Masala', tagline: 'Special Traditional Blend', slug: 'deshi-ghati-masala',
        category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat3', price: 325, stock: 40, isActive: true,
        imageIds: ['/images/products/star-anise-whole.jpg'],
        description: 'A rare traditional masala from the Ghati region, crafted from a secret family recipe.'
    },
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
