'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave, faSpinner, faImage, faPlus } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'
import { 
    Plus, 
    Trash2, 
    AlertCircle, 
    BookOpen, 
    HeartPulse, 
    Utensils, 
    HelpCircle,
    Info,
    AlertTriangle
} from 'lucide-react'
import { productSchema } from '@/lib/validations/product'
import { ZodError } from 'zod'

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
        metadata: initialData?.metadata || { benefits: [], culinaryUses: [], faqs: [] },
        generated_content: initialData?.generated_content || {
            what_is: { description: '', origin: 'India', botanical_name: '' },
            health_benefits: [] as { name: string; description: string }[],
            culinary_uses: [] as { dish: string; tip: string }[],
            faqs: [] as { question: string; answer: string }[]
        }
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [categories, setCategories] = useState<any[]>([])
    const [fetchingCategories, setFetchingCategories] = useState(false)

    // Fetch categories on mount
    useEffect(() => {
        const fetchCats = async () => {
            setFetchingCategories(true)
            const { data } = await supabase.from('categories').select('id, name').order('name')
            if (data) setCategories(data)
            setFetchingCategories(false)
        }
        fetchCats()
    }, [])

    // Auto-generate slug from name if new product
    const handleNameChange = (name: string) => {
        if (!initialData) {
            const slug = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            setFormData(prev => ({ ...prev, name, slug }))
        } else {
            setFormData(prev => ({ ...prev, name }))
        }
    }

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
        setErrors({})
        setLoading(true)
        
        try {
            // Validate with Zod
            const validatedData = productSchema.parse(formData)
            
            const dataToSave = {
                name: validatedData.name,
                slug: validatedData.slug,
                tagline: validatedData.tagline || '',
                local_name: validatedData.local_name || '',
                price: validatedData.price,
                compare_price: validatedData.compare_price || null,
                stock: validatedData.stock,
                description: validatedData.description || '',
                is_active: validatedData.is_active,
                category_id: validatedData.category_id || null,
                image_urls: validatedData.image_urls || [],
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
                                <input required type="text" value={formData.name} onChange={e => handleNameChange(e.target.value)} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] focus:ring-1 focus:ring-[#C17F24] outline-none transition-all" />
                                {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">URL Slug</label>
                                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-[#a1a1aa] rounded-lg px-4 py-2.5 outline-none font-mono text-sm" readOnly={!!initialData} />
                                {errors.slug && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.slug}</p>}
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

                    {/* ══════════════════════════════════════════════════
                        STRUCTURED CONTENT (Syncs with Live Page)
                    ══════════════════════════════════════════════════ */}
                    
                    {/* Section B1: What Is This Spice? */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#27272a] pb-4">
                            <BookOpen className="w-5 h-5 text-[#C17F24]" />
                            <h2 className="text-lg font-semibold text-white">Section B1: What Is This Spice?</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Main Description</label>
                                <textarea 
                                    rows={3} 
                                    value={formData.generated_content.what_is.description}
                                    onChange={e => setFormData({
                                        ...formData, 
                                        generated_content: {
                                            ...formData.generated_content, 
                                            what_is: { ...formData.generated_content.what_is, description: e.target.value }
                                        }
                                    })}
                                    placeholder="Briefly describe what this spice is..."
                                    className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#C17F24]" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#e4e4e7]">Origin</label>
                                    <input 
                                        type="text" 
                                        value={formData.generated_content.what_is.origin}
                                        onChange={e => setFormData({
                                            ...formData, 
                                            generated_content: {
                                                ...formData.generated_content, 
                                                what_is: { ...formData.generated_content.what_is, origin: e.target.value }
                                            }
                                        })}
                                        placeholder="e.g. India"
                                        className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#C17F24]" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-[#e4e4e7]">Botanical Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.generated_content.what_is.botanical_name}
                                        onChange={e => setFormData({
                                            ...formData, 
                                            generated_content: {
                                                ...formData.generated_content, 
                                                what_is: { ...formData.generated_content.what_is, botanical_name: e.target.value }
                                            }
                                        })}
                                        placeholder="e.g. Capsicum annuum"
                                        className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none italic focus:border-[#C17F24]" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section B2: Health Benefits */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
                            <div className="flex items-center gap-3">
                                <HeartPulse className="w-5 h-5 text-[#C17F24]" />
                                <h2 className="text-lg font-semibold text-white">Section B2: Health Benefits</h2>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setFormData({
                                    ...formData,
                                    generated_content: {
                                        ...formData.generated_content,
                                        health_benefits: [...formData.generated_content.health_benefits, { name: '', description: '' }]
                                    }
                                })}
                                className="flex items-center gap-1.5 text-xs font-bold text-[#C17F24] hover:bg-[#C17F24]/10 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Benefit
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.generated_content.health_benefits.map((benefit: any, index: number) => (
                                <div key={index} className="flex gap-3 items-start group">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#27272a] p-3 rounded-xl border border-transparent group-hover:border-[#3f3f46]">
                                        <input 
                                            type="text" 
                                            value={benefit.name}
                                            onChange={e => {
                                                const list = [...formData.generated_content.health_benefits]
                                                list[index].name = e.target.value
                                                setFormData({ ...formData, generated_content: { ...formData.generated_content, health_benefits: list } })
                                            }}
                                            placeholder="Benefit Name"
                                            className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none" 
                                        />
                                        <input 
                                            type="text" 
                                            value={benefit.description}
                                            onChange={e => {
                                                const list = [...formData.generated_content.health_benefits]
                                                list[index].description = e.target.value
                                                setFormData({ ...formData, generated_content: { ...formData.generated_content, health_benefits: list } })
                                            }}
                                            placeholder="Short Description"
                                            className="sm:col-span-2 bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none" 
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const list = formData.generated_content.health_benefits.filter((_: any, i: number) => i !== index)
                                            setFormData({ ...formData, generated_content: { ...formData.generated_content, health_benefits: list } })
                                        }}
                                        className="p-2 text-[#a1a1aa] hover:text-red-500 transition-colors mt-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section B3: Culinary Uses */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
                            <div className="flex items-center gap-3">
                                <Utensils className="w-5 h-5 text-[#C17F24]" />
                                <h2 className="text-lg font-semibold text-white">Section B3: Culinary Uses</h2>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setFormData({
                                    ...formData,
                                    generated_content: {
                                        ...formData.generated_content,
                                        culinary_uses: [...formData.generated_content.culinary_uses, { dish: '', tip: '' }]
                                    }
                                })}
                                className="flex items-center gap-1.5 text-xs font-bold text-[#C17F24] hover:bg-[#C17F24]/10 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Tip
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.generated_content.culinary_uses.map((tip: any, index: number) => (
                                <div key={index} className="flex gap-3 items-start group">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#27272a] p-3 rounded-xl border border-transparent group-hover:border-[#3f3f46]">
                                        <input 
                                            type="text" 
                                            value={tip.dish}
                                            onChange={e => {
                                                const list = [...formData.generated_content.culinary_uses]
                                                list[index].dish = e.target.value
                                                setFormData({ ...formData, generated_content: { ...formData.generated_content, culinary_uses: list } })
                                            }}
                                            placeholder="Dish/Usage"
                                            className="bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none" 
                                        />
                                        <input 
                                            type="text" 
                                            value={tip.tip}
                                            onChange={e => {
                                                const list = [...formData.generated_content.culinary_uses]
                                                list[index].tip = e.target.value
                                                setFormData({ ...formData, generated_content: { ...formData.generated_content, culinary_uses: list } })
                                            }}
                                            placeholder="Cooking Tip"
                                            className="sm:col-span-2 bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none" 
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const list = formData.generated_content.culinary_uses.filter((_: any, i: number) => i !== index)
                                            setFormData({ ...formData, generated_content: { ...formData.generated_content, culinary_uses: list } })
                                        }}
                                        className="p-2 text-[#a1a1aa] hover:text-red-500 transition-colors mt-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section B6: FAQs */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-[#C17F24]" />
                                <h2 className="text-lg font-semibold text-white">Section B6: FAQs</h2>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setFormData({
                                    ...formData,
                                    generated_content: {
                                        ...formData.generated_content,
                                        faqs: [...formData.generated_content.faqs, { question: '', answer: '' }]
                                    }
                                })}
                                className="flex items-center gap-1.5 text-xs font-bold text-[#C17F24] hover:bg-[#C17F24]/10 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add FAQ
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.generated_content.faqs.map((faq: any, index: number) => (
                                <div key={index} className="flex gap-3 items-start group">
                                    <div className="flex-1 space-y-3 bg-[#27272a] p-3 rounded-xl border border-transparent group-hover:border-[#3f3f46]">
                                        <input 
                                            type="text" 
                                            value={faq.question}
                                            onChange={e => {
                                                const list = [...formData.generated_content.faqs]
                                                list[index].question = e.target.value
                                                setFormData({ ...formData, generated_content: { ...formData.generated_content, faqs: list } })
                                            }}
                                            placeholder="Question"
                                            className="w-full bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none font-bold" 
                                        />
                                        <textarea 
                                            rows={2}
                                            value={faq.answer}
                                            onChange={e => {
                                                const list = [...formData.generated_content.faqs]
                                                list[index].answer = e.target.value
                                                setFormData({ ...formData, generated_content: { ...formData.generated_content, faqs: list } })
                                            }}
                                            placeholder="Answer"
                                            className="w-full bg-[#18181b] border border-[#3f3f46] text-white text-sm rounded-lg px-3 py-2 outline-none" 
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const list = formData.generated_content.faqs.filter((_: any, i: number) => i !== index)
                                            setFormData({ ...formData, generated_content: { ...formData.generated_content, faqs: list } })
                                        }}
                                        className="p-2 text-[#a1a1aa] hover:text-red-500 transition-colors mt-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
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
                            <label className="text-sm font-medium text-[#e4e4e7]">Category</label>
                            <select 
                                value={formData.category_id || ''} 
                                onChange={e => setFormData({...formData, category_id: e.target.value})} 
                                className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#C17F24] transition-all"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {fetchingCategories && <p className="text-[#a1a1aa] text-xs animate-pulse">Loading categories...</p>}
                            {errors.category_id && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.category_id}</p>}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Base Pricing & Inventory</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Base Price (₹)</label>
                                <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none" />
                                {errors.price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.price}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Compare at (₹)</label>
                                <input type="number" step="0.01" value={formData.compare_price} onChange={e => setFormData({...formData, compare_price: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none" placeholder="Optional" />
                                {errors.compare_price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.compare_price}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-sm font-medium text-[#e4e4e7]">Inventory Stock</label>
                            <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none" />
                            {errors.stock && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.stock}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
