import Link from 'next/link'
import { 
    MapPin, 
    Phone, 
    Mail, 
    Leaf, 
    Award, 
    Truck, 
    RotateCcw,
    Flame,
    CookingPot,
    ChefHat,
    Gift,
    Star,
    ClipboardList,
    Undo2,
    ShieldCheck,
    MessageCircle,
    Info,
    TrendingUp,
    Briefcase,
    Globe,
    CreditCard
} from 'lucide-react'
import { SavikaLogo } from '@/components/ui/SavikaLogo'

const footerLinks = {
    shop: [
        { label: 'Whole Spices', href: '/category/whole-spices', icon: Flame },
        { label: 'Ground & Powdered', href: '/category/ground-powdered', icon: CookingPot },
        { label: 'Blends & Masalas', href: '/category/blends-masalas', icon: ChefHat },
        { label: 'Gift Packs', href: '/category/gift-packs', icon: Gift },
        { label: 'Exotics & Rare', href: '/category/exotics-rare', icon: Star },
    ],
    help: [
        { label: 'Track Your Order', href: '/account/orders', icon: Truck },
        { label: 'Return & Refund', href: '/refund-policy', icon: Undo2 },
        { label: 'Shipping Policy', href: '/shipping-policy', icon: ShieldCheck },
        { label: 'FAQ', href: '/faq', icon: Info },
        { label: 'Contact Us', href: '/contact', icon: MessageCircle },
    ],
    company: [
        { label: 'Our Story', href: '/our-story', icon: ChefHat },
        { label: 'Why Savika?', href: '/why-savika', icon: Award },
        { label: 'Sourcing Promise', href: '/sourcing', icon: MapPin },
        { label: 'Blog', href: '/blog', icon: TrendingUp },
        { label: 'Careers', href: '/careers', icon: Briefcase },
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
        <footer className="bg-[#1A1108] text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Upper Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    
                    {/* Brand Section (4 columns) */}
                    <div className="lg:col-span-5 space-y-8">
                        <SavikaLogo variant="footer" />
                        <p className="text-[#D1D5DB] text-sm leading-relaxed max-w-sm">
                            Bringing the soul of India's spice heritage to your kitchen. 
                            Every gram, pure. Every blend, authentic.
                        </p>
                        
                        {/* Contact Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-[#D1D5DB]">
                                <MapPin className="w-4 h-4 text-[#C17F24]" />
                                <span>B-406, Siddhivinayak Homes, Solsumba, Gujarat - 396165</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#D1D5DB]">
                                <Phone className="w-4 h-4 text-[#C17F24]" />
                                <span>+91 98981 76667</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#D1D5DB]">
                                <Mail className="w-4 h-4 text-[#C17F24]" />
                                <span>savikafoods@gmail.com</span>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 pt-2">
                            {[
                                { 
                                    name: 'Instagram', 
                                    href: '#', 
                                    svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                                },
                                { 
                                    name: 'Facebook', 
                                    href: '#', 
                                    svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                },
                                { 
                                    name: 'Youtube', 
                                    href: '#', 
                                    svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                                },
                                { 
                                    name: 'Twitter', 
                                    href: '#', 
                                    svg: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                                }
                            ].map((social, i) => (
                                <Link 
                                    key={i} 
                                    href={social.href}
                                    aria-label={social.name}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#C17F24] flex items-center justify-center transition-all duration-300"
                                >
                                    {social.svg}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections (7 columns) */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {/* SHOP */}
                        <div className="space-y-6">
                            <h4 className="text-[#C17F24] font-bold uppercase tracking-wider flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> SHOP
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-[#D1D5DB] hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                            <link.icon className="w-3.5 h-3.5 text-[#C17F24]/0 group-hover:text-[#C17F24] transition-all" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* HELP */}
                        <div className="space-y-6">
                            <h4 className="text-[#C17F24] font-bold uppercase tracking-wider flex items-center gap-2">
                                <Info className="w-4 h-4" /> HELP
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.help.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-[#D1D5DB] hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                            <link.icon className="w-3.5 h-3.5 text-[#C17F24]/0 group-hover:text-[#C17F24] transition-all" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* COMPANY */}
                        <div className="space-y-6">
                            <h4 className="text-[#C17F24] font-bold uppercase tracking-wider flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> COMPANY
                            </h4>
                            <ul className="space-y-4">
                                {footerLinks.company.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-[#D1D5DB] hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                            <link.icon className="w-3.5 h-3.5 text-[#C17F24]/0 group-hover:text-[#C17F24] transition-all" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-white/5 mb-16" />

                {/* Trust Badges */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 px-4">
                    {trustBadges.map((badge) => (
                        <div key={badge.label} className="flex flex-col items-center text-center space-y-3 group">
                            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#C17F24]/10">
                                <badge.icon className="w-7 h-7 text-[#C17F24]" />
                            </div>
                            <div className="space-y-1">
                                <h5 className="font-bold text-sm tracking-tight">{badge.label}</h5>
                                <p className="text-[#9CA3AF] text-[11px] font-medium">{badge.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="text-center pt-8 mt-8 border-t border-white/5">
                    <p className="text-[#9CA3AF] text-[11px] font-medium tracking-wide">
                        &copy; {new Date().getFullYear()} Savika Foods. All rights reserved. | 
                        <Link href="/privacy" className="hover:text-white mx-1">Privacy Policy</Link> | 
                        <Link href="/terms" className="hover:text-white mx-1">Terms of Service</Link>
                    </p>
                </div>
            </div>
        </footer>
    )
}
