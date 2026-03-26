'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faShoppingBag, faUsers, faBox, faChartLine, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

const iconMap: Record<string, any> = {
    revenue: faArrowUp,
    orders: faShoppingBag,
    customers: faUsers,
    products: faBox,
    trendUp: faArrowUp,
    trendDown: faArrowDown
}

const statusColors: Record<string, string> = {
    'Shipped': 'text-blue-400 bg-blue-400/10',
    'Paid': 'text-yellow-400 bg-yellow-400/10',
    'Delivered': 'text-green-400 bg-green-400/10',
    'Processing': 'text-purple-400 bg-purple-400/10',
    'Cancelled': 'text-red-400 bg-red-400/10',
}

interface DashboardClientProps {
    stats: any[];
    revenueData: any[];
    topProducts: any[];
    recentOrders: any[];
}

export default function DashboardClient({ stats, revenueData, topProducts, recentOrders }: DashboardClientProps) {
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-gray-400 mt-1">{today}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat) => {
                    const iconKey = stat.iconKey as string;
                    const Icon = iconMap[iconKey] || faChartLine;
                    const isPositive = stat.change.startsWith('+');
                    
                    return (
                        <div key={stat.label} className="bg-[#1A1A1A] rounded-xl p-3 sm:p-4 lg:p-5 border border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <FontAwesomeIcon icon={Icon} className={`w-4 h-4 ${stat.color}`} />
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isPositive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                        </div>
                    )
                })}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-[#1A1A1A] rounded-xl p-4 sm:p-5 border border-white/5">
                    <h2 className="text-sm font-bold text-white mb-6">Monthly Revenue (Rs.)</h2>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip 
                                    formatter={(v: any) => [`₹${Number(v || 0).toLocaleString('en-IN')}`, 'Revenue']} 
                                    contentStyle={{ background: '#262626', border: 'none', borderRadius: '12px', color: '#fff' }} 
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#C17F24" strokeWidth={2.5} dot={{ fill: '#C17F24', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-[#1A1A1A] rounded-xl p-4 sm:p-5 border border-white/5">
                    <h2 className="text-sm font-bold text-white mb-6">Top Products</h2>
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} width={80} />
                                <Tooltip contentStyle={{ background: '#262626', border: 'none', borderRadius: '12px', color: '#fff' }} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="sales" fill="#C17F24" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-[#1A1A1A] rounded-xl p-4 sm:p-5 border border-white/5">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-bold text-white">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-xs text-[#C17F24] hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl">
                    <table className="min-w-full divide-y divide-white/5">
                        <thead>
                            <tr className="text-xs text-gray-500 uppercase tracking-wider">
                                <th className="text-left pb-3 whitespace-nowrap px-4 sm:px-0">Order ID</th>
                                <th className="text-left pb-3 whitespace-nowrap px-2">Customer</th>
                                <th className="text-left pb-3 whitespace-nowrap px-2">Amount</th>
                                <th className="text-left pb-3 whitespace-nowrap px-2">Status</th>
                                <th className="text-left pb-3 whitespace-nowrap px-2 hidden sm:table-cell">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                    <td className="py-3 text-sm text-[#C17F24] font-medium whitespace-nowrap px-4 sm:px-0">#{order.id.slice(0, 8)}</td>
                                    <td className="py-3 text-sm text-white whitespace-nowrap px-2">{order.customer}</td>
                                    <td className="py-3 text-sm text-white font-semibold whitespace-nowrap px-2">₹{order.amount.toLocaleString('en-IN')}</td>
                                    <td className="py-3 px-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[order.status] || 'text-gray-400 bg-gray-400/10'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-sm text-gray-400 whitespace-nowrap px-2 hidden sm:table-cell">{order.date}</td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">No recent orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
