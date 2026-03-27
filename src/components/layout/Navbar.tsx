'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Heart, User, ShoppingBag, ChevronDown, ChevronRight, X, Menu, Leaf } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import CartDrawer from '@/components/layout/CartDrawer'

import SearchModal from '@/components/layout/SearchModal'
import { SavikaLogo } from '@/components/ui/SavikaLogo'
import { createClient } from '@/lib/supabase/client'



export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [announcement, setAnnouncement] = useState('Free shipping on orders above Rs.599 | 100% Pure & Natural | Pan-India Delivery')
    const [categories, setCategories] = useState<{label: string, href: string}[]>([
        { label: 'Whole Spices', href: '/category/whole-spices' },
        { label: 'Ground & Powdered', href: '/category/ground-powdered' },
        { label: 'Blends & Masalas', href: '/category/blends-masalas' },
        { label: 'Gift Packs', href: '/category/gift-packs' },
        { label: 'Exotics & Rare', href: '/category/exotics-rare' },
    ])

    const { itemCount, toggleCart } = useCartStore()
    const count = itemCount()
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        setIsSearchOpen(false)
        setMobileOpen(false)
    }, [pathname])

    useEffect(() => {
        const handler = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handler)
        
        // Fetch announcement
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                if (data.announcement_bar?.text) {
                    setAnnouncement(data.announcement_bar.text)
                }
            })
            .catch(console.error)

        // Fetch categories for nav
        const supabase = createClient()
        supabase.from('categories').select('name, slug').order('sort_order')
            .then(({ data }: { data: any[] | null }) => {
                if (data && data.length > 0) {
                    setCategories(data.map((c: any) => ({ label: c.name, href: `/category/${c.slug}` })))
                }
            })

        return () => window.removeEventListener('scroll', handler)
    }, [])

    const dynamicNavLinks = [
        { label: 'Shop All', href: '/shop' },
        {
            label: 'Categories', href: '#',
            children: categories,
        },
        { label: 'Our Story', href: '/our-story' },
        { label: 'Why Savika', href: '/why-savika' },
        { label: 'Contact', href: '/contact' },
    ]

    const announcementParts = announcement.split('|').map(s => s.trim())

    return (
        <>
            {/* Promo Bar */}
            <div className="bg-[#C47F17] text-white py-2 px-4 overflow-hidden relative">
                <div className="flex sm:justify-center items-center gap-6 text-[10px] sm:text-xs tracking-wide font-medium whitespace-nowrap animate-marquee sm:animate-none">
                    {announcementParts.map((part, i) => (
                        <span key={i} className="flex items-center gap-6">
                            {i > 0 && <span className="hidden sm:inline">|</span>}
                            <span>{part}</span>
                        </span>
                    ))}
                    {/* Duplicate for seamless marquee on mobile */}
                    <div className="flex sm:hidden items-center gap-6">
                        {announcementParts.map((part, i) => (
                            <span key={`dup-${i}`} className="flex items-center gap-6">
                                <span>|</span>
                                <span>{part}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <header
                className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-md'
                    : 'bg-[#FFF8F0]'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">

                        {/* Logo */}
                        <SavikaLogo variant="header" />

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {dynamicNavLinks.map((link) => (
                                <div
                                    key={link.label}
                                    className="relative"
                                    onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#2E2E2E] hover:text-[#C47F17] rounded-lg hover:bg-[#FFF0DC] transition-all duration-200"
                                    >
                                        {link.label}
                                        {link.children && <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                                    </Link>
                                    {link.children && openDropdown === link.label && (
                                        <div className="absolute top-full left-0 w-56 bg-white rounded-b-2xl shadow-2xl border border-[#F0E8DC] py-2 z-50 animate-fadeIn">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.label}
                                                    href={child.href}
                                                    className="block px-4 py-2.5 text-sm text-[#2E2E2E] hover:bg-[#FFF0DC] hover:text-[#C47F17] transition-colors font-medium"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Action Icons */}
                        <div className="flex items-center gap-1">
                            <button
                                aria-label="Search"
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2.5 rounded-xl hover:bg-[#FFF0DC] text-[#2E2E2E] hover:text-[#C47F17] transition-all"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:flex p-2.5 rounded-xl hover:bg-[#FFF0DC] text-[#2E2E2E] hover:text-[#C47F17] transition-all">
                                <Heart className="w-5 h-5" />
                            </Link>
                            <Link href="/account" aria-label="Account" className="hidden sm:flex p-2.5 rounded-xl hover:bg-[#FFF0DC] text-[#2E2E2E] hover:text-[#C47F17] transition-all">
                                <User className="w-5 h-5" />
                            </Link>

                            <button
                                onClick={toggleCart}
                                aria-label="Open Cart"
                                className="relative p-2.5 rounded-xl hover:bg-[#FFF0DC] text-[#2E2E2E] hover:text-[#C47F17] transition-all"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {count > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-[#C47F17] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                        {count}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                                className="lg:hidden p-2.5 rounded-xl hover:bg-[#FFF0DC] text-[#2E2E2E] transition-all"
                            >
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileOpen && (
                        <div className="lg:hidden pb-4 border-t border-[#e8ddd0] mt-1 bg-[#FFF8F0]">
                            <div className="pt-3 space-y-1">
                                {dynamicNavLinks.map((link) => (
                                    <div key={link.label}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-[#2E2E2E] hover:bg-[#FFF0DC] hover:text-[#C47F17] rounded-lg transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                        {link.children && (
                                            <div className="pl-8 space-y-0.5 mt-0.5">
                                                {link.children.map((child) => (
                                                    <Link
                                                        key={child.label}
                                                        href={child.href}
                                                        onClick={() => setMobileOpen(false)}
                                                        className="block px-3 py-2 text-xs text-[#8E562E] hover:text-[#C47F17] transition-colors"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="pt-3 border-t border-[#e8ddd0] flex gap-4 px-3">
                                    <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 text-sm text-[#2E2E2E] hover:text-[#C47F17]">
                                        <Heart className="w-4 h-4" /> Wishlist
                                    </Link>
                                    <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-1.5 text-sm text-[#2E2E2E] hover:text-[#C47F17]">
                                        <User className="w-4 h-4" /> Account
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <CartDrawer />
        </>
    )
}
