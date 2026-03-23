import Link from 'next/link'
import { Sprout, FlaskConical, Package, HeartHandshake, Store } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const reasons: { icon: LucideIcon; title: string; desc: string; color: string; iconColor: string }[] = [
    { icon: Sprout, title: 'Farm-to-Pack Freshness', desc: 'Direct from farmers across Rajasthan, Kerala & the Northeast - no middlemen.', color: '#D4EDDA', iconColor: '#28A745' },
    { icon: FlaskConical, title: 'Lab-Tested Quality', desc: 'Every batch tested for purity & adulteration. 100% clean guarantee.', color: '#CCE5FF', iconColor: '#007BFF' },
    { icon: Package, title: 'Eco-Friendly Packaging', desc: 'Resealable, airtight, recyclable packs - freshness guaranteed longer.', color: '#FFF3CD', iconColor: '#C17F24' },
    { icon: HeartHandshake, title: 'Fair Trade Sourcing', desc: 'Fair prices to farmers, ethical conditions across our supply chain.', color: '#F8D7DA', iconColor: '#DC3545' },
]

export default function WhySavika() {
    return (
        <section style={{ background: '#fff' }}>
            {/* Full-width CTA Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #C17F24 0%, #8B5E16 100%)',
                padding: '4rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', left: '-4rem', top: '-4rem', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: '-4rem', bottom: '-4rem', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: '1rem' }}>Our Promise</p>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>
                        Quality That <em style={{ color: '#FFE0A0' }}>Loves</em> Your Kitchen Back
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '1rem', marginBottom: '2rem' }}>
                        We are redefining spice with clean, conscious quality - from source to your shelf.
                    </p>
                    <Link href="/shop" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Store style={{ width: '16px', height: '16px' }} />
                        View All Products
                    </Link>
                </div>
            </div>

            {/* Reason Cards */}
            <div className="section-wrap" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                <div className="grid-cats">
                    {reasons.map((r) => {
                        const Icon = r.icon
                        return (
                            <div key={r.title} className="reason-card" style={{ background: r.color }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '10px',
                                    background: `${r.iconColor}25`, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                                }}>
                                    <Icon style={{ width: '1.1rem', height: '1.1rem', color: r.iconColor }} />
                                </div>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#2E2E2E', marginBottom: '0.5rem' }}>{r.title}</h3>
                                <p style={{ fontSize: '0.8125rem', color: '#555', lineHeight: 1.6 }}>{r.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
