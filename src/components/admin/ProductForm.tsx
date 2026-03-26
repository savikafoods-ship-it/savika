'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave, faSpinner, faImage, faPlus } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'

export default function ProductForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        tagline: initialData?.tagline || '',
        local_name: initialData?.local_name || '',
        price: initialData?.price?.toString() || '',
        compare_price: initialData?.compare_price?.toString() || '',
        stock: initialData?.stock?.toString() || '100',
        description: initialData?.description || '',
        is_active: initialData?.is_active ?? true,
        category_id: initialData?.category_id || '',
        image_urls: initialData?.image_urls || [] as string[],
        weight_options: initialData?.weight_options || [] as any[],
        metadata: initialData?.metadata || { benefits: [], culinaryUses: [], faqs: [] }
    })

    const [uploading, setUploading] = useState(false)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `products/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath)

            setFormData(prev => ({
                ...prev,
                image_urls: [...prev.image_urls, publicUrl]
            }))
        } catch (err: any) {
            alert(`Error uploading image: ${err.message}`)
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            image_urls: prev.image_urls.filter((_img: string, i: number) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const dataToSave = {
                name: formData.name,
                slug: formData.slug,
                tagline: formData.tagline,
                local_name: formData.local_name,
                price: parseFloat(formData.price),
                compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
                stock: parseInt(formData.stock),
                description: formData.description,
                is_active: formData.is_active,
                category_id: formData.category_id || null,
                image_urls: formData.image_urls,
                weight_options: formData.weight_options,
                metadata: formData.metadata,
                updated_at: new Date().toISOString(),
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                             <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Tagline</label>
                                <input type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} placeholder="e.g. Pure Sun-Dried Spice" className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Local Name</label>
                                <input type="text" value={formData.local_name} onChange={e => setFormData({...formData, local_name: e.target.value})} placeholder="e.g. Kashmiri Lal Mirch" className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none" />
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-sm font-medium text-[#e4e4e7]">Description</label>
                            <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-3 focus:border-[#C17F24] focus:ring-1 focus:ring-[#C17F24] outline-none transition-all" />
                        </div>
                    </div>

                    {/* Weight Options */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Weight-Based Pricing</h2>
                            <button 
                                type="button" 
                                onClick={() => setFormData(p => ({ ...p, weight_options: [...p.weight_options, { label: '100g', price: 0, salePrice: 0 }] }))}
                                className="text-xs font-bold text-[#C17F24] hover:underline"
                            >
                                + Add Weight
                            </button>
                        </div>
                        {formData.weight_options.map((opt: any, i: number) => (
                            <div key={i} className="grid grid-cols-3 gap-3 p-3 bg-[#27272a] rounded-lg relative group">
                                <input type="text" value={opt.label} onChange={e => {
                                    const next = [...formData.weight_options]; next[i].label = e.target.value;
                                    setFormData({...formData, weight_options: next})
                                }} className="bg-[#18181b] border border-[#3f3f46] text-white text-xs rounded-md px-2 py-1.5" placeholder="Size" />
                                <input type="number" value={opt.price} onChange={e => {
                                    const next = [...formData.weight_options]; next[i].price = parseFloat(e.target.value);
                                    setFormData({...formData, weight_options: next})
                                }} className="bg-[#18181b] border border-[#3f3f46] text-white text-xs rounded-md px-2 py-1.5" placeholder="Price" />
                                <input type="number" value={opt.salePrice} onChange={e => {
                                    const next = [...formData.weight_options]; next[i].salePrice = parseFloat(e.target.value);
                                    setFormData({...formData, weight_options: next})
                                }} className="bg-[#18181b] border border-[#3f3f46] text-white text-xs rounded-md px-2 py-1.5" placeholder="Sale" />
                                <button type="button" onClick={() => setFormData((p: any) => ({ ...p, weight_options: p.weight_options.filter((_opt: any, idx: number) => idx !== i) }))} className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                            </div>
                        ))}
                    </div>

                    {/* Metadata Segments */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-white mb-2">Advanced Metadata (Real-time Preview Support)</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#e4e4e7]">Benefits (JSON Array)</label>
                                <textarea 
                                    rows={4} 
                                    value={JSON.stringify(formData.metadata.benefits, null, 2)} 
                                    onChange={e => {
                                        try { setFormData({...formData, metadata: {...formData.metadata, benefits: JSON.parse(e.target.value)}})} catch {}
                                    }}
                                    className="w-full bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] rounded-lg px-4 py-3 font-mono text-xs" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#e4e4e7]">FAQs (JSON Array)</label>
                                <textarea 
                                    rows={4} 
                                    value={JSON.stringify(formData.metadata.faqs, null, 2)} 
                                    onChange={e => {
                                        try { setFormData({...formData, metadata: {...formData.metadata, faqs: JSON.parse(e.target.value)}})} catch {}
                                    }}
                                    className="w-full bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa] rounded-lg px-4 py-3 font-mono text-xs" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Media */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Media</h2>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {formData.image_urls.map((url: string, i: number) => (
                                <div key={i} className="relative aspect-square bg-[#27272a] rounded-lg overflow-hidden group">
                                    <img src={url} className="w-full h-full object-cover" alt="" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeImage(i)}
                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="text-white text-xs font-bold">Remove</span>
                                    </button>
                                </div>
                            ))}
                            {uploading ? (
                                <div className="aspect-square bg-[#27272a] border border-dashed border-[#3f3f46] rounded-lg flex items-center justify-center">
                                    <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 text-[#C17F24] animate-spin" />
                                </div>
                            ) : (
                                <button 
                                    type="button"
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                    className="aspect-square bg-[#27272a] border border-dashed border-[#3f3f46] rounded-lg flex flex-col items-center justify-center text-[#a1a1aa] hover:border-[#C17F24] transition-all"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mb-2" />
                                    <span className="text-[10px] font-bold">Add Image</span>
                                </button>
                            )}
                            <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                    </div>

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
                        <h2 className="text-lg font-semibold text-white mb-4">Base Pricing & Inventory</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Base Price (₹)</label>
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
