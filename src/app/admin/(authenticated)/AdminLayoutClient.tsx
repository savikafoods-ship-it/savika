'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faColumns, faBox, faCartShopping, faUsers, faTag, faChartLine, 
    faGear, faPalette, faRightFromBracket, faBell, faCircleUser, faSpinner,
    faBars, faXmark, faMoneyBillWave, faClock, faMessage, faUserGroup, faBagShopping
} from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'

const navItems = [
    { icon: faColumns, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: faCartShopping, label: 'Orders', href: '/admin/orders' },
    { icon: faBox, label: 'Products', href: '/admin/products' },
    { icon: faTag, label: 'Categories', href: '/admin/categories' },
    { icon: faMessage, label: 'Reviews', href: '/admin/reviews' },
    { icon: faUsers, label: 'Customers', href: '/admin/customers' },
    { icon: faTag, label: 'Coupons', href: '/admin/coupons' },
    { icon: faChartLine, label: 'Analytics', href: '/admin/analytics' },
    { icon: faGear, label: 'Settings', href: '/admin/settings' },
]

function timeAgo(dateStr: string) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

interface AdminLayoutClientProps {
    children: React.ReactNode
    user: { name: string; email: string }
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [signingOut, setSigningOut] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [notifications, setNotifications] = useState<any[]>([])
    const [seenIds, setSeenIds] = useState<Set<string>>(new Set())
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    // Load seen IDs from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('savika_admin_seen_orders')
            if (stored) setSeenIds(new Set(JSON.parse(stored)))
        } catch {}
    }, [])

    // Fetch recent orders for notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch('/api/orders/recent')
                if (res.ok) {
                    const data = await res.json()
                    setNotifications(data)
                }
            } catch {}
        }
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 10000) // Poll every 10s
        return () => clearInterval(interval)
    }, [])

    const unreadCount = notifications.filter(n => !seenIds.has(n.id)).length

    const markAllRead = () => {
        const allIds = notifications.map(n => n.id)
        const newSeen = new Set([...seenIds, ...allIds])
        setSeenIds(newSeen)
        try {
            localStorage.setItem('savika_admin_seen_orders', JSON.stringify([...newSeen]))
        } catch {}
    }

    const handleSignOut = async () => {
        setSigningOut(true)
        try {
            await supabase.auth.signOut()
        } catch {
            // Session may already be expired
        }
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <div className="flex min-h-screen bg-[#111111]">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Notification overlay */}
            {notifOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full bg-[#111111] border-r border-white/10 flex flex-col z-40
                    transition-transform duration-250 ease-in-out
                    w-64 md:w-14 lg:w-56
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Logo + Close */}
                <div className="flex items-center justify-between h-[60px] px-3 border-b border-white/10">
                    <div className="flex items-center">
                        <Image src="/logo.png" alt="Savika" width={32} height={32} className="h-8 w-8 object-contain rounded-full shrink-0" />
                        <span className="ml-2 text-sm font-bold text-[#C17F24] tracking-tight whitespace-nowrap md:hidden lg:inline">SAVIKA ADMIN</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden"
                    >
                        <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-3 px-1.5 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={item.label}
                                className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                    md:justify-center lg:justify-start
                                    ${isActive
                                        ? 'bg-[#C17F24] text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <FontAwesomeIcon icon={item.icon} className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                                <span className="whitespace-nowrap md:hidden lg:inline">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Sign Out */}
                <div className="border-t border-white/10 p-2 space-y-1">
                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-900/20 transition-colors text-sm md:justify-center lg:justify-start"
                    >
                        <FontAwesomeIcon icon={signingOut ? faSpinner : faRightFromBracket} className={`w-4 h-4 shrink-0 ${signingOut ? 'animate-spin' : ''}`} />
                        <span className="md:hidden lg:inline">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 transition-all duration-250 ml-0 md:ml-14 lg:ml-56">
                {/* Top Bar */}
                <header className="sticky top-0 z-20 h-14 sm:h-[60px] bg-[#111111] border-b border-white/10 flex items-center justify-between px-4 sm:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden"
                    >
                        <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
                    </button>
                    <div className="hidden md:block" />
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button 
                                onClick={() => { setNotifOpen(!notifOpen); }}
                                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors relative"
                            >
                                <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/40">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {notifOpen && (
                                <div className="absolute right-0 top-12 w-96 max-h-[480px] bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a]">
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest">New Orders</h3>
                                        {unreadCount > 0 && (
                                            <button 
                                                onClick={markAllRead}
                                                className="text-[9px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    <div className="overflow-y-auto max-h-[380px] divide-y divide-[#27272a]">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 text-sm italic">
                                                No recent orders
                                            </div>
                                        ) : notifications.map(order => {
                                            const isUnread = !seenIds.has(order.id)
                                            return (
                                                <Link
                                                    key={order.id}
                                                    href={`/admin/orders/${order.id}`}
                                                    onClick={() => setNotifOpen(false)}
                                                    className={`flex items-start gap-4 px-5 py-4 hover:bg-[#27272a]/50 transition-colors ${isUnread ? 'bg-amber-500/5' : ''}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${isUnread ? 'bg-amber-500' : 'bg-transparent'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-xs font-black text-[#C17F24] uppercase tracking-wider">{order.order_number || `#${order.id.slice(-8)}`}</span>
                                                            <span className="text-[9px] font-bold text-gray-500 flex items-center gap-1 shrink-0">
                                                                <FontAwesomeIcon icon={faClock} className="text-[8px]" />
                                                                {timeAgo(order.created_at)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-white mt-1 truncate">
                                                            {order.shipping_address?.full_name || 'Customer'}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                                                                <FontAwesomeIcon icon={faMoneyBillWave} className="text-[9px]" />
                                                                {formatCurrency(order.total)}
                                                            </span>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                                                                order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                                order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                                                'bg-blue-500/10 text-blue-500'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-gray-500 uppercase">
                                                                {order.payment_method === 'cod' ? 'COD' : order.payment_method}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>

                                    <div className="border-t border-[#27272a] p-3">
                                        <Link
                                            href="/admin/orders"
                                            onClick={() => setNotifOpen(false)}
                                            className="block text-center text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors py-1"
                                        >
                                            View All Orders →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCircleUser} className="w-7 h-7 text-gray-500" />
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                                <p className="text-[11px] text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="min-h-[calc(100vh-60px)]">
                    {children}
                </main>
            </div>
        </div>
    )
}
