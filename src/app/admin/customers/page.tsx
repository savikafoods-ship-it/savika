import { createAdminClient } from '@/lib/appwrite/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Eye, Search, UserCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
    let usersList: any = { users: [], total: 0 }

    try {
        const { users } = await createAdminClient()
        // Note: Admin Client is required to list users globally
        usersList = await users.list()
    } catch (e) {
        // If they can't access, redirect
        redirect('/admin/login')
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Customers</h1>
                    <p className="text-[#a1a1aa] text-sm mt-1">Total {usersList.total} registered users.</p>
                </div>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#27272a]">
                    <div className="relative w-full sm:w-96">
                        <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search by name, email or phone..." 
                            className="w-full bg-[#27272a] border-none text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-[#C17F24] outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#27272a]/50 text-[#a1a1aa]">
                            <tr>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Phone</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272a]">
                            {usersList.users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#a1a1aa]">No users found.</td>
                                </tr>
                            ) : usersList.users.map((user: any) => (
                                <tr key={user.$id} className="hover:bg-[#27272a]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center shrink-0">
                                                <UserCircle className="w-6 h-6 text-[#a1a1aa]" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{user.name || 'Anonymous'}</div>
                                                <div className="text-xs text-[#a1a1aa]">{user.email || 'No email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#e4e4e7]">
                                        {user.phone || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-[#a1a1aa]">
                                        {new Date(user.registration).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                            {user.status ? 'Active' : 'Blocked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/customers/${user.$id}`} className="inline-flex p-2 hover:bg-[#27272a] hover:text-white text-[#a1a1aa] rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
