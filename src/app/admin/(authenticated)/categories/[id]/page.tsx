import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import CategoryForm from '@/components/admin/CategoryForm'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let category = null

    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) throw error
        category = data
    } catch (error: any) {
        console.error('Error fetching category:', error)
        redirect('/admin/categories')
    }

    return (
        <div className="pb-10 space-y-6">
            <CategoryForm initialData={category} />
        </div>
    )
}
