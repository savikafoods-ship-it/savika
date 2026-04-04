import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Flame, CookingPot, Package, Gem, ArrowRight, HelpCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

const iconMap: Record<string, LucideIcon> = {
    'whole': Flame,
    'ground': CookingPot,
    'powder': CookingPot,
    'blend': Package,
    'masala': Package,
    'rare': Gem,
    'exotic': Gem,
}

const colorMap = [
    { bg: '#FFF8EE', iconColor: '#C17F24' },
    { bg: '#FFFBEA', iconColor: '#D4A017' },
    { bg: '#FFF5F0', iconColor: '#D4562E' },
    { bg: '#F8F0FF', iconColor: '#9B59B6' },
]

async function getCategories() {
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true })
            .limit(4)
        return data || []
    } catch {
        return []
    }
}

export default async function CategoryShowcase() {
    const dbCategories = await getCategories()

    if (dbCategories.length === 0) return null

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
                    {dbCategories.map((cat, i) => {
                        const nameLower = cat.name.toLowerCase()
                        let Icon = HelpCircle
                        for (const [key, icon] of Object.entries(iconMap)) {
                            if (nameLower.includes(key)) {
                                Icon = icon
                                break
                            }
                        }
                        
                        const colors = colorMap[i % colorMap.length]

                        return (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="cat-card"
                                style={{ background: colors.bg }}
                            >
                                <div style={{
                                    width: '70px', height: '70px', borderRadius: '50%',
                                    background: '#fff', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', marginBottom: '1rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,.08)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {cat.image_url ? (
                                        <Image 
                                            src={getProductImageUrl(cat.image_url)} 
                                            alt={cat.name} 
                                            fill 
                                            className="object-contain p-3"
                                        />
                                    ) : (
                                        <Icon style={{ width: '1.75rem', height: '1.75rem', color: colors.iconColor }} />
                                    )}
                                </div>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2E2E2E', marginBottom: '4px' }}>{cat.name}</h3>
                                <p style={{ fontSize: '0.75rem', color: '#8E562E' }}>Explore varieties</p>
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

