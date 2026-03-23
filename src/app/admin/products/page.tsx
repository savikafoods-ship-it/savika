import Link from 'next/link'
import { Plus, Search, Tag, Edit, Trash2 } from 'lucide-react'
import { createSessionClient } from '@/lib/appwrite/server'
import { Query } from 'node-appwrite'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
    let products: any[] = []

    try {
        const { account, databases } = await createSessionClient()
        const user = await account.get()
        
        // Verify admin (assuming team 'admins' or simple check based on prefs/labels)
        // For now, if they can get here, they are admin as per layout guard
        
        const res = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_COL_PRODUCTS!,
            [Query.orderDesc('$createdAt'), Query.limit(100)]
        )
        products = res.documents
    } catch {
        redirect('/admin/login')
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Products</h1>
                    <p className="text-[#a1a1aa] text-sm mt-1">Manage your spice catalog, inventory, and pricing.</p>
                </div>
                <Link 
                    href="/admin/products/new" 
                    className="inline-flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors w-fit"
                >
                    <Plus className="w-5 h-5" /> Add Product
                </Link>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#27272a] flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="w-full bg-[#27272a] border-none text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-[#C17F24] outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button className="px-4 py-2 bg-[#27272a] text-[#e4e4e7] hover:text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                            <Tag className="w-4 h-4" /> Filter by Category
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#27272a]/50 text-[#a1a1aa]">
                            <tr>
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Stock</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272a]">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#a1a1aa]">
                                        No products found. Start by adding a new product.
                                    </td>
                                </tr>
                            ) : products.map(product => (
                                <tr key={product.$id} className="hover:bg-[#27272a]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#27272a] rounded-lg overflow-hidden shrink-0 relative">
                                                {product.imageIds?.[0] ? (
                                                    <Image src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_PRODUCTS}/files/${product.imageIds[0]}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`} alt={product.name} fill className="object-cover" />
                                                ) : null}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white mb-0.5">{product.name}</div>
                                                <div className="text-xs text-[#a1a1aa]">/{product.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {product.isActive ? 'Active' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${product.stock < 10 ? 'text-amber-400' : 'text-[#e4e4e7]'}`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#e4e4e7] font-medium">
                                        ₹{product.price}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-[#a1a1aa]">
                                            <Link href={`/admin/products/${product.$id}`} className="p-2 hover:bg-[#27272a] hover:text-white rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
