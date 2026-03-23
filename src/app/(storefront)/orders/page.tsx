import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSessionClient } from '@/lib/appwrite/server'
import { Query } from 'node-appwrite'
import { Package, ArrowRight, Clock, CheckCircle2, RotateCcw, Truck } from 'lucide-react'

// Map status to visual configs
const STATUS_CONFIG: Record<string, { color: string, icon: React.FC<any>, label: string }> = {
    pending: { color: 'text-amber-500 bg-amber-50', icon: Clock, label: 'Payment Pending' },
    processing: { color: 'text-blue-500 bg-blue-50', icon: RotateCcw, label: 'Processing' },
    shipped: { color: 'text-indigo-500 bg-indigo-50', icon: Truck, label: 'Shipped' },
    delivered: { color: 'text-green-600 bg-green-50', icon: CheckCircle2, label: 'Delivered' },
    cancelled: { color: 'text-red-500 bg-red-50', icon: RotateCcw, label: 'Cancelled' }
}

export default async function OrdersPage() {
    let user = null
    let orders: any[] = []

    try {
        const { account, databases } = await createSessionClient()
        user = await account.get()

        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
            [
                Query.equal('userId', user.$id),
                Query.orderDesc('$createdAt'),
                Query.limit(20)
            ]
        )
        orders = response.documents
    } catch {
        redirect('/auth/login')
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8] py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center gap-3 mb-8">
                    <Link href="/account" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#e8ddd0] hover:bg-gray-50 transition-colors">
                        <ArrowRight className="w-5 h-5 text-[#2E2E2E] rotate-180" />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-[#2E2E2E]">My Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-[#e8ddd0] p-12 text-center">
                        <div className="w-20 h-20 bg-[#F9F4EE] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-[#C17F24]/50" />
                        </div>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven&apos;t placed any orders with us yet. Ready to start your spice journey?</p>
                        <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-[#C17F24] hover:bg-[#8B5E16] text-white px-8 py-3.5 rounded-xl font-bold transition-transform hover:scale-[1.02]">
                            Browse Spices
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing
                            const StatusIcon = status.icon
                            
                            return (
                                <Link 
                                    key={order.$id} 
                                    href={`/orders/${order.$id}`}
                                    className="block bg-white rounded-2xl border border-[#e8ddd0] p-6 hover:shadow-md hover:border-[#C17F24]/50 transition-all group"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-500 mb-1">
                                                Order #{order.$id.slice(-8).toUpperCase()}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Placed on {new Date(order.$createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold w-fit ${status.color}`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {status.label}
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between border-t border-[#e8ddd0] pt-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold mb-1">TOTAL AMOUNT</p>
                                            <p className="text-lg font-extrabold text-[#2E2E2E]">₹{order.total}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-[#C17F24] group-hover:translate-x-1 transition-transform">
                                            View Details <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}


