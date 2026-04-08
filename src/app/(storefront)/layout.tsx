import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartSync from '@/components/cart/CartSync'

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <CartSync />
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
