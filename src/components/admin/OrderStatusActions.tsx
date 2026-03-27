'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCheckCircle, faTruck, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { OrderStatus } from '@/types'

interface OrderStatusActionsProps {
    orderId: string
    currentStatus: OrderStatus
}

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const updateStatus = async (newStatus: OrderStatus) => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId)

            if (error) throw error
            router.refresh()
        } catch (err: any) {
            alert(err.message || 'Failed to update order status')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
                <label className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Change Status</label>
                <select 
                    value={currentStatus} 
                    onChange={(e) => updateStatus(e.target.value as OrderStatus)}
                    disabled={loading}
                    className="w-full bg-[#27272a] border border-[#3f3f46] text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C17F24] disabled:opacity-50"
                >
                    {statuses.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[#27272a]">
                {currentStatus === 'processing' && (
                    <button 
                        onClick={() => updateStatus('shipped')}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={loading ? faSpinner : faTruck} className={loading ? 'animate-spin' : ''} />
                        Mark as Shipped
                    </button>
                )}
                {currentStatus === 'shipped' && (
                    <button 
                        onClick={() => updateStatus('delivered')}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={loading ? faSpinner : faCheckCircle} className={loading ? 'animate-spin' : ''} />
                        Mark as Delivered
                    </button>
                )}
                {currentStatus !== 'cancelled' && currentStatus !== 'delivered' && (
                    <button 
                        onClick={() => updateStatus('cancelled')}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={loading ? faSpinner : faXmarkCircle} className={loading ? 'animate-spin' : ''} />
                        Cancel Order
                    </button>
                )}
            </div>
        </div>
    )
}
