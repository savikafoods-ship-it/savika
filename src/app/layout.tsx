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
  metadataBase: new URL('https://savikafoods.in'),
  title: {
    default: 'Savika Foods - Premium Indian Spices Online',
    template: '%s | Savika Foods',
  },
  description: 'Buy 100% pure, authentic Indian spices online. Stone-ground, FSSAI certified, farm-to-kitchen. Free delivery above Rs.599. Pan-India shipping.',
  keywords: ['Indian spices online', 'buy spices India', 'pure masala online', 'FSSAI certified spices', 'Savika Foods'],
  authors: [{ name: 'Savika Foods' }],
  creator: 'Savika Foods',
  publisher: 'Savika Foods',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://savikafoods.in',
    siteName: 'Savika Foods',
    title: 'Savika Foods - Premium Indian Spices Online',
    description: 'Buy 100% pure, authentic Indian spices online. Stone-ground, FSSAI certified, farm-to-kitchen.',
    images: [
      {
        url: 'https://savikafoods.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Savika Foods - Premium Indian Spices',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Savika Foods - Premium Indian Spices',
    description: 'Buy 100% pure, authentic Indian spices online.',
    images: ['https://savikafoods.in/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification=uXpJDtwPvH-mlv41KW8ZyBpGk-H0zt5nSm_MpiG_6i4',
  },
  alternates: {
    canonical: 'https://savikafoods.in',
  },
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
        <link rel="canonical" href="https://savikafoods.in" />
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
