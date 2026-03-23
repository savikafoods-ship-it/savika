export const metadata = {
    title: 'Shipping Policy - Savika Foods',
}

export default function ShippingPolicyPage() {
    return (
        <main className="pb-20 pt-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-[#F0E8DC] p-8 md:p-14 space-y-8">
                <div className="border-b border-[#F0E8DC] pb-6 mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-2">Shipping Policy</h1>
                    <p className="text-[#8E562E] text-sm">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A]">
                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">1. Processing Time</h2>
                    <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.</p>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">2. Shipping Rates & Delivery Estimates</h2>
                    <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><strong>Standard Shipping:</strong> ₹50 (3-5 business days)</li>
                        <li><strong>Free Shipping:</strong> Available on all orders over ₹599</li>
                    </ul>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">3. Shipment Confirmation & Order Tracking</h2>
                    <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">4. Damages</h2>
                    <p>Savika Foods is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim or contact us directly so we can assist.</p>
                </div>
            </div>
        </main>
    )
}
