'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved, faUserGroup, faSpinner, faCircleUser, faTrash, faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function StaffManagementPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (error) throw error
            setUsers(data || [])
        } catch (err) {
            console.error('Error fetching users:', err)
        } finally {
            setLoading(false)
        }
    }

    const updateRole = async (userId: string, newRole: 'admin' | 'staff' | 'customer') => {
        setUpdatingId(userId)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId)
            
            if (error) throw error
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
        } catch (err) {
            console.error('Error updating role:', err)
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Staff Management</h1>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage administrative access and roles</p>
                </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.02] border-b border-white/5 text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">User</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Current Role</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Change Role</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">Registered</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <FontAwesomeIcon icon={faSpinner} className="w-6 h-6 animate-spin text-[#C17F24]" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">No users found.</td>
                                </tr>
                            ) : users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                                <FontAwesomeIcon icon={faCircleUser} className="text-gray-500 text-lg" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-black text-white uppercase tracking-tighter truncate">{u.full_name || 'Anonymous User'}</div>
                                                <div className="text-[10px] text-gray-500 truncate">{u.email || 'No email provided'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            u.role === 'admin' ? 'bg-[#C17F24]/10 text-[#C17F24]' :
                                            u.role === 'staff' ? 'bg-indigo-500/10 text-indigo-500' :
                                            'bg-gray-500/10 text-gray-500'
                                        }`}>
                                            <FontAwesomeIcon icon={faShieldHalved} className="mr-1.5" />
                                            {u.role || 'customer'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {(['customer', 'staff', 'admin'] as const).map(role => (
                                                <button
                                                    key={role}
                                                    onClick={() => updateRole(u.id, role)}
                                                    disabled={updatingId === u.id || u.role === role}
                                                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                                        u.role === role 
                                                            ? 'bg-transparent text-gray-700 opacity-50 cursor-not-allowed'
                                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                            {updatingId === u.id && <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 animate-spin text-[#C17F24]" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right tabular-nums text-xs font-bold text-gray-500">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-amber-900/10 border border-amber-900/20 rounded-3xl p-6">
                <div className="flex gap-4">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-[#C17F24] mt-1" />
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Operational Note</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Administrative access is granted instantly in the database but may require the staff member to re-login for updated session permissions. <strong>Admins</strong> have full CRUD access, while <strong>Staff</strong> have restricted order-only access.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
