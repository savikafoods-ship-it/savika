export const metadata = {
    title: 'Shipping Policy - Savika Foods',
}

export default function ShippingPolicyPage() {
    return (
        <main className="pb-20 pt-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-[#F0E8DC] p-8 md:p-14 space-y-8">
                <div className="border-b border-[#F0E8DC] pb-6 mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-2 font-display">Shipping Policy</h1>
                    <p className="text-[#8E562E] text-sm">Effective as of {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A] text-sm leading-relaxed space-y-8">
                    <section className="bg-[#C17F24]/5 p-8 rounded-3xl border border-[#F0E8DC]">
                        <p className="text-lg font-medium text-[#2E2E2E] mb-4">General Shipping Information</p>
                        <p>The orders for the user are shipped through registered domestic courier companies and/or speed post only. Orders are shipped within <strong>2 days</strong> from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / post office norms.</p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#C17F24] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                            <div>
                                <h3 className="text-lg font-bold text-[#2E2E2E]">Liability</h3>
                                <p>Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#C17F24] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                            <div>
                                <h3 className="text-lg font-bold text-[#2E2E2E]">Delivery Address</h3>
                                <p>Delivery of all orders will be made to the address provided by the buyer at the time of purchase.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#C17F24] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                            <div>
                                <h3 className="text-lg font-bold text-[#2E2E2E]">Confirmation</h3>
                                <p>Delivery of our services will be confirmed on your email ID as specified at the time of registration.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#C17F24] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</div>
                            <div>
                                <h3 className="text-lg font-bold text-[#2E2E2E]">Refunds on Shipping</h3>
                                <p>If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
