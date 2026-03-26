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
        .eq('status', 'active')

    const { count: customerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // 2. Process Analytics
    const allOrders = orders || []
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalOrdersCount = allOrders.length
    
    // Monthly Revenue (last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const revenueByMonth: Record<string, number> = {}
    
    allOrders.forEach(order => {
        const date = new Date(order.created_at)
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
        customer: (order as any).customer_name || (order as any).customer_email || 'Anonymous',
        amount: order.total || 0,
        status: order.status || 'Processing',
        date: new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    }))

    const stats = [
        { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: '+0%', iconKey: 'revenue', color: 'text-[#C17F24]' },
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
        />
    )
}
