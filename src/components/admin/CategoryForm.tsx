'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle } from 'lucide-react'

export default function CategoryForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
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
                const { error } = await supabase
                    .from('categories')
                    .update(dataToSave)
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert([dataToSave])
                if (error) throw error
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
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-6 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={loading ? faSpinner : faSave} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Save Category
                </button>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Sort Order</label>
                        <input 
                            type="number" 
                            value={formData.sort_order} 
                            onChange={e => setFormData({...formData, sort_order: e.target.value})} 
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none transition-all" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Image URL (Optional)</label>
                        <input 
                            type="text" 
                            value={formData.image_url} 
                            onChange={e => setFormData({...formData, image_url: e.target.value})} 
                            placeholder="https://..."
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none transition-all" 
                        />
                    </div>
                </div>
            </div>
        </form>
    )
}
