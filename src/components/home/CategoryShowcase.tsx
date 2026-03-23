import Link from 'next/link'
import { Flame, CookingPot, Package, Gem, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const categories: { name: string; icon: LucideIcon; iconColor: string; href: string; items: string; bg: string }[] = [
    { name: 'Whole Spices', icon: Flame, iconColor: '#C17F24', href: '/category/whole-spices', items: '24+ varieties', bg: '#FFF8EE' },
    { name: 'Ground & Powdered', icon: CookingPot, iconColor: '#D4A017', href: '/category/ground-powdered', items: '18+ varieties', bg: '#FFFBEA' },
    { name: 'Blends & Masalas', icon: Package, iconColor: '#D4562E', href: '/category/blends-masalas', items: '12+ blends', bg: '#FFF5F0' },
    { name: 'Exotic & Rare', icon: Gem, iconColor: '#9B59B6', href: '/category/exotics-rare', items: '8+ varieties', bg: '#F8F0FF' },
]

export default function CategoryShowcase() {
    return (
        <section style={{ padding: '3.5rem 1rem', background: '#F9F4EE' }}>
            <div className="section-wrap">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#8E562E', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Browse by Type</p>
                    <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, color: '#2E2E2E' }}>
                        Find Your <span style={{ color: '#C17F24', fontStyle: 'italic' }}>Perfect Spice</span>
                    </h2>
                </div>

                <div className="grid-cats">
                    {categories.map((cat) => {
                        const Icon = cat.icon
                        return (
                            <Link
                                key={cat.name}
                                href={cat.href}
                                className="cat-card"
                                style={{ background: cat.bg }}
                            >
                                <div style={{
                                    width: '70px', height: '70px', borderRadius: '50%',
                                    background: '#fff', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', marginBottom: '1rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,.08)'
                                }}>
                                    <Icon style={{ width: '1.75rem', height: '1.75rem', color: cat.iconColor }} />
                                </div>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2E2E2E', marginBottom: '4px' }}>{cat.name}</h3>
                                <p style={{ fontSize: '0.75rem', color: '#8E562E' }}>{cat.items}</p>
                                <p style={{ fontSize: '11px', fontWeight: 700, color: '#C17F24', marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    Shop Now <ArrowRight style={{ width: '12px', height: '12px' }} />
                                </p>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
