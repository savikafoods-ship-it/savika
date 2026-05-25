import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'We\'ll Be Right Back | Savika Foods',
  description: 'Savika Foods is currently undergoing scheduled maintenance. We\'ll be back shortly with fresh spices and flavors.',
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Poppins', sans-serif" }}>
        <div style={styles.container}>
          {/* Animated background elements */}
          <div style={styles.bgOrb1} />
          <div style={styles.bgOrb2} />
          <div style={styles.bgOrb3} />

          {/* Content */}
          <div style={styles.content}>
            {/* Logo */}
            <div style={styles.logoWrap}>
              <img
                src="/logo.png"
                alt="Savika Foods"
                width={80}
                height={80}
                style={styles.logo}
              />
            </div>

            {/* Spice icon animation */}
            <div style={styles.iconRow}>
              <span style={{ ...styles.spiceIcon, animationDelay: '0s' }}>🌿</span>
              <span style={{ ...styles.spiceIcon, animationDelay: '0.3s' }}>🌶️</span>
              <span style={{ ...styles.spiceIcon, animationDelay: '0.6s' }}>✨</span>
              <span style={{ ...styles.spiceIcon, animationDelay: '0.9s' }}>🫚</span>
              <span style={{ ...styles.spiceIcon, animationDelay: '1.2s' }}>🌿</span>
            </div>

            {/* Heading */}
            <h1 style={styles.heading}>
              We&apos;re Brewing<br />Something Special
            </h1>

            {/* Divider */}
            <div style={styles.divider} />

            {/* Description */}
            <p style={styles.description}>
              Our kitchen is undergoing a quick refresh to serve you even better.
              <br />
              We&apos;ll be back shortly with the finest spices &amp; flavors.
            </p>

            {/* Status card */}
            <div style={styles.statusCard}>
              <div style={styles.statusDot} />
              <span style={styles.statusText}>Scheduled Maintenance in Progress</span>
            </div>

            {/* Contact info */}
            <div style={styles.contactSection}>
              <p style={styles.contactLabel}>Need help? Reach us on WhatsApp</p>
              <a
                href="https://wa.me/919898176667"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.whatsappBtn}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat with us
              </a>
            </div>

            {/* Footer */}
            <p style={styles.footer}>
              © {new Date().getFullYear()} Savika Foods · savikafoods.in
            </p>
          </div>

          {/* Inline keyframes via style tag */}
          <style dangerouslySetInnerHTML={{ __html: keyframesCSS }} />
        </div>
      </body>
    </html>
  )
}

const keyframesCSS = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.4); }
  }
  @keyframes drift1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 15px) scale(0.95); }
  }
  @keyframes drift2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(-25px, 20px) scale(1.08); }
    66% { transform: translate(15px, -25px) scale(0.92); }
  }
  @keyframes drift3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, 20px) scale(1.1); }
  }
`

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(160deg, #F5F0E8 0%, #FFF8EE 40%, #F5F0E8 70%, #EDE4D4 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem 1rem',
  },
  bgOrb1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(193,127,36,0.08) 0%, transparent 70%)',
    animation: 'drift1 12s ease-in-out infinite',
    pointerEvents: 'none' as const,
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '-15%',
    left: '-10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,94,22,0.06) 0%, transparent 70%)',
    animation: 'drift2 15s ease-in-out infinite',
    pointerEvents: 'none' as const,
  },
  bgOrb3: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)',
    animation: 'drift3 10s ease-in-out infinite',
    pointerEvents: 'none' as const,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center' as const,
    maxWidth: '560px',
    width: '100%',
  },
  logoWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '24px',
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(193,127,36,0.12), 0 2px 8px rgba(0,0,0,0.04)',
    marginBottom: '1.5rem',
    border: '1px solid rgba(255,255,255,0.5)',
  },
  logo: {
    width: '72px',
    height: '72px',
    objectFit: 'contain' as const,
  },
  iconRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
    fontSize: '1.75rem',
  },
  spiceIcon: {
    display: 'inline-block',
    animation: 'float 2.5s ease-in-out infinite',
  },
  heading: {
    fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
    fontWeight: 800,
    color: '#2E2E2E',
    lineHeight: 1.2,
    margin: '0 0 1rem 0',
    letterSpacing: '-0.02em',
  },
  divider: {
    width: '80px',
    height: '3px',
    background: 'linear-gradient(90deg, transparent, #C17F24, transparent)',
    margin: '0 auto 1.5rem',
    borderRadius: '2px',
  },
  description: {
    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
    color: '#666',
    lineHeight: 1.7,
    margin: '0 0 2rem 0',
    fontWeight: 400,
  },
  statusCard: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.65rem 1.25rem',
    borderRadius: '9999px',
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(193,127,36,0.15)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    marginBottom: '2.5rem',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#C17F24',
    animation: 'pulse-dot 2s ease-in-out infinite',
    flexShrink: 0,
  },
  statusText: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#8B5E16',
    letterSpacing: '0.02em',
  },
  contactSection: {
    marginBottom: '2rem',
  },
  contactLabel: {
    fontSize: '0.85rem',
    color: '#888',
    margin: '0 0 0.75rem 0',
  },
  whatsappBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.7rem 1.5rem',
    borderRadius: '9999px',
    background: '#25D366',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.9rem',
    textDecoration: 'none',
    boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
    transition: 'transform 200ms, box-shadow 200ms',
  },
  footer: {
    fontSize: '0.75rem',
    color: '#aaa',
    margin: 0,
    fontWeight: 400,
  },
}
