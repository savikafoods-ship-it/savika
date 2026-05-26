import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Under Scheduled Maintenance | Savika Foods',
  description: 'Savika Foods is undergoing scheduled maintenance. We will be back online shortly with premium spices and authentic Indian flavors.',
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <div style={styles.container}>
      {/* Decorative Warm Orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <div style={styles.card}>
        {/* Logo Container */}
        <div style={styles.logoContainer}>
          <img
            src="/logo.png"
            alt="Savika Foods"
            style={styles.logo}
          />
        </div>

        {/* Status Badge */}
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          <span style={styles.badgeText}>System Refresh in Progress</span>
        </div>

        {/* Main Heading */}
        <h1 style={styles.heading}>
          Enhancing Your Spice Experience
        </h1>

        {/* Message */}
        <p style={styles.message}>
          Our digital store is temporarily offline for a scheduled update. We are fine-tuning our platform to bring you a faster and more aromatic shopping experience.
        </p>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Friendly Subtext */}
        <p style={styles.subtext}>
          Thank you for your patience! We will be back online shortly.
        </p>

        {/* Footer */}
        <div style={styles.footer}>
          © {new Date().getFullYear()} Savika Foods. All rights reserved.
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #FDFBF7 0%, #EFEBE0 100%)',
    fontFamily: "'Poppins', 'Inter', sans-serif",
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 999999,
    overflowY: 'auto',
    padding: '2rem 1rem',
    boxSizing: 'border-box',
  },
  orb1: {
    position: 'absolute',
    top: '-10%',
    right: '-10%',
    width: '50vw',
    height: '50vw',
    maxHeight: '600px',
    maxWidth: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(193, 127, 36, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '60vw',
    height: '60vw',
    maxHeight: '700px',
    maxWidth: '700px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 94, 22, 0.06) 0%, rgba(255, 255, 255, 0) 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '32px',
    padding: '3rem 2.5rem',
    maxWidth: '540px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(45, 37, 30, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02)',
    textAlign: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  logoContainer: {
    width: '96px',
    height: '96px',
    borderRadius: '24px',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(193, 127, 36, 0.08)',
    marginBottom: '2rem',
    border: '1px solid rgba(193, 127, 36, 0.1)',
  },
  logo: {
    width: '76px',
    height: '76px',
    objectFit: 'contain',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    borderRadius: '100px',
    background: 'rgba(193, 127, 36, 0.08)',
    border: '1px solid rgba(193, 127, 36, 0.15)',
    marginBottom: '1.5rem',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#C17F24',
    boxShadow: '0 0 8px #C17F24',
  },
  badgeText: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#8B5E16',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#2E251B',
    lineHeight: 1.3,
    margin: '0 0 1rem 0',
    letterSpacing: '-0.01em',
  },
  message: {
    fontSize: '1rem',
    color: '#655D54',
    lineHeight: 1.6,
    margin: '0 0 2rem 0',
  },
  divider: {
    width: '60px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #C17F24, transparent)',
    margin: '0 auto 1.5rem',
  },
  subtext: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#8B5E16',
    margin: '0 0 1.5rem 0',
  },
  footer: {
    fontSize: '0.75rem',
    color: '#9C958E',
    marginTop: '1rem',
  },
}
