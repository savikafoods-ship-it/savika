'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faSpinner, faStore, faCreditCard, faTruck, faBell, faCheck } from '@fortawesome/free-solid-svg-icons'

interface StoreSettings {
    store_profile: {
        name: string
        email: string
        phone: string
    }
    shipping_config: {
        free_threshold: number
        standard_rate: number
    }
    tax_config: {
        include_tax: boolean
        gst_rate: string
    }
    notification_config: {
        new_order_alerts: boolean
    }
}

const DEFAULT_SETTINGS: StoreSettings = {
    store_profile: { name: 'Savika Foods', email: 'savikafoods@gmail.com', phone: '+91 98981 76667' },
    shipping_config: { free_threshold: 599, standard_rate: 50 },
    tax_config: { include_tax: true, gst_rate: '5' },
    notification_config: { new_order_alerts: true }
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings')
                if (res.ok) {
                    const data = await res.json()
                    setSettings({
                        store_profile: data.store_profile || DEFAULT_SETTINGS.store_profile,
                        shipping_config: data.shipping_config || DEFAULT_SETTINGS.shipping_config,
                        tax_config: data.tax_config || DEFAULT_SETTINGS.tax_config,
                        notification_config: data.notification_config || DEFAULT_SETTINGS.notification_config,
                    })
                }
            } catch (err) {
                console.error('Failed to fetch settings:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async (key: keyof StoreSettings, value: any) => {
        setSaving(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            })
            if (res.ok) {
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
            }
        } catch (err) {
            alert('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const updateProfile = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            store_profile: { ...prev.store_profile, [field]: value }
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10 px-4 sm:px-0">
            <div>
                <h1 className="text-2xl font-bold text-white">Global Settings</h1>
                <p className="text-[#a1a1aa] text-sm mt-1">Configure your storefront policies, taxes, and integrations.</p>
            </div>

            <div className="space-y-6">
                {/* Store Profile */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-xl">
                    <div className="border-b border-[#27272a] p-5 flex items-center justify-between bg-[#27272a]/30">
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faStore} className="w-5 h-5 text-[#C17F24]" />
                            <h2 className="font-semibold text-white">Store Profile</h2>
                        </div>
                        <button 
                            onClick={() => handleSave('store_profile', settings.store_profile)}
                            disabled={saving}
                            className="bg-[#C17F24] hover:bg-[#D4A855] text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                        >
                            {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : 'Save'}
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Store Name</label>
                                <input 
                                    type="text" 
                                    value={settings.store_profile.name} 
                                    onChange={(e) => updateProfile('name', e.target.value)}
                                    className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Contact Email</label>
                                <input 
                                    type="email" 
                                    value={settings.store_profile.email} 
                                    onChange={(e) => updateProfile('email', e.target.value)}
                                    className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none" 
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#e4e4e7]">Support Phone</label>
                            <input 
                                type="text" 
                                value={settings.store_profile.phone} 
                                onChange={(e) => updateProfile('phone', e.target.value)}
                                className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none max-w-xs" 
                            />
                        </div>
                    </div>
                </div>

                {/* Shipping Configuration */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-xl">
                    <div className="border-b border-[#27272a] p-5 flex items-center justify-between bg-[#27272a]/30">
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faTruck} className="w-5 h-5 text-[#C17F24]" />
                            <h2 className="font-semibold text-white">Shipping & Fulfilment</h2>
                        </div>
                        <button 
                            onClick={() => handleSave('shipping_config', settings.shipping_config)}
                            className="bg-[#C17F24] hover:bg-[#D4A855] text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                        >
                            Save
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Free Shipping Threshold (₹)</label>
                                <input 
                                    type="number" 
                                    value={settings.shipping_config.free_threshold} 
                                    onChange={(e) => setSettings(p => ({ ...p, shipping_config: { ...p.shipping_config, free_threshold: Number(e.target.value) } }))}
                                    className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Standard Shipping Rate (₹)</label>
                                <input 
                                    type="number" 
                                    value={settings.shipping_config.standard_rate} 
                                    onChange={(e) => setSettings(p => ({ ...p, shipping_config: { ...p.shipping_config, standard_rate: Number(e.target.value) } }))}
                                    className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Taxes */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-xl">
                    <div className="border-b border-[#27272a] p-5 flex items-center justify-between bg-[#27272a]/30">
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5 text-[#C17F24]" />
                            <h2 className="font-semibold text-white">Taxes & Payment</h2>
                        </div>
                        <button 
                            onClick={() => handleSave('tax_config', settings.tax_config)}
                            className="bg-[#C17F24] hover:bg-[#D4A855] text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                        >
                            Save
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-[#e4e4e7]">Prices Include Tax</p>
                                <p className="text-xs text-[#a1a1aa] mt-0.5">If disabled, GST will be added at checkout.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={settings.tax_config.include_tax} 
                                    onChange={(e) => setSettings(p => ({ ...p, tax_config: { ...p.tax_config, include_tax: e.target.checked } }))}
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C17F24]"></div>
                            </label>
                        </div>
                        <div className="pt-4 border-t border-[#27272a]">
                            <label className="text-sm font-medium text-[#e4e4e7]">Default GST Rate (%)</label>
                            <select 
                                value={settings.tax_config.gst_rate}
                                onChange={(e) => setSettings(p => ({ ...p, tax_config: { ...p.tax_config, gst_rate: e.target.value } }))}
                                className="mt-1.5 w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none max-w-xs"
                            >
                                <option value="5">5% (Most Spices)</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-xl">
                    <div className="border-b border-[#27272a] p-5 flex items-center justify-between bg-[#27272a]/30">
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-[#C17F24]" />
                            <h2 className="font-semibold text-white">Admin Notifications</h2>
                        </div>
                        <button 
                            onClick={() => handleSave('notification_config', settings.notification_config)}
                            className="bg-[#C17F24] hover:bg-[#D4A855] text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                        >
                            Save
                        </button>
                    </div>
                    <div className="p-6 flex items-center justify-between hover:bg-[#27272a]/20 transition-colors">
                        <div>
                            <p className="font-medium text-[#e4e4e7]">New Order Alerts</p>
                            <p className="text-xs text-[#a1a1aa] mt-0.5">Receive an email when a new order is placed.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={settings.notification_config.new_order_alerts} 
                                onChange={(e) => setSettings(p => ({ ...p, notification_config: { ...p.notification_config, new_order_alerts: e.target.checked } }))}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C17F24]"></div>
                        </label>
                    </div>
                </div>
            </div>

            {saved && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl animate-bounce">
                    <FontAwesomeIcon icon={faCheck} />
                    Settings saved successfully!
                </div>
            )}
        </div>
    )
}
