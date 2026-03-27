import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
    let categories: any[] = []

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) redirect('/admin/login')
        
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true })
            .limit(50)
            
        if (error) throw error
        categories = data || []
    } catch (err) {
        console.error('Error fetching categories:', err)
        // Fallback or redirect
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Categories</h1>
                    <p className="text-[#a1a1aa] text-sm mt-1">Organize your products into navigation categories.</p>
                </div>
                <Link 
                    href="/admin/categories/new" 
                    className="inline-flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-4 py-2 rounded-lg font-semibold transition-colors w-fit"
                >
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Add Category
                </Link>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#27272a]/50 text-[#a1a1aa]">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name & Slug</th>
                            <th className="px-6 py-4 font-medium">Sort Order</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-[#a1a1aa]">No categories found.</td>
                            </tr>
                        ) : categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-[#27272a]/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white mb-0.5">{cat.name}</div>
                                    <div className="text-xs text-[#a1a1aa]">/{cat.slug}</div>
                                </td>
                                <td className="px-6 py-4 text-[#e4e4e7]">
                                    {cat.sort_order || 0}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 text-[#a1a1aa]">
                                        <Link href={`/admin/categories/${cat.id}`} className="p-2 hover:bg-[#27272a] hover:text-white rounded-lg transition-colors">
                                            <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
                                        </Link>
                                        <DeleteButton table="categories" id={cat.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
