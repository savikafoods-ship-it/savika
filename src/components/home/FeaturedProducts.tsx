import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

const MOCK_PRODUCTS: Product[] = [
    { $id: '1', slug: 'kashmiri-mirch-whole', name: 'Kashmiri Mirch - Whole', description: '', price: 199, comparePrice: 299, stock: 50, categoryId: 'cat1', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', imageId: '', sortOrder: 0, $createdAt: '', $updatedAt: '' } },
    { $id: '2', slug: 'premium-turmeric-powder', name: 'Premium Turmeric Powder', description: '', price: 249, stock: 80, categoryId: 'cat2', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', imageId: '', sortOrder: 1, $createdAt: '', $updatedAt: '' } },
    { $id: '3', slug: 'garam-masala-artisan', name: 'Artisan Garam Masala', description: '', price: 299, comparePrice: 399, stock: 35, categoryId: 'cat3', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' } },
    { $id: '4', slug: 'black-pepper-malabar', name: 'Malabar Black Pepper', description: '', price: 349, stock: 60, categoryId: 'cat1', imageIds: [], isActive: true, $createdAt: '', $updatedAt: '', category: { $id: 'cat1', slug: 'whole-spices', name: 'Whole Spices', imageId: '', sortOrder: 0, $createdAt: '', $updatedAt: '' } },
]

export default function FeaturedProducts() {
    return (
        <section style={{ padding: '3.5rem 1rem', background: '#F9F4EE' }}>
            <div className="section-wrap">
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#8E562E', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Handpicked Selection</p>
                        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, color: '#2E2E2E' }}>
                            Shop Our <span style={{ color: '#C17F24', fontStyle: 'italic' }}>Spice Heroes</span>
                        </h2>
                    </div>
                    <Link href="/shop" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#C17F24', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        View All
                    </Link>
                </div>
                <div className="grid-products">
                    {MOCK_PRODUCTS.map((product) => (
                        <ProductCard key={product.$id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
