import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { createClient } from '@/lib/supabase/server'

export default async function BestSellers() {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: true }) // Different order for variety
        .limit(4)

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
                    {products?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {(!products || products.length === 0) && (
                    <div className="py-10 text-center text-gray-500 italic">
                        Checking inventory for your favorites...
                    </div>
                )}
            </div>
        </section>
    )
}
