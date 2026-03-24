import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

const MOCK_PRODUCTS: Product[] = [
    {
        $id: '1', name: 'Red Chilli Powder', tagline: 'Tikha Swad', slug: 'red-chilli-powder',
        category: { $id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', imageId: '', sortOrder: 1, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat2', price: 185, stock: 100, isActive: true,
        imageIds: ['/images/products/kashmiri-mirch-whole.jpg'],
        description: 'Pure red chilli powder with the authentic fiery heat of Indian kitchens. No fillers, no artificial color. Just the real tikha swad that elevates every dish.'
    },
    {
        $id: '2', name: 'Garam Masala', tagline: 'Rich Aroma', slug: 'garam-masala',
        category: { $id: 'cat3', slug: 'blends-masalas', name: 'Blends & Masalas', imageId: '', sortOrder: 2, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat3', price: 295, stock: 80, isActive: true,
        imageIds: ['/images/products/garam-masala-artisan.jpg'],
        description: 'A perfectly balanced blend of whole spices, slow-roasted and stone-ground. The rich aroma of Savika Garam Masala transforms ordinary meals into unforgettable ones.'
    },
    {
        $id: '3', name: 'Turmeric Powder', tagline: 'Rang Aur Shuddhta', slug: 'turmeric-powder',
        category: { $id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', imageId: '', sortOrder: 1, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat2', price: 145, stock: 120, isActive: true,
        imageIds: ['/images/products/premium-turmeric-powder.jpg'],
        description: 'Cold-ground pure turmeric with high curcumin content. The vibrant rang and shuddhta of this turmeric is unmatched - sourced directly from Erode, Tamil Nadu.'
    },
    {
        $id: '4', name: 'Coriander Powder', tagline: 'Khushboo Bhara Taste', slug: 'coriander-powder',
        category: { $id: 'cat2', slug: 'ground-powdered', name: 'Ground & Powdered', imageId: '', sortOrder: 1, $createdAt: '', $updatedAt: '' },
        categoryId: 'cat2', price: 165, stock: 90, isActive: true,
        imageIds: ['/images/products/coriander-powder.jpg'],
        description: 'Freshly ground coriander with an unmistakable khushboo. Adds a warm, citrusy depth to curries, dals, and marinades. 100% pure, no mixing.'
    },
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
