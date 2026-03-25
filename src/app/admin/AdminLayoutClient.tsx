'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faColumns, faBox, faCartShopping, faUsers, faTag, faChartLine, 
    faGear, faFileLines, faRightFromBracket, faBell, faCircleUser, faSpinner,
    faBars, faXmark
} from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'

const navItems = [
    { icon: faColumns, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: faCartShopping, label: 'Orders', href: '/admin/orders' },
    { icon: faBox, label: 'Products', href: '/admin/products' },
    { icon: faTag, label: 'Categories', href: '/admin/categories' },
    { icon: faUsers, label: 'Customers', href: '/admin/customers' },
    { icon: faTag, label: 'Coupons', href: '/admin/coupons' },
    { icon: faChartLine, label: 'Analytics', href: '/admin/analytics' },
    { icon: faFileLines, label: 'Updates', href: '/admin/updates' },
    { icon: faGear, label: 'Settings', href: '/admin/settings' },
]

interface AdminLayoutClientProps {
    children: React.ReactNode
    user: { name: string; email: string }
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [signingOut, setSigningOut] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

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
                        <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors relative">
                            <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
                        </button>
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
