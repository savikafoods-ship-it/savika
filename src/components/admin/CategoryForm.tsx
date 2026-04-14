'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave, faSpinner, faImage, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, X } from 'lucide-react'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

export default function CategoryForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        sort_order: initialData?.sort_order?.toString() || '0',
        image_url: initialData?.image_url || '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleNameChange = (name: string) => {
        if (!initialData) {
            const slug = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            setFormData(prev => ({ ...prev, name, slug }))
        } else {
            setFormData(prev => ({ ...prev, name }))
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `cat_${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = fileName // Upload to 'products' bucket

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            setFormData(prev => ({
                ...prev,
                image_url: fileName // Store just the filename
            }))
        } catch (err: any) {
            alert(`Error uploading image: ${err.message}`)
        } finally {
            setUploading(false)
        }
    }

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image_url: '' }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)

        try {
            if (!formData.name) throw new Error('Name is required')
            if (!formData.slug) throw new Error('Slug is required')

            const dataToSave = {
                name: formData.name,
                slug: formData.slug,
                sort_order: parseInt(formData.sort_order) || 0,
                image_url: formData.image_url || null,
            }

            if (initialData?.id) {
                const res = await fetch('/api/admin/categories', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: initialData.id, ...dataToSave }),
                })
                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.error || 'Failed to update category')
                }
            } else {
                const res = await fetch('/api/admin/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                })
                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.error || 'Failed to create category')
                }
            }

            router.push('/admin/categories')
            router.refresh()
        } catch (err: any) {
            alert(err.message || 'Failed to save category')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/categories" className="p-2 hover:bg-[#27272a] text-[#a1a1aa] hover:text-white rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        {initialData ? 'Edit Category' : 'Add New Category'}
                    </h1>
                </div>
                <button 
                    type="submit" 
                    disabled={loading || uploading}
                    className="flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-6 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={loading ? faSpinner : faSave} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Save Category
                </button>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Category Name</label>
                        <input 
                            required 
                            type="text" 
                            value={formData.name} 
                            onChange={e => handleNameChange(e.target.value)} 
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none transition-all" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">URL Slug</label>
                        <input 
                            required 
                            type="text" 
                            value={formData.slug} 
                            onChange={e => setFormData({...formData, slug: e.target.value})} 
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] rounded-lg px-4 py-2.5 outline-none font-mono text-sm" 
                            readOnly={!!initialData}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Sort Order</label>
                        <input 
                            type="number" 
                            value={formData.sort_order} 
                            onChange={e => setFormData({...formData, sort_order: e.target.value})} 
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none transition-all" 
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-[#e4e4e7]">Category Image</label>
                        
                        {!formData.image_url ? (
                            <label className="relative flex flex-col items-center justify-center w-full h-32 bg-[#27272a] border-2 border-dashed border-[#3f3f46] hover:border-[#C17F24] rounded-xl cursor-pointer transition-all group overflow-hidden">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FontAwesomeIcon icon={uploading ? faSpinner : faPlus} className={`w-6 h-6 text-[#a1a1aa] group-hover:text-[#C17F24] mb-2 ${uploading ? 'animate-spin' : ''}`} />
                                    <p className="text-xs text-[#a1a1aa] font-black uppercase tracking-widest">{uploading ? 'Uploading...' : 'Upload Image'}</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        ) : (
                            <div className="relative w-full h-32 bg-[#27272a] border border-[#3f3f46] rounded-xl overflow-hidden group">
                                <Image 
                                    src={getProductImageUrl(formData.image_url)} 
                                    alt="Preview" 
                                    fill 
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                                <button 
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-1.5 translate-y-full group-hover:translate-y-0 transition-transform">
                                    <p className="text-[10px] text-white/70 font-mono truncate px-2">{formData.image_url}</p>
                                </div>
                            </div>
                        )}
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                            Upload a high-quality 1:1 image or banner icon for this category.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}

