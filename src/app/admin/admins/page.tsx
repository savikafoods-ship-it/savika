'use client'

import { useState } from 'react'

interface Perm { label: string; key: string }
const PERMS: Perm[] = [
    { label: 'Manage Products', key: 'can_manage_products' },
    { label: 'Manage Orders', key: 'can_manage_orders' },
    { label: 'Manage Users', key: 'can_manage_users' },
]

export default function AdminsPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [perms, setPerms] = useState<Record<string, boolean>>({
        can_manage_products: false,
        can_manage_orders: false,
        can_manage_users: false,
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const res = await fetch('/api/admin/create-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, full_name: fullName, permissions: perms }),
        })
        const data = await res.json()

        if (res.ok) {
            setMessage({ type: 'success', text: `Admin account created for ${email}.` })
            setEmail(''); setPassword(''); setFullName('')
            setPerms({ can_manage_products: false, can_manage_orders: false, can_manage_users: false })
        } else {
            setMessage({ type: 'error', text: data.error ?? 'Something went wrong.' })
        }
        setLoading(false)
    }

    const togglePerm = (key: string) =>
        setPerms((prev) => ({ ...prev, [key]: !prev[key] }))

    return (
        <div className="p-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-white">Admin Management</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Create new administrator accounts and assign their permissions.
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs bg-[#C47F17]/10 border border-[#C47F17]/30 text-[#C47F17] px-3 py-2 rounded-lg w-fit">
                    <i className="fa-solid fa-crown" />
                    Only Super Admin can access this page
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
                <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                    <i className="fa-solid fa-user-plus text-[#C47F17]" />
                    Create New Admin
                </h2>

                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Admin Name"
                                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#262626] text-white text-sm focus:outline-none focus:border-[#C47F17] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email <span className="text-red-400">*</span></label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@savika.in"
                                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#262626] text-white text-sm focus:outline-none focus:border-[#C47F17] transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Temporary Password <span className="text-red-400">*</span></label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Min 8 characters"
                            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#262626] text-white text-sm focus:outline-none focus:border-[#C47F17] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">Permissions</label>
                        <div className="space-y-2.5">
                            {PERMS.map(({ label, key }) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => togglePerm(key)}
                                        className={`w-10 h-5 rounded-full transition-all duration-200 flex items-center ${perms[key] ? 'bg-[#C47F17]' : 'bg-white/10'} cursor-pointer`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white shadow mx-0.5 transition-all duration-200 ${perms[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            <i className="fa-solid fa-lock mr-1" />
                            "Manage Admins" permission is never grantable - only Super Admin can create admins.
                        </p>
                    </div>

                    {message && (
                        <div className={`px-4 py-3 rounded-xl text-sm flex items-start gap-2 ${message.type === 'success'
                            ? 'bg-green-900/20 border border-green-800 text-green-400'
                            : 'bg-red-900/20 border border-red-800 text-red-400'
                            }`}>
                            <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} mt-0.5`} />
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#C47F17] hover:bg-[#a86c12] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Creating...</> : <><i className="fa-solid fa-user-plus" /> Create Admin</>}
                    </button>
                </form>
            </div>
        </div>
    )
}
