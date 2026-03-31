export const metadata = {
  robots: { index: false, follow: false },
};

// Force dynamic rendering - this page uses auth client-side
export const dynamic = 'force-dynamic'
export { default } from './LoginClient'
