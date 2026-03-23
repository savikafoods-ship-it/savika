import { createSessionClient } from '@/lib/appwrite/server'
import { redirect, notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let product = null

    try {
        const { databases } = await createSessionClient()
        product = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_COL_PRODUCTS!,
            id
        )
    } catch (error: any) {
        if (error.code === 404) notFound()
        redirect('/admin/products')
    }

    return (
        <div className="pb-10 space-y-6">
            <ProductForm initialData={product} />
        </div>
    )
}
