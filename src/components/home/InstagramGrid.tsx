import Image from 'next/image'
import { Camera } from 'lucide-react'

const INSTAGRAM_POSTS = [
    { 
        id: 1, 
        src: '/images/gallery/kashmiri_mirch.png?v=1',
        caption: 'Sun-dried Kashmiri Mirch 🌶️ #SavikaSpices',
    },
    { 
        id: 2, 
        src: '/images/gallery/golden_turmeric.png?v=1',
        caption: 'Golden Turmeric — Pure & Lab-Tested ✨',
    },
    { 
        id: 3, 
        src: '/images/gallery/masala_blend.png?v=1',
        caption: 'Artisan Garam Masala Blend 🔥',
    },
    { 
        id: 4, 
        src: '/images/gallery/farm_spices.png?v=1',
        caption: 'Fresh from the farm 🌿 #FarmToKitchen',
    },
    { 
        id: 5, 
        src: '/images/gallery/whole_spices.png?v=1',
        caption: 'Exotic whole spices collection #SpiceLove',
    },
    { 
        id: 6, 
        src: '/images/gallery/gift_packs.png?v=1',
        caption: 'Premium Gift Packs — Handcrafted 🎁',
    },
]

export default function InstagramGrid() {
    return (
        <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <p className="text-xs uppercase tracking-widest text-[#8E562E] font-semibold mb-2 inline-flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-[#C17F24]" />Follow @savika.in
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E2E2E]">
                        The <span className="text-[#C17F24] italic">Spice Kitchen</span> Gallery
                    </h2>
                    <p className="text-sm text-gray-400 mt-2">Tag us with #SavikaSpices for a feature!</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 lg:gap-3">
                    {INSTAGRAM_POSTS.map((post) => (
                        <a
                            key={post.id}
                        href="https://www.instagram.com/savika.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square rounded-2xl overflow-hidden hover:scale-[1.03] transition-transform duration-300 shadow-sm hover:shadow-xl"
                        >
                            <Image
                                src={post.src}
                                alt={post.caption}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-3">
                                <Camera className="w-5 h-5 text-white mb-1.5 drop-shadow-lg" />
                                <p className="text-white text-[10px] font-bold text-center leading-tight drop-shadow-md">{post.caption}</p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Follow CTA */}
                <div className="text-center mt-6">
                    <a
                        href="https://www.instagram.com/savika.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#C17F24] hover:text-[#8B5E16] border border-[#C17F24]/30 rounded-full px-6 py-2.5 hover:bg-[#FFF0DC] transition-all"
                    >
                        <Camera className="w-4 h-4" />
                        Follow us on Instagram
                    </a>
                </div>
            </div>
        </section>
    )
}
