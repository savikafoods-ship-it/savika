import Link from 'next/link'
import { CheckCircle2, ShoppingBag } from 'lucide-react'

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F0E8] px-4 py-20">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm border border-[#e8ddd0]">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                
                <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-2">Payment Successful!</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Thank you for your order. We have received your payment and will begin processing your freshly ground spices immediately.
                </p>

                <div className="space-y-3">
                    <Link 
                        href="/orders" 
                        className="w-full flex items-center justify-center gap-2 bg-[#C17F24] hover:bg-[#8B5E16] text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        View My Orders
                    </Link>
                    
                    <Link 
                        href="/shop" 
                        className="w-full block bg-[#F9F4EE] hover:bg-[#e8ddd0] text-[#2E2E2E] py-4 rounded-xl font-bold transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}
