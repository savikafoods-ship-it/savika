import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
    title: 'Shop All Premium Indian Spices Online | Savika',
    description: 'Browse 50+ premium whole spices, ground masalas, and artisan blends. Pure, FSSAI certified. Buy spices online India with fast delivery.',
    openGraph: { title: 'Shop Savika – Premium Indian Spices', description: 'Browse 50+ premium spice varieties.', locale: 'en_IN' },
    alternates: { canonical: 'https://savikafoods.in/shop' },
}

export default async function ShopPage() {
    const supabase = await createClient()

    // Fetch Products
    const { data: products } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false }) as { data: any[] | null }

    // Inject 50gm Masala Combo if not present
    if (products && !products.some(p => p.slug === '50gm-masala-combo')) {
        products.unshift({
            id: '50gm-masala-combo',
            name: '50gm Masala Combo Pack',
            slug: '50gm-masala-combo',
            description: 'Experience the pure, stone-ground difference of Savika with our 50gm Masala Combo Pack.',
            price: 117,
            sale_price: 105,
            stock: 100,
            is_active: true,
            image_urls: ['/images/products/garam-masala-artisan.jpg'],
            category: { name: 'Blends & Masalas', slug: 'blends-masalas' }
        })
    }

    // Fetch Categories for Filter Pills
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

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
                    <p className="mt-2 text-sm text-gray-500">Showing {products?.length || 0} products</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                    <Link href="/shop"
                        className="shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 bg-[#C17F24] text-white border-[#C17F24]">
                        All
                    </Link>
                    {categories?.map((cat) => (
                        <Link key={cat.id} href={`/category/${cat.slug}`}
                            className="shrink-0 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 bg-white text-[#2E2E2E] border-[#e8ddd0] hover:border-[#C17F24] hover:text-[#C17F24]">
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {products?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                
                {(!products || products.length === 0) && (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No products found. Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
