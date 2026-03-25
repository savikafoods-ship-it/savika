'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave, faSpinner, faImage } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'

export default function ProductForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        price: initialData?.price?.toString() || '',
        compare_price: initialData?.compare_price?.toString() || '',
        stock: initialData?.stock?.toString() || '100',
        description: initialData?.description || '',
        is_active: initialData?.is_active ?? true,
        category_id: initialData?.category_id || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const dataToSave = {
                name: formData.name,
                slug: formData.slug,
                price: parseFloat(formData.price),
                compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
                stock: parseInt(formData.stock),
                description: formData.description,
                is_active: formData.is_active,
                category_id: formData.category_id || null,
            }

            if (initialData?.id) {
                const { error } = await supabase
                    .from('products')
                    .update(dataToSave)
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert(dataToSave)
                if (error) throw error
            }
            
            router.push('/admin/products')
            router.refresh()
        } catch (err: any) {
            alert(err.message || 'Failed to save product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-[#27272a] text-[#a1a1aa] hover:text-white rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        {initialData ? 'Edit Product' : 'Add New Product'}
                    </h1>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-6 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={loading ? faSpinner : faSave} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Save Product
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Product Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] focus:ring-1 focus:ring-[#C17F24] outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">URL Slug</label>
                                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] rounded-lg px-4 py-2.5 outline-none font-mono text-sm" />
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-sm font-medium text-[#e4e4e7]">Description</label>
                            <textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-3 focus:border-[#C17F24] focus:ring-1 focus:ring-[#C17F24] outline-none transition-all" />
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Media</h2>
                        <div className="border-2 border-dashed border-[#3f3f46] rounded-xl p-8 text-center hover:bg-[#27272a]/50 transition-colors cursor-pointer">
                            <FontAwesomeIcon icon={faImage} className="w-8 h-8 text-[#a1a1aa] mx-auto mb-3" />
                            <p className="text-sm text-[#e4e4e7] font-medium">Click to upload images</p>
                            <p className="text-xs text-[#a1a1aa] mt-1">SVG, PNG, JPG or WEBP (max. 800x400px)</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Organization */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Organization</h2>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#e4e4e7]">Status</label>
                            <select value={formData.is_active ? 'active' : 'draft'} onChange={e => setFormData({...formData, is_active: e.target.value === 'active'})} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none">
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-sm font-medium text-[#e4e4e7]">Category ID</label>
                            <input type="text" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} placeholder="Supabase UUID" className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none" />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Pricing & Inventory</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Price (₹)</label>
                                <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Compare at (₹)</label>
                                <input type="number" step="0.01" value={formData.compare_price} onChange={e => setFormData({...formData, compare_price: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none" placeholder="Optional" />
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-sm font-medium text-[#e4e4e7]">Inventory Stock</label>
                            <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
