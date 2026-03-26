import { createClient } from '@/lib/supabase/server'
import { OrderItem } from '@/types'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBox, faMapPin, faTruck, faRefresh } from '@fortawesome/free-solid-svg-icons'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let order = null

    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) throw error
        order = data
    } catch (error: any) {
        console.error('Error fetching order:', error)
        notFound()
    }

    const items = Array.isArray(order.items) ? order.items : []
    const address = order.shipping_address || {}

    return (
        <div className="pb-10 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-[#27272a] text-[#a1a1aa] hover:text-white rounded-lg transition-colors">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            Order #{order.id.slice(-8).toUpperCase()}
                            <span className="px-2.5 py-1 text-xs uppercase tracking-wider bg-blue-500/10 text-blue-400 rounded-full">{order.status}</span>
                        </h1>
                        <p className="text-[#a1a1aa] text-sm mt-1">
                            Placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Items & Financials */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                        <div className="border-b border-[#27272a] p-5 flex items-center gap-2 text-white font-semibold">
                            <FontAwesomeIcon icon={faBox} className="w-5 h-5 text-[#C17F24]" /> Order Items
                        </div>
                        <div className="p-5 space-y-4">
                            {items.map((item: OrderItem, i: number) => (
                                <div key={i} className="flex gap-4 items-center p-3 rounded-lg bg-[#27272a]/30">
                                    <div className="relative w-12 h-12 bg-[#27272a] rounded-md border border-[#3f3f46] overflow-hidden flex shrink-0">
                                        {item.image_urls?.[0] ? (
                                            <img src={getProductImageUrl(item.image_urls[0])} alt={item.name} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FontAwesomeIcon icon={faBox} className="w-4 h-4 text-[#3f3f46]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                                        <p className="text-xs text-[#a1a1aa] mt-0.5">₹{item.price} × {item.quantity} {item.weight ? `(${item.weight})` : ''}</p>
                                    </div>
                                    <div className="text-sm font-medium text-white pl-4">
                                        ₹{item.price * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-[#27272a] p-5 bg-[#27272a]/10 space-y-2">
                            <div className="flex justify-between text-sm text-[#a1a1aa]">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm text-[#a1a1aa]">
                                <span>Shipping</span>
                                <span>₹{order.total - order.subtotal + (order.discount || 0)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-400">
                                    <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                                    <span>-₹{order.discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 mt-3 border-t border-[#3f3f46]">
                                <span className="font-semibold text-white text-base">Total</span>
                                <span className="text-xl font-bold text-[#C17F24]">₹{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column details */}
                <div className="space-y-6">
                    
                    {/* Customer Details */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                        <div className="border-b border-[#27272a] p-5 flex items-center gap-2 text-white font-semibold">
                            <FontAwesomeIcon icon={faMapPin} className="w-5 h-5 text-[#C17F24]" /> Customer & Shipping
                        </div>
                        <div className="p-5 text-sm">
                            <p className="font-bold text-white mb-1">{address?.fullName || order.customer_name}</p>
                            <p className="text-[#a1a1aa] mb-4">{order.customer_email}</p>

                            {address && address.addressLine1 ? (
                                <address className="not-italic text-[#a1a1aa] space-y-1 pt-4 border-t border-[#27272a]">
                                    <p className="text-white font-medium mb-1">Shipping Address</p>
                                    <p>{address.addressLine1}</p>
                                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                                    <p>{address.city}, {address.state} {address.pincode}</p>
                                    <p className="pt-2 text-white/80">📞 {address.phone}</p>
                                </address>
                            ) : null}
                        </div>
                    </div>

                    {/* Quick Actions Actions could be client-components in a real app */}
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                        <div className="border-b border-[#27272a] p-5 flex items-center gap-2 text-white font-semibold">
                            <FontAwesomeIcon icon={faRefresh} className="w-5 h-5 text-[#C17F24]" /> Actions
                        </div>
                        <div className="p-5 space-y-3">
                            <button className="w-full flex items-center justify-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                                <FontAwesomeIcon icon={faTruck} className="w-4 h-4" /> Mark as Shipped
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                Cancel Order
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
