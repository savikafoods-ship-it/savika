import { createSessionClient, COL_CATEGORIES, DB_ID } from '@/lib/appwrite/server'
import { Query } from 'node-appwrite'
import { redirect } from 'next/navigation'
import { Plus, Edit, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
    let categories: any[] = []

    try {
        const { account, databases } = await createSessionClient()
        await account.get()
        
        const res = await databases.listDocuments(
            DB_ID,
            COL_CATEGORIES,
            [Query.orderAsc('sortOrder'), Query.limit(50)]
        )
        categories = res.documents
    } catch {
        redirect('/admin/login')
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Categories</h1>
                    <p className="text-[#a1a1aa] text-sm mt-1">Organize your products into navigation categories.</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-4 py-2 rounded-lg font-semibold transition-colors w-fit">
                    <Plus className="w-4 h-4" /> Add Category
                </button>
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
                            <tr key={cat.$id} className="hover:bg-[#27272a]/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white mb-0.5">{cat.name}</div>
                                    <div className="text-xs text-[#a1a1aa]">/{cat.slug}</div>
                                </td>
                                <td className="px-6 py-4 text-[#e4e4e7]">
                                    {cat.sortOrder || 0}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 text-[#a1a1aa]">
                                        <button className="p-2 hover:bg-[#27272a] hover:text-white rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                        <button className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
