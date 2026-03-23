'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Send, Leaf, Award, Truck, RotateCcw } from 'lucide-react'
import { SavikaLogo } from '@/components/ui/SavikaLogo'

const footerLinks = {
    shop: [
        { label: 'Whole Spices', href: '/category/whole-spices' },
        { label: 'Ground & Powdered', href: '/category/ground-powdered' },
        { label: 'Blends & Masalas', href: '/category/blends-masalas' },
        { label: 'Gift Packs', href: '/category/gift-packs' },
        { label: 'Exotics & Rare', href: '/category/exotics-rare' },
        { label: 'Shop All', href: '/shop' },
    ],
    company: [
        { label: 'Our Story', href: '/our-story' },
        { label: 'Why Savika', href: '/why-savika' },
        { label: 'Contact', href: '/contact' },
    ],
    support: [
        { label: 'Refund Policy', href: '/refund-policy' },
        { label: 'Terms & Conditions', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Shipping Policy', href: '/shipping-policy' },
    ],
}

const trustBadges = [
    { icon: Leaf, label: '100% Natural', sub: 'No artificial additives' },
    { icon: Award, label: 'FSSAI Certified', sub: 'Safe & quality-tested' },
    { icon: Truck, label: 'Pan-India Delivery', sub: '3-7 business days' },
    { icon: RotateCcw, label: 'Easy Returns', sub: '7-day hassle-free' },
]

export default function Footer() {
    return (
        <footer className="bg-[#8B5E16] text-white">
            {/* Newsletter Strip */}
            <div className="bg-[#C17F24] py-10 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-2xl font-extrabold text-white mb-1">
                        Join the Spice Family!
                    </p>
                    <p className="text-sm text-white/80 mb-6">Get exclusive recipes, first access to new arrivals &amp; member-only deals.</p>
                    <form
                        className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            placeholder="Your email address..."
                            className="flex-1 px-5 py-3 rounded-lg text-[#2E2E2E] text-sm font-medium outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="submit"
                            className="bg-[#2C1A0E] text-white px-7 py-3 rounded-lg font-bold text-sm hover:bg-black transition-colors whitespace-nowrap inline-flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand Column */}
                    <div>
                        <SavikaLogo variant="footer" className="mb-5" />
                        <p className="text-sm text-white/70 leading-relaxed max-w-xs mb-6">
                            Bringing the soul of India&apos;s spice heritage to your kitchen. Every gram, pure. Every blend, authentic.
                        </p>

                        {/* Contact */}
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <MapPin className="w-4 h-4 text-white/80 shrink-0" />
                                <span>Savika Foods Pvt. Ltd., Mumbai, MH 400001</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <Phone className="w-4 h-4 text-white/80 shrink-0" />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                                <Mail className="w-4 h-4 text-white/80 shrink-0" />
                                <span>hello@savikafoods.in</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.shop.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.company.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Support</h4>
                        <ul className="space-y-2.5">
                            {footerLinks.support.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-12 pt-8 border-t border-white/20">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {trustBadges.map((badge) => {
                            const Icon = badge.icon
                            return (
                                <div key={badge.label} className="flex flex-col items-center gap-1.5 group">
                                    <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-white/15 flex items-center justify-center transition-colors duration-200">
                                        <Icon className="w-6 h-6 text-white/80" />
                                    </div>
                                    <span className="text-xs font-bold text-white">{badge.label}</span>
                                    <span className="text-[11px] text-white/50">{badge.sub}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/20 py-4 px-4 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto text-xs text-white/50 gap-2">
                <p>
                    &copy; {new Date().getFullYear()} Savika Foods Pvt. Ltd. All rights reserved.
                </p>
                <p>
                    <Link href="/privacy" className="hover:text-white">Privacy Policy</Link> &nbsp;|&nbsp;
                    <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                </p>
            </div>
        </footer>
    )
}
