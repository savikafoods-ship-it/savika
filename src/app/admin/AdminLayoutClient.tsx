'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3,
    Settings, FileText, LogOut, ChevronLeft, ChevronRight, Bell, UserCircle, Loader2
} from 'lucide-react'
import { account } from '@/lib/appwrite/client'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: Tag, label: 'Categories', href: '/admin/categories' },
    { icon: Users, label: 'Customers', href: '/admin/customers' },
    { icon: Tag, label: 'Coupons', href: '/admin/coupons' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: FileText, label: 'Updates', href: '/admin/updates' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

interface AdminLayoutClientProps {
    children: React.ReactNode
    user: { name: string; email: string }
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
    const [collapsed, setCollapsed] = useState(true)
    const [signingOut, setSigningOut] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        setSigningOut(true)
        try {
            await account.deleteSession('current')
        } catch {
            // Session may already be expired
        }
        router.push('/admin/login')
    }

    return (
        <div className="flex min-h-screen bg-[#111111]">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-[#111111] border-r border-white/10 flex flex-col z-40 transition-all duration-250 ${collapsed ? 'w-14' : 'w-56'
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center h-[60px] px-3 border-b border-white/10">
                    <Image src="/logo.png" alt="Savika" width={32} height={32} className="h-8 w-8 object-contain rounded-full shrink-0" />
                    {!collapsed && (
                        <span className="ml-2 text-sm font-bold text-[#C17F24] tracking-tight whitespace-nowrap">SAVIKA ADMIN</span>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-3 px-1.5 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-[#C17F24] text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Toggle + Sign Out */}
                <div className="border-t border-white/10 p-2 space-y-1">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors text-sm"
                    >
                        {collapsed ? <ChevronRight className="w-5 h-5 shrink-0" /> : <ChevronLeft className="w-5 h-5 shrink-0" />}
                        {!collapsed && <span>Collapse</span>}
                    </button>
                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-900/20 transition-colors text-sm"
                    >
                        {signingOut ? <Loader2 className="w-5 h-5 shrink-0 animate-spin" /> : <LogOut className="w-5 h-5 shrink-0" />}
                        {!collapsed && <span>{signingOut ? 'Signing out...' : 'Sign Out'}</span>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className={`flex-1 transition-all duration-250 ${collapsed ? 'ml-14' : 'ml-56'}`}>
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-[60px] bg-[#111111] border-b border-white/10 flex items-center justify-between px-6">
                    <div />
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors relative">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <UserCircle className="w-8 h-8 text-gray-500" />
                            <div className="text-right">
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
