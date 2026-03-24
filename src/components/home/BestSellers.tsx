import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

const BESTSELLERS: Product[] = [
    {
        $id: '5', name: 'Chicken Masala', tagline: 'Perfect Non-Veg Taste', slug: 'chicken-masala',
        category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat3', price: 225, stock: 150, isActive: true,
        imageIds: ['/images/products/biryani-masala.jpg'],
        description: 'Specially crafted masala blend for chicken curries, tikka, and gravies. Every spice chosen for its role - delivering the perfect non-veg taste every time.'
    },
    {
        $id: '6', name: 'Meat Masala', tagline: 'Dumdar Flavour', slug: 'meat-masala',
        category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat3', price: 245, stock: 120, isActive: true,
        imageIds: ['/images/products/black-pepper-malabar.jpg'],
        description: 'A bold, robust blend for mutton, lamb, and beef preparations. Deep, complex, and uncompromisingly dumdar - this masala means serious cooking.'
    },
    {
        $id: '7', name: 'Deshi Ghati Masala', tagline: 'Special Traditional Blend', slug: 'deshi-ghati-masala',
        category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat3', price: 325, stock: 40, isActive: true,
        imageIds: ['/images/products/star-anise-whole.jpg'],
        description: 'A rare traditional masala from the Ghati region, crafted from a secret family recipe. The special traditional blend that carries decades of culinary heritage in every spoon.'
    },
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
