import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faArrowTrendUp, faUsers, faShoppingBag, faDollarSign, faCalendar } from '@fortawesome/free-solid-svg-icons'

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics Overview</h1>
                    <p className="text-[#a1a1aa] text-sm mt-1">Key metrics and performance indicators for Savika Foods.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-[#27272a] text-[#e4e4e7] hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" /> Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: '₹4,82,500', trend: '+12.5%', isUp: true, icon: faDollarSign, color: 'text-green-500' },
                    { label: 'Total Orders', value: '845', trend: '+8.2%', isUp: true, icon: faShoppingBag, color: 'text-blue-500' },
                    { label: 'Active Customers', value: '1,204', trend: '+15.3%', isUp: true, icon: faUsers, color: 'text-purple-500' },
                    { label: 'Conversion Rate', value: '2.4%', trend: '-0.4%', isUp: false, icon: faArrowTrendUp, color: 'text-[#C17F24]' }
                ].map((stat, i) => {
                    return (
                        <div key={i} className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 relative overflow-hidden group hover:border-[#3f3f46] transition-colors">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[#a1a1aa] text-sm font-medium mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-lg bg-[#27272a]/50 ${stat.color}`}>
                                    <FontAwesomeIcon icon={stat.icon} className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm">
                                <span className={`font-bold ${stat.isUp ? 'text-green-400' : 'text-red-400'}`}>
                                    {stat.trend}
                                </span>
                                <span className="text-[#a1a1aa]">vs last month</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area stub */}
                <div className="lg:col-span-2 bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-white">Revenue Growth</h3>
                        <select className="bg-[#27272a] border-none text-[#a1a1aa] text-xs rounded-lg px-2 py-1 outline-none">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="h-72 w-full flex items-center justify-center border border-dashed border-[#3f3f46] rounded-xl bg-[#27272a]/20">
                        <div className="text-center text-[#a1a1aa]">
                            <FontAwesomeIcon icon={faChartBar} className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Interactive visualization will load here.</p>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-6">Top Selling Spices</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Kashmiri Mirch (Whole)', sales: 145, rev: '₹28,500' },
                            { name: 'Turmeric Powder', sales: 112, rev: '₹14,200' },
                            { name: 'Garam Masala Blend', sales: 98, rev: '₹19,600' },
                            { name: 'Green Cardamom', sales: 85, rev: '₹42,000' },
                            { name: 'Cumin Seeds (Jeera)', sales: 74, rev: '₹8,880' },
                        ].map((prod, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#27272a]/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#27272a] flex items-center justify-center text-xs font-bold text-[#a1a1aa]">
                                        #{i + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#e4e4e7] truncate max-w-[120px] sm:max-w-full">{prod.name}</p>
                                        <p className="text-xs text-[#a1a1aa]">{prod.sales} sold</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-white">{prod.rev}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
