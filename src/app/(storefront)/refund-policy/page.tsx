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
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A] text-sm leading-relaxed space-y-6">
                    <p>At Savika Foods, we take great care in delivering our products to you and we hope you enjoy every purchase. If for any reason you are not completely satisfied, we have a clear refund and return policy.</p>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">1. Eligibility for Returns</h2>
                        <p>Given the perishable nature of spices and food products, we accept returns only in the following cases:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>The product received is damaged or tampered with.</li>
                            <li>The product received is incorrect (wrong item shipped).</li>
                            <li>The product has passed its expiry date at the time of delivery.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">2. Return Process</h2>
                        <p>To initiate a return, please contact us at <strong>savikafoods@gmail.com</strong> within <strong>7 days</strong> of delivery. Please provide your order number and clear photographs of the product issue. Once reviewed, we will arrange for a reverse pickup or provide further instructions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">3. Refunds</h2>
                        <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment (PhonePe, UPI, or Credit Card) within <strong>5-7 business days</strong>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">4. Cancellations</h2>
                        <p>Orders can only be cancelled before they are dispatched. Once an order is handed over to our logistics partner, it cannot be cancelled.</p>
                    </section>
                </div>
            </div>
        </main>
    )
}
