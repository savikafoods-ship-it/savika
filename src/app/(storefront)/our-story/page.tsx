import Image from 'next/image'
import { Leaf, ShieldCheck, Sun } from 'lucide-react'

export const metadata = {
    title: 'Our Story - Savika Foods',
    description: 'Discover the legacy of premium Indian spices with Savika Foods.'
}

export default function OurStoryPage() {
    return (
        <main className="pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#2E2E2E]">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    {/* Placeholder image representation, replace with real asset */}
                    <div className="w-full h-full object-cover opacity-80 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2000')] bg-cover bg-center" />
                </div>
                
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-6 animate-fadeUp">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl">
                        A Legacy of <span className="text-[#C47F17]">Spice</span>.
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 drop-shadow-md font-medium max-w-2xl mx-auto">
                        We don&apos;t just sell ingredients; we bottle the soul of Indian kitchens.
                    </p>
                </div>
            </section>

            {/* Content Blocks */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
                <div className="bg-white rounded-3xl shadow-xl border border-[#F0E8DC] p-8 md:p-16 space-y-20">
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E]">Rooted in Tradition</h2>
                            <p className="text-[#5A5A5A] text-lg leading-relaxed">
                                Decades ago, our ancestors understood that true flavor cannot be mass-produced. It requires patience, the right climate, and a deep respect for the earth. Savika was born from a desire to preserve these ancient methods in a modern world.
                            </p>
                            <p className="text-[#5A5A5A] leading-relaxed">
                                Every pinch of Savika spice carries the essence of sun-dried chilis, hand-pounded turmeric, and carefully roasted cumin. We bypassed the middlemen to work directly with generational farmers across India, ensuring that what reaches your plate is nothing short of extraordinary.
                            </p>
                        </div>
                        <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-[#C47F17]/20 mix-blend-color z-10 rounded-2xl" />
                            <Image 
                                src="https://images.unsplash.com/photo-1540340061722-9293d5163008?q=80&w=800" 
                                alt="Farmers sorting spices" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 py-12 border-y border-[#F0E8DC]">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#FFF0DC] text-[#C47F17] flex items-center justify-center mx-auto mb-2">
                                <Leaf className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E]">100% Pure</h3>
                            <p className="text-[#5A5A5A] text-sm">No fillers, no artificial coloring. Just unadulterated spice.</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#FFF0DC] text-[#C47F17] flex items-center justify-center mx-auto mb-2">
                                <Sun className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E]">Sun-Dried</h3>
                            <p className="text-[#5A5A5A] text-sm">Traditional drying methods to lock in volatile essential oils.</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#FFF0DC] text-[#C47F17] flex items-center justify-center mx-auto mb-2">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2E2E2E]">Ethically Sourced</h3>
                            <p className="text-[#5A5A5A] text-sm">Fair wages and direct trade with our farming partners.</p>
                        </div>
                    </div>

                    <div className="text-center max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E]">The Savika Promise</h2>
                        <p className="text-[#5A5A5A] text-lg leading-relaxed italic">
                            "We believe that a meal is more than sustenance; it's a memory in the making. Our mission is to ensure every dish you create resonates with the authentic, vibrant flavors of India. Welcome to the Savika family."
                        </p>
                        <hr className="w-20 mx-auto border-[#C47F17] border-2" />
                    </div>

                </div>
            </section>
        </main>
    )
}
