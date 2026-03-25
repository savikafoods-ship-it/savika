import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faSearch, faCircleUser } from '@fortawesome/free-solid-svg-icons'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
    let customers: any[] = []
    let totalCount = 0

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) redirect('/admin/login')
        
        // Assuming a 'profiles' or 'customers' table exists which mirrors auth users or stores customer data
        const { data, count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .limit(50)
            
        if (error) throw error
        customers = data || []
        totalCount = count || 0
    } catch (err) {
        console.error('Error fetching customers:', err)
        // Fallback
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Customers</h1>
                    <p className="text-[#a1a1aa] text-sm mt-1">Total {totalCount} registered users.</p>
                </div>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#27272a]">
                    <div className="relative w-full sm:w-96">
                        <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
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
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[#a1a1aa]">No users found.</td>
                                </tr>
                            ) : customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-[#27272a]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center shrink-0">
                                                <FontAwesomeIcon icon={faCircleUser} className="w-5 h-5 text-[#a1a1aa]" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{customer.full_name || 'Anonymous'}</div>
                                                <div className="text-xs text-[#a1a1aa]">{customer.email || 'No email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#e4e4e7]">
                                        {customer.phone || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-[#a1a1aa]">
                                        {new Date(customer.created_at).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${customer.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                            {customer.is_active ? 'Active' : 'Blocked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/customers/${customer.id}`} className="inline-flex p-2 hover:bg-[#27272a] hover:text-white text-[#a1a1aa] rounded-lg transition-colors">
                                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
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
