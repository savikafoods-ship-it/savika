import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types/database'

const BESTSELLERS: Product[] = [
    { id: 'bs1', slug: 'star-anise-whole', name: 'Star Anise - Premium Whole', description: '', price: 399, sale_price: 299, stock: 40, category_id: 'cat1', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', created_at: '' } },
    { id: 'bs2', slug: 'coriander-powder', name: 'Coriander Powder - Freshly Ground', description: '', price: 189, sale_price: undefined, stock: 90, category_id: 'cat2', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', created_at: '' } },
    { id: 'bs3', slug: 'biryani-masala', name: 'Royal Biryani Masala', description: '', price: 449, sale_price: 349, stock: 25, category_id: 'cat3', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', created_at: '' } },
    { id: 'bs4', slug: 'saffron-premium', name: 'Kashmiri Saffron - Grade A', description: '', price: 1299, sale_price: undefined, stock: 15, category_id: 'cat5', images: [], is_featured: true, is_active: true, created_at: '', category: { id: 'cat5', slug: 'exotics-rare', name: 'Exotics & Rare', created_at: '' } },
]

export default function BestSellers() {
    return (
        <section style={{ padding: '3.5rem 1rem', background: '#fff' }}>
            <div className="section-wrap">
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#8E562E', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Customer Favourites</p>
                        <h2 style={{ fontFamily: 'var(--font-playfair, Georgia)', fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, color: '#2E2E2E' }}>
                            The <span style={{ color: '#C47F17', fontStyle: 'italic' }}>Spice Edit</span>
                        </h2>
                    </div>
                    <Link href="/shop" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#C47F17', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        View All →
                    </Link>
                </div>
                <div className="grid-products">
                    {BESTSELLERS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
