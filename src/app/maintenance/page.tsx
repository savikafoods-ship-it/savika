import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Under Maintenance',
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 999999,
      }}
    />
  )
}
