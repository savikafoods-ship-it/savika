'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faArrowLeft, 
    faUser, 
    faTruck, 
    faClock, 
    faCheckCircle,
    faChevronRight,
    faBox,
    faLocationDot,
    faIndianRupeeSign,
    faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

export default function AdminOrderDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState('')

    // Update state
    const [newStatus, setNewStatus] = useState('')
    const [courierName, setCourierName] = useState('')
    const [trackingId, setTrackingId] = useState('')

    const [isShipping, setIsShipping] = useState(false)
    const [shipmentError, setShipmentError] = useState('')

    useEffect(() => {
        fetchOrder()
    }, [id])

    const handleShipShiprocket = async () => {
        if (!confirm('Are you sure you want to create a shipment for this order via Shiprocket?')) return
        
        setIsShipping(true)
        setShipmentError('')
        try {
            const res = await fetch('/api/shipping/create-shipment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: id })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to create shipment')

            alert('Shipment created successfully!')
            fetchOrder() // Refresh order data to show tracking info
        } catch (err: any) {
            setShipmentError(err.message)
            alert('Error: ' + err.message)
        } finally {
            setIsShipping(false)
        }
    }

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`)
            if (!res.ok) throw new Error('Order not found')
            const data = await res.json()
            setOrder(data)
            setNewStatus(data.status)
            setCourierName(data.courier_name || '')
            setTrackingId(data.tracking_id || '')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async () => {
        setUpdating(true)
        setError('')
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    courier_name: courierName,
                    tracking_id: trackingId
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update order')
            }

            const updated = await res.json()
            setOrder(updated)
            alert('Order status updated successfully!')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setUpdating(false)
        }
    }

    const handleDeleteOrder = async () => {
        if (!confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) return
        
        if (!confirm('DOUBLE CHECK: Deleting an order will completely wipe it from the database. Are you absolutely sure?')) return

        try {
            setUpdating(true)
            const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete order')
            
            alert('Order deleted successfully.')
            router.push('/admin/orders')
            router.refresh()
        } catch (err: any) {
            alert('Error deleting order: ' + err.message)
            setUpdating(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-amber-600" />
        </div>
    )

    if (error || !order) return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
            {error || 'Order not found'}
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-[#27272a] rounded-lg text-[#a1a1aa] transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-white">{order.order_number || `#${order.id.slice(-8)}`}</h1>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                order.status === 'delivered' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-[#a1a1aa] text-xs mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items Card */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#27272a] bg-[#1c1c1f]">
                            <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                                <FontAwesomeIcon icon={faBox} className="text-amber-500 w-3.5" />
                                Ordered Items
                            </h3>
                        </div>
                        <div className="divide-y divide-[#27272a]">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="p-6 flex items-center gap-4 group">
                                    <div className="w-16 h-16 bg-[#27272a] rounded-xl relative overflow-hidden shrink-0">
                                        {item.image_url && (
                                            <Image 
                                                src={getProductImageUrl(item.image_url)} 
                                                fill alt="" className="object-cover" 
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white text-sm truncate">{item.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                                                {item.weight}
                                            </span>
                                            <span className="text-xs text-[#a1a1aa]">x{item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">{formatCurrency(item.price * item.quantity)}</p>
                                        <p className="text-[10px] text-[#a1a1aa] mt-0.5">{formatCurrency(item.price)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Totals Section */}
                        <div className="p-6 bg-[#1c1c1f] border-t border-[#27272a] space-y-3">
                            <div className="flex justify-between text-sm text-[#a1a1aa]">
                                <span>Items Total (MRP)</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-[#a1a1aa]">
                                <span>GST (5% Incl.)</span>
                                <span>{formatCurrency(order.gst || Math.round((order.subtotal || 0) * 5 / 105))}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-amber-500 font-medium">
                                    <span>Discount ({order.coupon_code})</span>
                                    <span>-{formatCurrency(order.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-[#a1a1aa]">
                                <span>Shipping Charges</span>
                                <span>{order.delivery_fee === 0 ? 'FREE' : formatCurrency(order.delivery_fee)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-[#27272a]">
                                <span>Total Amount</span>
                                <span className="text-[#C17F24]">{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
                        <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest mb-4">
                            <FontAwesomeIcon icon={faLocationDot} className="text-amber-500 w-3.5" />
                            Delivery Address
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-[#27272a] p-4 rounded-xl">
                                <p className="font-bold text-white">{order.shipping_address?.full_name}</p>
                                <p className="text-sm text-[#a1a1aa] mt-1">{order.shipping_address?.street}</p>
                                <p className="text-sm text-[#a1a1aa]">{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
                                {order.shipping_address?.landmark && (
                                    <p className="text-xs text-[#a1a1aa] mt-2 italic font-medium">Landmark: {order.shipping_address.landmark}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                                <span className="text-amber-500 font-bold">Mobile:</span>
                                <span className="text-white font-medium">{order.shipping_address?.mobile}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Actions */}
                <div className="space-y-8">
                    {/* Status Management */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="p-4 bg-[#C17F24] text-white">
                            <h3 className="font-black flex items-center gap-2 text-xs uppercase tracking-widest">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                Update Status
                            </h3>
                        </div>
                        <div className="p-5 space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Status</label>
                                <select 
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-600 font-bold text-sm text-gray-800"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="out_for_delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {newStatus === 'shipped' && (
                                <div className="space-y-4 pt-2 border-t border-gray-50">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Courier Name</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. Delhivery, DTDC"
                                            value={courierName}
                                            onChange={(e) => setCourierName(e.target.value)}
                                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-600 font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleUpdateStatus}
                                disabled={updating}
                                className="w-full bg-[#C17F24] hover:bg-[#8B5E16] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {updating ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : null}
                                Update Order
                            </button>

                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <button
                                    onClick={handleDeleteOrder}
                                    disabled={updating}
                                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 border border-red-200"
                                >
                                    Delete Order
                                </button>
                            </div>

                            {/* Shiprocket Integration */}
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Logistics Integration</p>
                                {!order.shipping_tracking_id ? (
                                    <button
                                        onClick={handleShipShiprocket}
                                        disabled={isShipping || order.status === 'cancelled'}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                                    >
                                        {isShipping ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faTruck} />}
                                        Ship via Shiprocket
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
                                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-tight mb-1">Shiprocket Shipment Created</p>
                                            <p className="text-sm font-black text-blue-900">Success</p>
                                        </div>
                                        <p className="text-[10px] text-center text-gray-400 font-medium">Shipment is already created</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Info Card */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
                        <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest mb-4">
                            <FontAwesomeIcon icon={faIndianRupeeSign} className="text-amber-500 w-3.5" />
                            Payment Method
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#a1a1aa]">Method:</span>
                                <span className="text-white font-bold uppercase">{order.payment_method}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#a1a1aa]">Status:</span>
                                <span className={`font-black uppercase tracking-widest text-[11px] ${order.payment_status === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
                        <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest mb-4">
                            <FontAwesomeIcon icon={faUser} className="text-amber-500 w-3.5" />
                            Customer Information
                        </h3>
                        <div className="space-y-2">
                            <p className="font-bold text-white">{order.customer_name || order.shipping_address?.full_name || 'Guest Customer'}</p>
                            <p className="text-sm text-[#a1a1aa]">{order.customer_email || 'No email'}</p>
                            {order.shipping_address?.mobile && <p className="text-sm text-amber-500 font-medium">{order.shipping_address.mobile}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
