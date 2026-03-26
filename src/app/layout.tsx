import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Savika Foods | Premium Indian Spices Online',
  description:
    'Buy premium Indian spices online. 100% pure whole spices, ground masalas, and artisan blends. FSSAI certified. Fast delivery across India. Shop Savika.',
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
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="font-[--font-poppins] bg-[#F5F0E8] texture-bg">
        <ToastProvider>
          <NextTopLoader color="#C17F24" height={3} showSpinner={false} />
          {children}
          <WhatsAppFloat />
        </ToastProvider>
      </body>
    </html>
  )
}
