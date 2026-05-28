import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Site Under Maintenance | Savika Foods',
  description: 'We are currently performing scheduled maintenance to improve our services. We will be back online shortly.',
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <div style={styles.container}>
      {/* Top Header Section */}
      <header style={styles.header}>
        <div style={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Savika Foods Logo"
            width={28}
            height={28}
            style={styles.logoImage}
            priority
          />
        </div>
        <span style={styles.domainName}>savikafoods.in</span>
      </header>

      {/* Main Content Card */}
      <main style={styles.main}>
        <h1 style={styles.heading}>
          The site is currently down for maintenance
        </h1>
        <p style={styles.subtext}>
          We apologize for any inconveniences caused.<br />
          We're almost done.
        </p>

        {/* Plug & Socket Connection Illustration */}
        <div style={styles.illustrationContainer}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 650 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={styles.svg}
          >
            <defs>
              {/* Amber Plug Gradients */}
              <linearGradient id="amberPlugGrad" x1="270" y1="135" x2="325" y2="135" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              {/* Green Plug Gradients */}
              <linearGradient id="greenPlugGrad" x1="455" y1="95" x2="405" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#15803D" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>

            {/* Left Wire (Light Amber) */}
            <path
              d="M 0,100 L 150,100 C 190,100 180,135 220,135 L 275,135"
              stroke="#FDE047"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Left Male Plug Body */}
            {/* Main Rounded Collar Rect */}
            <path
              d="M 275,112 H 315 A 8,8 0 0 1 323,120 V 150 A 8,8 0 0 1 315,158 H 275 A 4,4 0 0 1 271,154 V 116 A 4,4 0 0 1 275,112 Z"
              fill="url(#amberPlugGrad)"
            />
            {/* Details & Highlights */}
            <rect x="290" y="114" width="10" height="42" fill="#78350F" opacity="0.15" />
            <rect x="275" y="114" width="40" height="3" fill="#FFFFFF" opacity="0.25" rx="1.5" />
            {/* Rubber Cord Entry sleeve */}
            <rect x="265" y="125" width="8" height="20" fill="#D97706" rx="2" />

            {/* Metal Prongs */}
            {/* Top Prong */}
            <rect x="323" y="123" width="30" height="6" rx="2" fill="#9CA3AF" />
            <rect x="348" y="123" width="5" height="6" rx="1" fill="#4B5563" />
            {/* Bottom Prong */}
            <rect x="323" y="141" width="30" height="6" rx="2" fill="#9CA3AF" />
            <rect x="348" y="141" width="5" height="6" rx="1" fill="#4B5563" />

            {/* Left Energy Arcs */}
            <path d="M 330,100 A 16,16 0 0,1 342,84" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 330,170 A 16,16 0 0,0 342,186" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />


            {/* Right Wire (Light Green) */}
            <path
              d="M 455,95 L 500,95 C 540,95 530,75 570,75 L 650,75"
              stroke="#86EFAC"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Right Female Plug Body */}
            {/* Main Rounded Rect */}
            <path
              d="M 455,72 H 415 A 8,8 0 0 0 407,80 V 110 A 8,8 0 0 0 415,118 H 455 A 4,4 0 0 0 459,114 V 76 A 4,4 0 0 0 455,72 Z"
              fill="url(#greenPlugGrad)"
            />
            {/* Female Receiver Collar (larger front cover) */}
            <rect x="399" y="67" width="8" height="56" rx="3" fill="#15803D" />
            <rect x="399" y="69" width="2" height="52" rx="1" fill="#FFFFFF" opacity="0.3" />
            {/* Cord Entry sleeve */}
            <rect x="457" y="85" width="8" height="20" fill="#15803D" rx="2" />

            {/* Female Slots */}
            <rect x="397" y="79" width="3" height="8" rx="1.5" fill="#052E16" />
            <rect x="397" y="97" width="3" height="8" rx="1.5" fill="#052E16" />

            {/* Right Energy Arcs */}
            <path d="M 390,52 A 16,16 0 0,0 378,36" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 390,122 A 16,16 0 0,1 378,138" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: '#1F2937',
    padding: '2.5rem 1.5rem',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  header: {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.625rem',
    marginBottom: '6rem',
  },
  logoWrapper: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    mixBlendMode: 'multiply',
  },
  domainName: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#1F2937',
    letterSpacing: '-0.01em',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '800px',
    textAlign: 'center',
    flexGrow: 1,
    paddingBottom: '8rem',
  },
  heading: {
    fontSize: '2.25rem',
    fontWeight: 800,
    color: '#1F2937',
    lineHeight: 1.25,
    margin: '0 auto 1.5rem auto',
    maxWidth: '600px',
    letterSpacing: '-0.02em',
  },
  subtext: {
    fontSize: '1rem',
    color: '#6B7280',
    lineHeight: 1.6,
    margin: '0 auto 3.5rem auto',
    fontWeight: 400,
  },
  illustrationContainer: {
    width: '100%',
    maxWidth: '520px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  svg: {
    width: '100%',
    height: 'auto',
  },
}
