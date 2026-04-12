import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // 1. Fetch Stats
    const { data: orders } = await supabase
        .from('orders')
        .select('id, total, created_at, items, status')
        .order('created_at', { ascending: false })

    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

    const { count: customerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // 2. Process Analytics
    const allOrders = (orders as any[]) || []
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalOrdersCount = allOrders.length
    
    // Monthly Revenue (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const revenueByMonth: Record<string, number> = {}
    
    allOrders.forEach(order => {
        if (!order.created_at) return
        const date = new Date(order.created_at)
        if (isNaN(date.getTime())) return
        const month = months[date.getMonth()]
        revenueByMonth[month] = (revenueByMonth[month] || 0) + (order.total || 0)
    })

    const revenueData = months.map(month => ({
        month,
        revenue: revenueByMonth[month] || 0
    })).filter(d => d.revenue > 0 || months.indexOf(d.month) <= new Date().getMonth()).slice(-6)

    // Top Products (by parsing items JSON)
    const productSales: Record<string, number> = {}
    allOrders.forEach(order => {
        const items = Array.isArray(order.items) ? order.items : []
        items.forEach((item: any) => {
            const name = item.name || item.title || 'Unknown Product'
            productSales[name] = (productSales[name] || 0) + (item.quantity || 1)
        })
    })

    const topProducts = Object.entries(productSales)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)

    // Recent Orders
    const recentOrders = allOrders.slice(0, 5).map(order => ({
        id: order.id || 'N/A',
        customer: order.shipping_address?.full_name || order.customer_name || order.customer_email || 'Guest',
        amount: order.total || 0,
        status: order.status || 'Pending',
        date: new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }))

    // Status Distribution
    const statusCounts: Record<string, number> = {}
    allOrders.forEach(order => {
        const s = order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'
        statusCounts[s] = (statusCounts[s] || 0) + 1
    })
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

    // Weekly Growth Calculation
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const thisWeekRevenue = allOrders
        .filter(o => new Date(o.created_at) >= oneWeekAgo)
        .reduce((sum, o) => sum + (o.total || 0), 0)
    
    const lastWeekRevenue = allOrders
        .filter(o => {
            const d = new Date(o.created_at)
            return d >= twoWeeksAgo && d < oneWeekAgo
        })
        .reduce((sum, o) => sum + (o.total || 0), 0)

    const revenueGrowth = lastWeekRevenue === 0 ? 0 : Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100)

    const stats = [
        { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`, iconKey: 'revenue', color: 'text-[#C17F24]' },
        { label: 'Total Orders', value: totalOrdersCount.toString(), change: '+0%', iconKey: 'orders', color: 'text-blue-400' },
        { label: 'Total Customers', value: (customerCount || 0).toString(), change: '+0%', iconKey: 'customers', color: 'text-purple-400' },
        { label: 'Active Products', value: (productCount || 0).toString(), change: '+0', iconKey: 'products', color: 'text-green-400' },
    ]

    return (
        <DashboardClient 
            stats={stats}
            revenueData={revenueData}
            topProducts={topProducts}
            recentOrders={recentOrders}
            statusData={statusData}
        />
    )
}
