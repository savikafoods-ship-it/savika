'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faBoxOpen, 
    faChevronRight, 
    faTruck, 
    faCalendarAlt, 
    faMoneyBillWave,
    faSpinner,
    faShoppingBag
} from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

export default function UserOrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const supabase = createClient()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setOrders(data || [])
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [supabase])

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-500/10 text-amber-500'
            case 'confirmed': return 'bg-blue-500/10 text-blue-500'
            case 'shipped': return 'bg-purple-500/10 text-purple-500'
            case 'delivered': return 'bg-green-500/10 text-green-500'
            case 'cancelled': return 'bg-red-500/10 text-red-500'
            default: return 'bg-gray-100 text-gray-500'
        }
    }

    if (loading) return (
            <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} className="w-10 h-10 animate-spin text-[#C17F24]" />
            </div>
    )

    return (
        <div className="min-h-screen bg-[#F5F0E8] pb-24 pt-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Your Journey</p>
                        <h1 className="text-4xl font-black text-[#2E2E2E] tracking-tighter uppercase">My Orders</h1>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-xl border border-gray-50">
                        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <FontAwesomeIcon icon={faShoppingBag} className="text-amber-500 text-3xl" />
                        </div>
                        <h2 className="text-2xl font-black text-[#2E2E2E] mb-2 uppercase tracking-tighter">No Orders Found</h2>
                        <p className="text-gray-400 font-medium text-sm mb-10 max-w-xs mx-auto leading-relaxed">Your orders will appear here once you've discovered our premium spices.</p>
                        <Link href="/shop" className="inline-block bg-[#C17F24] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl active:scale-95 transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Link 
                                key={order.id} 
                                href={`/orders/${order.id}`}
                                className="block bg-white rounded-[2rem] p-6 shadow-xl shadow-amber-900/5 border border-gray-50 group hover:shadow-2xl transition-all hover:scale-[1.01]"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 pb-5 mb-5 uppercase tracking-widest">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 text-[10px] font-black">
                                            <FontAwesomeIcon icon={faBoxOpen} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-amber-700 tracking-[0.2em]">{order.order_number}</p>
                                            <p className="text-[9px] font-black text-gray-400 italic flex items-center gap-1.5 mt-0.5">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-[8px]" />
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase leading-none ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex -space-x-4">
                                        {order.items?.slice(0, 3).map((item: any, idx: number) => (
                                            <div key={idx} className="w-14 h-14 rounded-2xl border-4 border-white overflow-hidden shadow-sm hover:translate-y-[-4px] transition-transform">
                                                <Image src={getProductImageUrl(item.image_url)} alt="" fill className="object-cover" />
                                            </div>
                                        ))}
                                        {order.items?.length > 3 && (
                                            <div className="w-14 h-14 rounded-2xl bg-amber-50 border-4 border-white flex items-center justify-center text-[10px] font-black text-amber-500 shadow-sm">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-amber-500 text-[10px]" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount Paid</span>
                                        </div>
                                        <p className="text-xl font-black text-gray-800 tracking-tighter">{formatCurrency(order.total)}</p>
                                    </div>
                                    <div className="hidden sm:flex w-10 h-10 rounded-full bg-gray-50 items-center justify-center group-hover:bg-[#C17F24] group-hover:text-white transition-all">
                                        <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                                    </div>
                                </div>

                                {order.status === 'shipped' && (
                                    <div className="mt-6 flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-3 rounded-xl border-dashed">
                                        <FontAwesomeIcon icon={faTruck} className="text-indigo-600 text-xs" />
                                        <p className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.1em]">Tracking ID: {order.tracking_id} via {order.courier_name}</p>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
