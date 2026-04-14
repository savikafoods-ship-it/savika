import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEye, faFilter, faDownload } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import DeleteOrderButton from './DeleteOrderButton'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
    let orders: any[] = []

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        const primaryAdminEmail = process.env.ADMIN_EMAIL || 'savikafoods@gmail.com'
        
        // Email-based admin check
        if (!user || (user.email !== primaryAdminEmail && user.user_metadata?.role !== 'admin')) {
            redirect('/admin/login')
        }
        
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('payment_status', 'paid')
            .order('created_at', { ascending: false })
            .limit(100)
            
        if (error) throw error
        orders = data || []
    } catch (err) {
        console.error('Error fetching orders:', err)
    }

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'confirmed': return 'bg-blue-100 text-blue-800'
            case 'processing': return 'bg-blue-100 text-blue-800'
            case 'shipped': return 'bg-purple-100 text-purple-800'
            case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800'
            case 'delivered': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Order Management</h1>
                    <p className="text-[#a1a1aa] text-sm mt-1">Track and manage customer orders, shipping, and fulfillment.</p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        <FontAwesomeIcon icon={faDownload} className="w-3.5 h-3.5" /> Export
                    </button>
                </div>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-xl">
                {/* Filters Row */}
                <div className="p-4 border-b border-[#27272a] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#1c1c1f]">
                    <div className="relative w-full sm:w-96">
                        <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search by Order # or Customer..." 
                            className="w-full bg-[#27272a] border-none text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-1 focus:ring-[#C17F24] outline-none placeholder:text-gray-500"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select className="px-4 py-2 bg-[#27272a] border border-[#3f3f46] text-[#e4e4e7] text-sm font-medium rounded-lg outline-none cursor-pointer focus:border-[#C17F24]">
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                        <button className="p-2.5 bg-[#27272a] border border-[#3f3f46] text-[#e4e4e7] hover:text-white rounded-lg transition-colors">
                            <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#27272a]/50 text-[#a1a1aa] uppercase text-[10px] tracking-widest font-bold">
                            <tr>
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">Status</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#27272a]">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-[#a1a1aa] italic">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : orders.map(order => {
                                const customerName = order.customer_name || order.shipping_address?.full_name || 'Guest'
                                const customerEmail = order.customer_email || 'N/A'
                                
                                return (
                                    <tr key={order.id} className="hover:bg-[#27272a]/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-[#C17F24] text-sm">{order.order_number || `#${order.id.slice(-8)}`}</div>
                                            <div className="text-[11px] text-[#a1a1aa] mt-1 font-medium">
                                                {new Date(order.created_at).toLocaleString('en-IN', { 
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-semibold text-white text-sm">{customerName}</div>
                                            <div className="text-xs text-[#a1a1aa] mt-0.5">{customerEmail}</div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-xs font-semibold text-gray-300 uppercase tracking-tighter">
                                                {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                                            </div>
                                            <div className={`text-[10px] mt-0.5 font-bold ${order.payment_status === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>
                                                {order.payment_status?.toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-white font-bold text-base text-right">
                                            {formatCurrency(order.total)}
                                        </td>
                                        <td className="px-6 py-5 text-right flex justify-end gap-2">
                                            <Link 
                                                href={`/admin/orders/${order.id}`} 
                                                className="inline-flex items-center justify-center p-2.5 bg-amber-600/10 hover:bg-amber-600 text-amber-500 hover:text-white rounded-lg transition-all transform group-hover:scale-105"
                                                title="View Order"
                                            >
                                                <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                                            </Link>
                                            <DeleteOrderButton orderId={order.id} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-[#27272a]">
                    {orders.length === 0 ? (
                        <p className="px-4 py-12 text-center text-[#a1a1aa] text-sm italic">No orders found.</p>
                    ) : orders.map(order => {
                        const customerName = order.customer_name || order.shipping_address?.full_name || 'Guest'
                        return (
                            <Link key={order.id} href={`/admin/orders/${order.id}`} className="block p-4 hover:bg-[#27272a]/30 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-[#C17F24] text-sm">{order.order_number || `#${order.id.slice(-8)}`}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">{customerName}</p>
                                        <p className="text-[10px] text-[#a1a1aa] mt-0.5">
                                            {new Date(order.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div className="text-right">
                                            <p className="text-white font-bold">{formatCurrency(order.total)}</p>
                                            <p className={`text-[10px] font-bold ${order.payment_status === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>
                                                {order.payment_method === 'cod' ? 'COD' : order.payment_method} • {order.payment_status?.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
                
                <div className="px-6 py-4 border-t border-[#27272a] flex items-center justify-between text-[#a1a1aa] text-xs font-medium bg-[#1c1c1f]">
                    <span>Showing {orders.length} orders</span>
                    <div className="flex gap-1">
                        <button disabled className="px-3 py-1 bg-[#27272a] rounded cursor-not-allowed">Prev</button>
                        <button disabled className="px-3 py-1 bg-[#27272a] rounded cursor-not-allowed">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
