import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

const BESTSELLERS: Product[] = [
    { $id: 'bs1', slug: 'star-anise-whole', name: 'Star Anise - Premium Whole', description: '', price: 299, comparePrice: 399, stock: 40, categoryId: 'cat1', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', imageId: '', sortOrder: 0, $createdAt: '', $updatedAt: '' } },
    { $id: 'bs2', slug: 'coriander-powder', name: 'Coriander Powder - Freshly Ground', description: '', price: 189, stock: 90, categoryId: 'cat2', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', imageId: '', sortOrder: 1, $createdAt: '', $updatedAt: '' } },
    { $id: 'bs3', slug: 'biryani-masala', name: 'Royal Biryani Masala', description: '', price: 349, comparePrice: 449, stock: 25, categoryId: 'cat3', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' } },
    { $id: 'bs4', slug: 'saffron-premium', name: 'Kashmiri Saffron - Grade A', description: '', price: 1299, stock: 15, categoryId: 'cat5', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat5', slug: 'exotics-rare', name: 'Exotics & Rare', imageId: '', sortOrder: 4, $createdAt: '', $updatedAt: '' } },
]

export default function BestSellers() {
    return (
        <section style={{ padding: '3.5rem 1rem', background: '#fff' }}>
            <div className="section-wrap">
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#8E562E', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Customer Favourites</p>
                        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, color: '#2E2E2E' }}>
                            The <span style={{ color: '#C17F24', fontStyle: 'italic' }}>Spice Edit</span>
                        </h2>
                    </div>
                    <Link href="/shop" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#C17F24', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        View All
                    </Link>
                </div>
                <div className="grid-products">
                    {BESTSELLERS.map((product) => (
                        <ProductCard key={product.$id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
