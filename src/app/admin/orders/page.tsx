import Link from 'next/link'
import { Search, Eye, Filter, Download } from 'lucide-react'
import { createSessionClient } from '@/lib/appwrite/server'
import { Query } from 'node-appwrite'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
    let orders: any[] = []

    try {
        const { account, databases } = await createSessionClient()
        await account.get()
        
        const res = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
            [Query.orderDesc('$createdAt'), Query.limit(50)]
        )
        orders = res.documents
    } catch {
        redirect('/admin/login')
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-500'
            case 'processing': return 'bg-blue-500/10 text-blue-500'
            case 'shipped': return 'bg-indigo-500/10 text-indigo-400'
            case 'delivered': return 'bg-green-500/10 text-green-500'
            case 'cancelled': return 'bg-red-500/10 text-red-500'
            default: return 'bg-[#27272a] text-[#a1a1aa]'
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Orders</h1>
                    <p className="text-[#a1a1aa] text-sm mt-1">Manage processing, shipping, and order history.</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors w-fit">
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#27272a] flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search by order ID or email..." 
                            className="w-full bg-[#27272a] border-none text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-[#C17F24] outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select className="px-4 py-2 bg-[#27272a] text-[#e4e4e7] text-sm font-medium rounded-lg outline-none cursor-pointer">
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                        </select>
                        <button className="p-2.5 bg-[#27272a] text-[#e4e4e7] hover:text-white rounded-lg transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#27272a]/50 text-[#a1a1aa]">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272a]">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#a1a1aa]">
                                        No recent orders found.
                                    </td>
                                </tr>
                            ) : orders.map(order => (
                                <tr key={order.$id} className="hover:bg-[#27272a]/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-[#e4e4e7]">
                                        #{order.$id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{order.customerName || 'Guest'}</div>
                                        <div className="text-xs text-[#a1a1aa] mt-0.5">{order.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[#a1a1aa]">
                                        {new Date(order.$createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">
                                        ₹{order.total}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/orders/${order.$id}`} className="inline-flex items-center justify-center p-2 hover:bg-[#27272a] text-[#a1a1aa] hover:text-white rounded-lg transition-colors">
                                            <Eye className="w-4 h-4 cursor-pointer" />
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
