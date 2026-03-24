export const metadata = {
    title: 'Refund Policy - Savika Foods',
}

export default function RefundPolicyPage() {
    return (
        <main className="pb-20 pt-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-[#F0E8DC] p-8 md:p-14 space-y-8">
                <div className="border-b border-[#F0E8DC] pb-6 mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-2">Refund & Return Policy</h1>
                    <p className="text-[#8E562E] text-sm">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A]">
                    <p>Thanks for purchasing our products at Savika Foods operated by Savika Foods Pvt. Ltd.</p>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">1. Returns</h2>
                    <p>Given the perishable nature of spices and food products, we generally do not accept returns. However, we offer a 100% money-back guarantee in the following situations:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>The product received was damaged or tampered with.</li>
                        <li>An incorrect item was shipped to you.</li>
                        <li>The product was expired at the time of delivery.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">2. Claiming a Refund</h2>
                    <p>If you are eligible for a refund, you must notify us within 7 days of receiving the product. Please send an email to savikafoods@gmail.com with your order number and photographic evidence of the issue.</p>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">3. Refund Processing</h2>
                    <p>Once your claim is approved, we will initiate a refund to your original method of payment (via PhonePe, Credit Card, etc.). You will receive the credit within 5-7 business days, depending on your card issuer's policies.</p>
                </div>
            </div>
        </main>
    )
}
