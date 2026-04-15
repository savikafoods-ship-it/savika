'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faShoppingBag, faUsers, faBox, faChartLine, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts'

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
    statusData: any[];
}

const COLORS = ['#C17F24', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B']

export default function DashboardClient({ stats, revenueData, topProducts, recentOrders, statusData }: DashboardClientProps) {
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
                <div className="lg:col-span-2 bg-[#1B1B1B] rounded-2xl p-6 border border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Revenue Growth</h2>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C17F24]" /> Monthly</div>
                        </div>
                    </div>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C17F24" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#C17F24" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }} 
                                    tickFormatter={(v) => {
                                        if (v === 0) return '₹0'
                                        if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`
                                        return `₹${v}`
                                    }} 
                                />
                                <Tooltip 
                                    cursor={{ stroke: '#ffffff10', strokeWidth: 2 }}
                                    contentStyle={{ background: '#111', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }} 
                                    itemStyle={{ color: '#C17F24' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#C17F24" 
                                    strokeWidth={3} 
                                    dot={{ fill: '#C17F24', strokeWidth: 2, r: 4, stroke: '#1B1B1B' }} 
                                    activeDot={{ r: 6, stroke: '#1B1B1B', strokeWidth: 2 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution (Pie) */}
                <div className="bg-[#1B1B1B] rounded-2xl p-6 border border-white/5 shadow-sm">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest mb-8">Order Status</h2>
                    <div className="h-[180px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ background: '#111', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl font-black text-white">{statusData.reduce((a, b) => a + b.value, 0)}</span>
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-2">
                        {statusData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-[9px] font-bold text-gray-400 uppercase truncate">{entry.name}</span>
                                <span className="text-[9px] font-black text-white ml-auto">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 2: Top Products & More */}
            <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-[#1B1B1B] rounded-2xl p-6 border border-white/5 shadow-sm">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest mb-8">Top Selling Products</h2>
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical" margin={{ left: -20 }}>
                                <XAxis type="number" hide />
                                <YAxis 
                                    type="category" 
                                    dataKey="name" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }} 
                                    width={120} 
                                />
                                <Tooltip 
                                    contentStyle={{ background: '#111', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }} 
                                    cursor={{ fill: '#ffffff05' }} 
                                />
                                <Bar dataKey="sales" fill="#C17F24" radius={[0, 6, 6, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#C17F24]/5 rounded-2xl p-6 border border-[#C17F24]/10 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#C17F24]/10 flex items-center justify-center mb-2">
                        <FontAwesomeIcon icon={faChartLine} className="text-[#C17F24] text-2xl" />
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Insights</h3>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                        Your revenue has grown by <span className="text-[#C17F24] font-bold">{stats[0].change}</span> this week compared to last. Keep it up!
                    </p>
                    <Link href="/admin/analytics" className="text-[10px] font-black text-[#C17F24] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
                        Detailed Report →
                    </Link>
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
