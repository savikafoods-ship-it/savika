export const metadata = {
  robots: { index: false, follow: false },
};

// Force dynamic - signup uses auth
export const dynamic = 'force-dynamic'
export { default } from './SignupClient'
