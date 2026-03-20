import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

const poppins = Poppins({
 subsets: ['latin', 'latin-ext'],
 weight: ['300', '400', '500', '600', '700', '800'],
 variable: '--font-poppins',
 display: 'swap',
 preload: true,
})

export const metadata: Metadata = {
  title: 'Savika | Premium Indian Spices',
  description: 'Discover the finest, purest premium Indian spices online. Authentic flavors, sourced with care.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-[--font-poppins] bg-[#F5F0E8]">
        {children}
      </body>
    </html>
  )
}
