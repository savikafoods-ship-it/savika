'use client'

import { useState } from 'react'
import { Save, Loader2, Store, CreditCard, Truck, Bell } from 'lucide-react'

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false)

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => setLoading(false), 800)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div>
                <h1 className="text-2xl font-bold text-white">Global Settings</h1>
                <p className="text-[#a1a1aa] text-sm mt-1">Configure your storefront policies, taxes, and integrations.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                
                {/* Store Profile */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                    <div className="border-b border-[#27272a] p-5 flex items-center gap-3 bg-[#27272a]/30">
                        <Store className="w-5 h-5 text-[#C17F24]" />
                        <h2 className="font-semibold text-white">Store Profile</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Store Name</label>
                                <input type="text" defaultValue="Savika Foods" className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Contact Email</label>
                                <input type="email" defaultValue="savikafoods@gmail.com" className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#e4e4e7]">Support Phone</label>
                            <input type="text" defaultValue="+91 98981 76667" className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none max-w-xs" />
                        </div>
                    </div>
                </div>

                {/* Shipping Configuration */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                    <div className="border-b border-[#27272a] p-5 flex items-center gap-3 bg-[#27272a]/30">
                        <Truck className="w-5 h-5 text-[#C17F24]" />
                        <h2 className="font-semibold text-white">Shipping & Fulfilment</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Free Shipping Threshold (₹)</label>
                                <input type="number" defaultValue="599" className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#e4e4e7]">Standard Shipping Rate (₹)</label>
                                <input type="number" defaultValue="50" className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Taxes */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                    <div className="border-b border-[#27272a] p-5 flex items-center gap-3 bg-[#27272a]/30">
                        <CreditCard className="w-5 h-5 text-[#C17F24]" />
                        <h2 className="font-semibold text-white">Taxes & Payment</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-[#e4e4e7]">Prices Include Tax</p>
                                <p className="text-xs text-[#a1a1aa] mt-0.5">If disabled, GST will be added at checkout.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C17F24]"></div>
                            </label>
                        </div>
                        <div className="pt-4 border-t border-[#27272a]">
                            <label className="text-sm font-medium text-[#e4e4e7]">Default GST Rate (%)</label>
                            <select className="mt-1.5 w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-4 py-2.5 focus:border-[#C17F24] outline-none max-w-xs">
                                <option value="5">5% (Most Spices)</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                    <div className="border-b border-[#27272a] p-5 flex items-center gap-3 bg-[#27272a]/30">
                        <Bell className="w-5 h-5 text-[#C17F24]" />
                        <h2 className="font-semibold text-white">Admin Notifications</h2>
                    </div>
                    <div className="p-6 space-y-4 border-b border-[#27272a] flex items-center justify-between hover:bg-[#27272a]/20 transition-colors">
                        <div>
                            <p className="font-medium text-[#e4e4e7]">New Order Alerts</p>
                            <p className="text-xs text-[#a1a1aa] mt-0.5">Receive an email when a new order is placed.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C17F24]"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save All Settings
                    </button>
                </div>
            </form>
        </div>
    )
}
