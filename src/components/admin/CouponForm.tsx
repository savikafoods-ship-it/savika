'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'

export default function CouponForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        code: initialData?.code || '',
        type: initialData?.type || 'percentage',
        value: initialData?.value?.toString() || '',
        min_order_value: initialData?.min_order_value?.toString() || '0',
        max_uses: initialData?.max_uses?.toString() || '',
        expiry_date: initialData?.expiry_date ? new Date(initialData.expiry_date).toISOString().split('T')[0] : '',
        is_active: initialData?.is_active ?? true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!formData.code) throw new Error('Coupon code is required')
            if (!formData.value) throw new Error('Discount value is required')

            const dataToSave = {
                code: formData.code.toUpperCase().trim(),
                type: formData.type,
                value: parseFloat(formData.value) || 0,
                min_order_value: parseFloat(formData.min_order_value) || 0,
                max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
                expiry_date: formData.expiry_date || null,
                is_active: formData.is_active,
            }

            if (initialData?.id) {
                const { error } = await supabase
                    .from('coupons')
                    .update(dataToSave)
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('coupons')
                    .insert([{ ...dataToSave, usage_count: 0 }])
                if (error) throw error
            }

            router.push('/admin/coupons')
            router.refresh()
        } catch (err: any) {
            alert(err.message || 'Failed to save coupon')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/coupons" className="p-2 hover:bg-[#27272a] text-[#a1a1aa] hover:text-white rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        {initialData ? 'Edit Coupon' : 'Create New Coupon'}
                    </h1>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-6 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={loading ? faSpinner : faSave} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Save Coupon
                </button>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Coupon Code</label>
                        <input 
                            required 
                            type="text" 
                            value={formData.code} 
                            onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                            placeholder="e.g. SUMMER50"
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none transition-all font-mono font-bold" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Status</label>
                        <select 
                            value={formData.is_active ? 'active' : 'inactive'} 
                            onChange={e => setFormData({...formData, is_active: e.target.value === 'active'})} 
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Discount Type</label>
                        <select 
                            value={formData.type} 
                            onChange={e => setFormData({...formData, type: e.target.value})} 
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 outline-none"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="flat">Flat Amount (₹)</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Discount Value</label>
                        <input 
                            required 
                            type="number" 
                            value={formData.value} 
                            onChange={e => setFormData({...formData, value: e.target.value})} 
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Min Order Value (₹)</label>
                        <input 
                            type="number" 
                            value={formData.min_order_value} 
                            onChange={e => setFormData({...formData, min_order_value: e.target.value})} 
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Expiry Date</label>
                        <input 
                            type="date" 
                            value={formData.expiry_date} 
                            onChange={e => setFormData({...formData, expiry_date: e.target.value})} 
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none transition-all" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#e4e4e7]">Max Uses (Total)</label>
                        <input 
                            type="number" 
                            value={formData.max_uses} 
                            onChange={e => setFormData({...formData, max_uses: e.target.value})} 
                            placeholder="Leave empty for unlimited"
                            className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none transition-all" 
                        />
                    </div>
                </div>
            </div>
        </form>
    )
}
