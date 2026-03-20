import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types/database'

const MOCK_PRODUCTS: Product[] = [
    { id: '1', slug: 'kashmiri-mirch-whole', name: 'Kashmiri Mirch - Whole', description: '', price: 299, sale_price: 199, stock: 50, category_id: 'cat1', images: [], is_featured: true, is_active: true, created_at: '', weight_options: ['50g', '100g', '250g'], category: { id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', created_at: '' } },
    { id: '2', slug: 'premium-turmeric-powder', name: 'Premium Turmeric Powder', description: '', price: 249, sale_price: undefined, stock: 80, category_id: 'cat2', images: [], is_featured: true, is_active: true, created_at: '', weight_options: ['100g', '250g', '500g'], category: { id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', created_at: '' } },
    { id: '3', slug: 'garam-masala-artisan', name: 'Artisan Garam Masala', description: '', price: 399, sale_price: 299, stock: 35, category_id: 'cat3', images: [], is_featured: true, is_active: true, created_at: '', weight_options: ['100g', '250g'], category: { id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', created_at: '' } },
    { id: '4', slug: 'black-pepper-malabar', name: 'Malabar Black Pepper', description: '', price: 349, sale_price: undefined, stock: 60, category_id: 'cat1', images: [], is_featured: true, is_active: true, created_at: '', weight_options: ['50g', '100g', '250g', '500g'], category: { id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', created_at: '' } },
]

export default function FeaturedProducts() {
    return (
        <section style={{ padding: '3.5rem 1rem', background: '#F9F4EE' }}>
            <div className="section-wrap">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#8E562E', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Handpicked Selection</p>
                        <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, color: '#2E2E2E' }}>
                            Shop Our <span style={{ color: '#C47F17', fontStyle: 'italic' }}>Spice Heroes</span>
                        </h2>
                    </div>
                    <Link href="/shop" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#C47F17', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        View All →
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid-products">
                    {MOCK_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
