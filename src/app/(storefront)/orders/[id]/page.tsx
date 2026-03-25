import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faArrowLeft, 
    faBox, 
    faDownload, 
    faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

    if (!order) {
        return <div className="min-h-screen flex items-center justify-center">Order not found.</div>
    }

    // Security check
    if (order.user_id !== user.id) {
        redirect('/orders')
    }

    const items = Array.isArray(order.items) ? order.items : []
    const address = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address

    return (
        <div className="min-h-screen bg-[#F5F0E8] py-8 lg:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Link */}
                <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#C17F24] mb-6 transition-colors">
                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" /> Back to all orders
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-2">Order #{order.id.slice(-8).toUpperCase()}</h1>
                        <p className="text-sm font-medium text-gray-500">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-white border border-[#e8ddd0] hover:border-[#C17F24] hover:text-[#C17F24] px-5 py-2.5 rounded-xl font-bold text-sm text-[#2E2E2E] transition-all">
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4" /> Invoice
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    
                    {/* Left Col: Items */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-[#e8ddd0]">
                            <h2 className="text-lg font-extrabold text-[#2E2E2E] mb-6 flex items-center gap-2">
                                <FontAwesomeIcon icon={faBox} className="w-5 h-5 text-[#C17F24]" /> Items Ordered
                            </h2>
                            
                            <div className="space-y-6">
                                {items.map((item: any, i: number) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-[#F9F4EE] rounded-xl border border-[#e8ddd0] flex-shrink-0 relative overflow-hidden">
                                            {item.image && (
                                                <img src={getProductImageUrl(item.image)} alt={item.name} className="object-cover w-full h-full" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[#2E2E2E] text-sm md:text-base leading-tight">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} {item.weight ? `• ${item.weight}` : ''}</p>
                                        </div>
                                        <div className="font-bold text-[#2E2E2E]">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-[#e8ddd0] space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-[#2E2E2E]">₹{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-[#2E2E2E]">₹{order.shipping_cost || (order.total - (order.subtotal - (order.discount || 0)))}</span>
                                </div>
                                {(order.discount || 0) > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                                        <span className="font-semibold">-₹{order.discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-3 mt-3 border-t border-[#e8ddd0]/50">
                                    <span className="font-bold text-[#2E2E2E]">Total</span>
                                    <span className="text-2xl font-extrabold text-[#C17F24]">₹{order.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Details */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e8ddd0]">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Current Status</h2>
                            <div className="inline-flex items-center justify-center w-full py-3 rounded-lg bg-amber-50 text-amber-600 font-extrabold text-sm uppercase tracking-wide">
                                {order.status}
                            </div>
                        </div>

                        {/* Shipping Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e8ddd0]">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-[#C17F24]" /> Shipping TO
                            </h2>
                            {address && (
                                <address className="not-italic text-sm text-[#2E2E2E] space-y-1">
                                    <p className="font-bold mb-2">{address.fullName || address.full_name}</p>
                                    <p>{address.addressLine1 || address.address_line1}</p>
                                    {(address.addressLine2 || address.address_line2) && <p>{address.addressLine2 || address.address_line2}</p>}
                                    <p>{address.city}, {address.state} {address.pincode}</p>
                                    <p className="pt-2 text-gray-500 font-medium">Phone: {address.phone}</p>
                                </address>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
