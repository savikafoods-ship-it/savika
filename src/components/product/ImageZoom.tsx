'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faChevronLeft, faChevronRight, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { getProductImageUrl } from '@/lib/supabase/imageUrl'

interface ImageZoomProps {
    images: string[]
    alt: string
    priority?: boolean
}

export default function ImageZoom({ images, alt, priority = true }: ImageZoomProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, active: false })
    const mainImageRef = useRef<HTMLDivElement>(null)

    // Touch swipe state
    const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)

    const resolvedImages = images?.length > 0
        ? images.map(img => getProductImageUrl(img))
        : ['/placeholder-product.png']

    const currentImage = resolvedImages[currentIndex] || resolvedImages[0]
    const hasMultiple = resolvedImages.length > 1

    // ── Desktop Zoom Handlers ──
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!mainImageRef.current) return
        const rect = mainImageRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoomPosition({ x, y, active: true })
    }, [])

    const handleMouseLeave = useCallback(() => {
        setZoomPosition(prev => ({ ...prev, active: false }))
    }, [])

    // ── Lightbox Navigation ──
    const goNext = useCallback(() => {
        if (hasMultiple) setCurrentIndex(i => (i + 1) % resolvedImages.length)
    }, [hasMultiple, resolvedImages.length])

    const goPrev = useCallback(() => {
        if (hasMultiple) setCurrentIndex(i => (i - 1 + resolvedImages.length) % resolvedImages.length)
    }, [hasMultiple, resolvedImages.length])

    // ── Keyboard Support ──
    useEffect(() => {
        if (!lightboxOpen) return
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxOpen(false)
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [lightboxOpen, goNext, goPrev])

    // ── Lock body scroll when lightbox open ──
    useEffect(() => {
        if (lightboxOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [lightboxOpen])

    // ── Touch handlers for lightbox swipe ──
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0]
        touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() }
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current) return
        const touch = e.changedTouches[0]
        const dx = touch.clientX - touchStart.current.x
        const dy = touch.clientY - touchStart.current.y
        const elapsed = Date.now() - touchStart.current.time

        // Only trigger swipe if horizontal and fast enough
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && elapsed < 500) {
            if (dx < 0) goNext()
            else goPrev()
        }
        touchStart.current = null
    }

    return (
        <div className="space-y-3">
            {/* ── Main Image ── */}
            <div
                ref={mainImageRef}
                className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl cursor-zoom-in group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setLightboxOpen(true)}
            >
                <Image
                    src={currentImage}
                    alt={`${alt} - Buy Online India | Savika`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover"
                    priority={priority}
                />

                {/* Desktop zoom lens overlay */}
                {zoomPosition.active && (
                    <div
                        className="absolute inset-0 hidden md:block pointer-events-none z-10"
                        style={{
                            backgroundImage: `url(${currentImage})`,
                            backgroundSize: '300%',
                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                )}

                {/* Zoom hint icon */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none">
                    <FontAwesomeIcon icon={faSearchPlus} className="w-4 h-4 text-[#C47F17]" />
                </div>
            </div>

            {/* ── Thumbnail Strip ── */}
            {hasMultiple && (
                <div className="grid grid-cols-4 gap-2">
                    {resolvedImages.slice(0, 8).map((url, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`relative aspect-square rounded-xl overflow-hidden bg-white shadow transition-all ${
                                currentIndex === i
                                    ? 'border-2 border-[#C47F17] ring-2 ring-[#C47F17]/20'
                                    : 'border-2 border-transparent hover:border-gray-300'
                            }`}
                        >
                            <Image
                                src={url}
                                alt={`${alt} view ${i + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* ── Lightbox ── */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false) }}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors p-2"
                        aria-label="Close lightbox"
                    >
                        <FontAwesomeIcon icon={faXmark} className="w-7 h-7" />
                    </button>

                    {/* Navigation arrows */}
                    {hasMultiple && (
                        <>
                            <button
                                onClick={goPrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-gray-300 transition-colors p-3 bg-white/10 backdrop-blur-sm rounded-full"
                                aria-label="Previous image"
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
                            </button>
                            <button
                                onClick={goNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:text-gray-300 transition-colors p-3 bg-white/10 backdrop-blur-sm rounded-full"
                                aria-label="Next image"
                            >
                                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Lightbox image with pinch-to-zoom */}
                    <div
                        className="relative w-full h-full max-w-3xl max-h-[80vh] mx-4"
                        style={{ touchAction: 'manipulation' }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <Image
                            src={currentImage}
                            alt={`${alt} - Full view`}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            quality={90}
                        />
                    </div>

                    {/* Dot indicators */}
                    {hasMultiple && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
                            {resolvedImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`rounded-full transition-all ${
                                        currentIndex === i
                                            ? 'w-3 h-3 bg-[#C47F17]'
                                            : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                                    }`}
                                    aria-label={`View image ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
