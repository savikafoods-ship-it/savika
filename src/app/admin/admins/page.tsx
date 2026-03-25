'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faUserPlus, faLock, faSpinner, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

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
                <div className="mt-2 flex items-center gap-2 text-xs bg-[#C17F24]/10 border border-[#C17F24]/30 text-[#C17F24] px-3 py-2 rounded-lg w-fit">
                    <FontAwesomeIcon icon={faCrown} className="w-3.5 h-3.5" />
                    Only Super Admin can access this page
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
                <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5 text-[#C17F24]" />
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
                                className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-[#262626] text-white text-sm focus:outline-none focus:border-[#C17F24] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email <span className="text-red-400">*</span></label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="savikafoods@gmail.com"
                                className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-[#262626] text-white text-sm focus:outline-none focus:border-[#C17F24] transition-all"
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
                            className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-[#262626] text-white text-sm focus:outline-none focus:border-[#C17F24] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">Permissions</label>
                        <div className="space-y-2.5">
                            {PERMS.map(({ label, key }) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => togglePerm(key)}
                                        className={`w-10 h-5 rounded-full transition-all duration-200 flex items-center ${perms[key] ? 'bg-[#C17F24]' : 'bg-white/10'} cursor-pointer`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white shadow mx-0.5 transition-all duration-200 ${perms[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                            <FontAwesomeIcon icon={faLock} className="w-3 h-3" />
                            &quot;Manage Admins&quot; permission is never grantable - only Super Admin can create admins.
                        </p>
                    </div>

                    {message && (
                        <div className={`px-4 py-3 rounded-xl text-sm flex items-start gap-2 ${message.type === 'success'
                            ? 'bg-green-900/20 border border-green-800 text-green-400'
                            : 'bg-red-900/20 border border-red-800 text-red-400'
                            }`}>
                            <FontAwesomeIcon icon={message.type === 'success' ? faCheckCircle : faExclamationCircle} className="w-4 h-4 mt-0.5 shrink-0" />
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#C17F24] hover:bg-[#8B5E16] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" /> Creating...</> : <><FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" /> Create Admin</>}
                    </button>
                </form>
            </div>
        </div>
    )
}
