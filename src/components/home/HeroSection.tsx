'use client'

import Link from 'next/link'
import { ShoppingCart, Gift, Leaf, CheckCircle } from 'lucide-react'

const stats = [
    { value: '50+', label: 'Spice Varieties' },
    { value: '10k+', label: 'Happy Customers' },
    { value: '4.9', label: 'Avg. Rating' },
]

export default function HeroSection() {
    return (
        <section style={{ background: '#fff', overflow: 'hidden' }}>
            <div className="section-wrap" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
                <div className="grid-hero">

                    {/* LEFT */}
                    <div style={{ order: 1 }}>
                        {/* Eyebrow badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            background: '#FFF0DC', border: '1px solid rgba(196,127,23,.3)',
                            borderRadius: '9999px', padding: '0.375rem 1rem', marginBottom: '1.5rem'
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C17F24', animation: 'pulse 2s infinite' }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#C17F24', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                India&apos;s #1 Premium Spice Brand
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: 800,
                            lineHeight: 1.05,
                            color: '#1a1a1a',
                            marginBottom: '1.25rem'
                        }}>
                            Your Kitchen.<br />
                            <span style={{ color: '#C17F24', fontStyle: 'italic', position: 'relative' }}>
                                Your Spice.
                            </span>
                        </h1>

                        {/* Sub */}
                        <p style={{ color: '#5a4a3a', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '460px' }}>
                            Hand-picked from India&apos;s finest spice gardens - Rajasthan, Kerala &amp; the Northeast.
                            Freshly ground, artisan-blended, and delivered straight to your door.{' '}
                            <strong style={{ color: '#2E2E2E' }}>Taste real purity.</strong>
                        </p>

                        {/* CTAs */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                            <Link href="/shop" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShoppingCart style={{ width: '16px', height: '16px' }} />
                                Explore Spice Range
                            </Link>
                            <Link href="/category/gift-packs" className="btn-outline-brown" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Gift style={{ width: '16px', height: '16px' }} />
                                Gift Sets
                            </Link>
                        </div>

                        {/* Stats */}
                        <div style={{
                            display: 'flex', gap: '2.5rem',
                            borderTop: '1px solid #e8ddd0', paddingTop: '1.5rem'
                        }}>
                            {stats.map((s) => (
                                <div key={s.label}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C17F24' }}>{s.value}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#8E562E', fontWeight: 500, marginTop: '2px' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Visual */}
                    <div style={{ order: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', padding: '2rem 0' }}>
                        <div style={{
                            width: '320px', height: '320px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FFF0DC 0%, #FFE0A0 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '120px', height: '120px', borderRadius: '50%',
                                    background: 'rgba(196,127,23,.15)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                                }}>
                                    <span style={{ fontSize: '3.5rem' }}>🌶️</span>
                                </div>
                                <p style={{ marginTop: '0.75rem', fontWeight: 700, color: '#2E2E2E', fontSize: '0.9rem' }}>Kashmiri Mirch</p>
                                <p style={{ fontSize: '0.75rem', color: '#8E562E' }}>Whole - Single Origin</p>
                            </div>

                            {/* Floating badge - top right */}
                            <div style={{
                                position: 'absolute', top: '-10px', right: '-10px',
                                background: '#fff', borderRadius: '14px',
                                boxShadow: '0 4px 16px rgba(0,0,0,.12)',
                                padding: '0.5rem 0.75rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF0DC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '14px' }}>🧂</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#2E2E2E' }}>Pure Turmeric</p>
                                    <p style={{ fontSize: '9px', color: '#8E562E' }}>Cold-ground</p>
                                </div>
                            </div>

                            {/* Floating badge - bottom left */}
                            <div style={{
                                position: 'absolute', bottom: '10px', left: '-20px',
                                background: '#fff', borderRadius: '14px',
                                boxShadow: '0 4px 16px rgba(0,0,0,.12)',
                                padding: '0.5rem 0.75rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle style={{ width: '16px', height: '16px', color: '#28A745' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#2E2E2E' }}>FSSAI Certified</p>
                                    <p style={{ fontSize: '9px', color: '#8E562E' }}>Lab tested</p>
                                </div>
                            </div>
                        </div>

                        {/* Natural tag */}
                        <div className="animate-float" style={{
                            position: 'absolute', bottom: '0', right: '1rem',
                            background: '#C17F24', color: '#fff',
                            fontSize: '11px', fontWeight: 700,
                            padding: '0.375rem 0.875rem', borderRadius: '9999px',
                            boxShadow: '0 4px 12px rgba(196,127,23,.4)',
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                        }}>
                            <Leaf style={{ width: '12px', height: '12px' }} />
                            Natural Ingredients
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
