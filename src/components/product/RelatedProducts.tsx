import { createClient } from '@/lib/supabase/server'
import ProductCard from './ProductCard'

interface RelatedProductsProps {
    categoryId: string
    currentProductId: string
}

export default async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .neq('id', currentProductId) // Don't show current product
        .limit(4)

    if (!products || products.length === 0) return null

    return (
        <section className="py-12 border-t border-gray-100">
            <h2 className="text-2xl font-black text-[#2E2E2E] uppercase tracking-tighter mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 text-sm">🔥</span>
                </span>
                You May Also Like
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}
