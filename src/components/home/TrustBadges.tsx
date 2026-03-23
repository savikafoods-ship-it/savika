'use client'

import { Leaf, Award, Truck, RotateCcw, Shield, Sprout, FlaskConical, HeartHandshake } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const badges: { icon: LucideIcon; text: string }[] = [
    { icon: Leaf, text: '100% Natural' },
    { icon: Award, text: 'FSSAI Certified' },
    { icon: Truck, text: 'Pan-India Delivery' },
    { icon: RotateCcw, text: '7-Day Easy Returns' },
    { icon: Shield, text: 'Secure Payments' },
    { icon: Sprout, text: 'Vegan Friendly' },
    { icon: FlaskConical, text: 'Lab-Tested Quality' },
    { icon: HeartHandshake, text: 'Fair Trade Sourced' },
]

// Duplicate for seamless loop
const all = [...badges, ...badges]

export default function TrustBadges() {
    return (
        <div className="bg-[#C17F24] overflow-hidden py-2.5">
            <div
                className="flex items-center whitespace-nowrap"
                style={{
                    animation: 'marquee 28s linear infinite',
                    width: 'max-content',
                }}
            >
                {all.map((b, i) => {
                    const Icon = b.icon
                    return (
                        <span key={i} className="inline-flex items-center gap-2 text-white text-xs font-semibold px-6">
                            <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.8)' }} />
                            {b.text}
                            <span className="mx-2 opacity-40">|</span>
                        </span>
                    )
                })}
            </div>
            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    )
}
