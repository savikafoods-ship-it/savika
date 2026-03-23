import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSessionClient } from '@/lib/appwrite/server'
import { Query } from 'node-appwrite'
import { ArrowLeft, Box, Download, MapPin } from 'lucide-react'

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let order = null
    let user = null

    try {
        const { account, databases } = await createSessionClient()
        user = await account.get()

        order = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
            id
        )

        // Security check
        if (order.userId !== user.$id) {
            redirect('/orders')
        }
    } catch {
        redirect('/auth/login')
    }

    if (!order) {
        return <div className="min-h-screen flex items-center justify-center">Order not found.</div>
    }

    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []
    const address = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress

    return (
        <div className="min-h-screen bg-[#F5F0E8] py-8 lg:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Link */}
                <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#C17F24] mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to all orders
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-2">Order #{order.$id.slice(-8).toUpperCase()}</h1>
                        <p className="text-sm font-medium text-gray-500">
                            Placed on {new Date(order.$createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-white border border-[#e8ddd0] hover:border-[#C17F24] hover:text-[#C17F24] px-5 py-2.5 rounded-xl font-bold text-sm text-[#2E2E2E] transition-all">
                        <Download className="w-4 h-4" /> Invoice
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    
                    {/* Left Col: Items */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-[#e8ddd0]">
                            <h2 className="text-lg font-extrabold text-[#2E2E2E] mb-6 flex items-center gap-2">
                                <Box className="w-5 h-5 text-[#C17F24]" /> Items Ordered
                            </h2>
                            
                            <div className="space-y-6">
                                {items.map((item: any, i: number) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-[#F9F4EE] rounded-xl border border-[#e8ddd0] flex-shrink-0" />
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
                                    <span className="font-semibold text-[#2E2E2E]">₹{order.total - order.subtotal + order.discount}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
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
                                <MapPin className="w-4 h-4" /> Shipping TO
                            </h2>
                            {address ? (
                                <address className="not-italic text-sm text-[#2E2E2E] space-y-1">
                                    <p className="font-bold mb-2">{address.fullName || user.name}</p>
                                    <p>{address.addressLine1}</p>
                                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                                    <p>{address.city}, {address.state} {address.pincode}</p>
                                    <p className="pt-2 text-gray-500 font-medium">Phone: {address.phone}</p>
                                </address>
                            ) : null}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
