'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface PromoCard {
    badge: string
    headline: string
    subheading: string
    body: string
    button_label: string
    button_url: string
    bg_image: string | null
    icon: string
}

export default function AdminUpdatesClient() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    
    const [promo1, setPromo1] = useState<PromoCard | null>(null)
    const [promo2, setPromo2] = useState<PromoCard | null>(null)

    const supabase = createClient()

    useEffect(() => {
        loadContent()
    }, [])

    const loadContent = async () => {
        setLoading(true)
        const { data } = await supabase.from('site_content').select('*').in('key', ['promo_card_1', 'promo_card_2'])
        
        if (data) {
            const p1 = data.find(d => d.key === 'promo_card_1')?.value
            const p2 = data.find(d => d.key === 'promo_card_2')?.value
            
            if (p1) setPromo1(p1 as PromoCard)
            if (p2) setPromo2(p2 as PromoCard)
        }
        setLoading(false)
    }

    const handleSave = async (key: string, value: PromoCard) => {
        setSaving(true)
        setMessage({ type: '', text: '' })
        const { error } = await supabase.from('site_content').upsert({ key, value })
        
        if (error) {
            setMessage({ type: 'error', text: `Failed to update ${key}: ${error.message}` })
        } else {
            setMessage({ type: 'success', text: 'Content updated successfully! Changes are live.' })
        }
        setSaving(false)
    }

    if (loading) return <div className="p-6 text-white text-sm"><i className="fa-solid fa-spinner fa-spin mr-2" />Loading editor...</div>

    const renderCardEditor = (key: string, title: string, card: PromoCard, setter: (c: PromoCard) => void) => {
        if (!card) return null
        return (
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-lg font-bold text-[#C47F17] border-b border-white/10 pb-3">{title}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Badge Text</label>
                        <input type="text" value={card.badge} onChange={e => setter({...card, badge: e.target.value})} className="w-full bg-[#262626] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#C47F17] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Headline (e.g. 50% OFF)</label>
                        <input type="text" value={card.headline} onChange={e => setter({...card, headline: e.target.value})} className="w-full bg-[#262626] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#C47F17] focus:outline-none" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Subheading</label>
                        <input type="text" value={card.subheading} onChange={e => setter({...card, subheading: e.target.value})} className="w-full bg-[#262626] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#C47F17] focus:outline-none" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Body Text</label>
                        <input type="text" value={card.body} onChange={e => setter({...card, body: e.target.value})} className="w-full bg-[#262626] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#C47F17] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Button Label</label>
                        <input type="text" value={card.button_label} onChange={e => setter({...card, button_label: e.target.value})} className="w-full bg-[#262626] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#C47F17] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Button URL</label>
                        <input type="text" value={card.button_url} onChange={e => setter({...card, button_url: e.target.value})} className="w-full bg-[#262626] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#C47F17] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">FontAwesome Icon Name (without fa-)</label>
                        <input type="text" value={card.icon} onChange={e => setter({...card, icon: e.target.value})} className="w-full bg-[#262626] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#C47F17] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Background Image URL (optional)</label>
                        <input type="text" value={card.bg_image || ''} onChange={e => setter({...card, bg_image: e.target.value})} placeholder="https://..." className="w-full bg-[#262626] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#C47F17] focus:outline-none" />
                    </div>
                </div>
                <div className="pt-4 flex justify-end">
                    <button 
                        onClick={() => handleSave(key, card)} 
                        disabled={saving}
                        className="bg-[#C47F17] hover:bg-[#a86c12] text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        <i className="fa-solid fa-floppy-disk" /> Save Changes
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-[var(--font-playfair)] text-white">Content Updates</h1>
                <p className="text-sm text-gray-400 mt-1">Manage storefront homepage banners instantly.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-900/20 text-red-400 border border-red-800' : 'bg-green-900/20 text-green-400 border border-green-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {promo1 && renderCardEditor('promo_card_1', 'Promotional Card 1 (Left)', promo1, setPromo1)}
                {promo2 && renderCardEditor('promo_card_2', 'Promotional Card 2 (Right)', promo2, setPromo2)}
            </div>
        </div>
    )
}
