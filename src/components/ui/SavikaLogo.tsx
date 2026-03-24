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
            ? 'w-16 h-16 ring-2 ring-white/40 group-hover:ring-white/60'
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
            filter: 'none',
          }}
          priority
        />
      </div>
      <div className="flex flex-col leading-none justify-center">
        <span
          className={`font-sans font-bold text-2xl tracking-wide transition-opacity
            ${isFooter ? 'text-white' : 'text-[#CD8527]'}
            group-hover:opacity-90`}
          style={{ fontWeight: 800 }}
        >
          SAVIKA
        </span>
        <span
          className={`font-sans tracking-[0.2em] uppercase mt-1 transition-opacity
            ${isFooter ? 'text-white/70 text-xs' : 'text-[#8E562E] text-[10px]'}
            group-hover:opacity-90`}
          style={{ fontWeight: 500 }}
        >
          Premium Spices
        </span>
      </div>
    </Link>
  )
}
