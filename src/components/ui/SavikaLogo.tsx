import Image from 'next/image'
import Link from 'next/link'

interface SavikaLogoProps {
  variant: 'header' | 'footer'
  className?: string
}

export function SavikaLogo({ variant, className = '' }: SavikaLogoProps) {
  const isFooter = variant === 'footer'

  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 select-none group ${className}`}
      aria-label="Savika Foods - Home"
    >
      <div
        className={`
          relative flex-shrink-0 rounded-full overflow-hidden
          ${isFooter
            ? 'w-14 h-14 ring-2 ring-white/30 group-hover:ring-white/60'
            : 'w-12 h-12 ring-2 ring-amber-700/20 group-hover:ring-amber-700/50'
          }
          transition-all duration-200
        `}
        style={{
          background: isFooter ? 'rgba(255,255,255,0.12)' : 'transparent',
        }}
      >
        <Image
          src="/logo.png"
          alt="Savika logo mark"
          width={56}
          height={56}
          className="w-full h-full object-contain"
          style={{
            mixBlendMode: isFooter ? 'normal' : 'multiply',
            filter: isFooter
              ? 'brightness(1.2) drop-shadow(0 0 6px rgba(255,255,255,0.3))'
              : 'none',
          }}
          priority
        />
      </div>
      <div className="flex flex-col leading-none justify-center">
        <span
          className={`font-sans text-2xl sm:text-3xl
            ${isFooter ? 'text-white' : 'text-[#CD8527]'}
            group-hover:opacity-90 transition-opacity`}
          style={{ fontWeight: 900, letterSpacing: '-0.02em' }}
        >
          SAVIKA
        </span>
        <span
          className={`font-sans text-[9px] sm:text-[10px] mt-0.5
            ${isFooter ? 'text-white/80' : 'text-[#8E562E]'}
            group-hover:opacity-90 transition-opacity`}
          style={{ fontWeight: 600, letterSpacing: '0.28em' }}
        >
          PREMIUM SPICES
        </span>
      </div>
    </Link>
  )
}
