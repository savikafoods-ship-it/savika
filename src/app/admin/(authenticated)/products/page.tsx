import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faTag, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
    let products: any[] = []

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) redirect('/admin/login')
        
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)
            
        if (error) throw error
        products = data || []
    } catch (err) {
        console.error('Error fetching products:', err)
        // In a real app we might show an error UI, but for now we fallback to empty
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Products</h1>
                    <p className="text-[#a1a1aa] text-sm mt-1">Manage your spice catalog, inventory, and pricing.</p>
                </div>
                <Link 
                    href="/admin/products/new" 
                    className="inline-flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors w-fit"
                >
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Add Product
                </Link>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#27272a] flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="w-full bg-[#27272a] border-none text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-[#C17F24] outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button className="px-4 py-2 bg-[#27272a] text-[#e4e4e7] hover:text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                            <FontAwesomeIcon icon={faTag} className="w-4 h-4" /> Filter by Category
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
                                <tr key={product.id} className="hover:bg-[#27272a]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#27272a] rounded-lg overflow-hidden shrink-0 relative">
                                                {product.image_urls?.[0] ? (
                                                    <Image src={getProductImageUrl(product.image_urls[0])} alt={product.name} fill className="object-cover" />
                                                ) : null}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white mb-0.5">{product.name}</div>
                                                <div className="text-xs text-[#a1a1aa]">/{product.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {product.is_active ? 'Active' : 'Draft'}
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
                                            <Link href={`/admin/products/${product.id}`} className="p-2 hover:bg-[#27272a] hover:text-white rounded-lg transition-colors">
                                                <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
                                            </Link>
                                            <button className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors">
                                                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
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
