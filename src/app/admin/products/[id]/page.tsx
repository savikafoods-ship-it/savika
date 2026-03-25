import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let product = null

    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) throw error
        product = data
    } catch (error: any) {
        console.error('Error fetching product:', error)
        redirect('/admin/products')
    }

    return (
        <div className="pb-10 space-y-6">
            <ProductForm initialData={product} />
        </div>
    )
}
