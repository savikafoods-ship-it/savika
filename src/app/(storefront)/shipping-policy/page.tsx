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
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A] text-sm leading-relaxed space-y-6">
                    <p>At Savika Foods, we strive to deliver our premium spices to you in the shortest possible time while ensuring they reach you in perfect condition.</p>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">1. Processing and Dispatch</h2>
                        <p>All orders are processed and dispatched within <strong>1-2 business days</strong>. Orders placed on weekends or public holidays will be processed on the next business day.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">2. Delivery Timelines</h2>
                        <p>We deliver across India. Estimated delivery times are as follows:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Metros:</strong> 3-5 business days</li>
                            <li><strong>Rest of India:</strong> 5-7 business days</li>
                        </ul>
                        <p className="mt-2">Please note that delivery times are estimates and may vary due to external factors like logistics delays or weather conditions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">3. Shipping Charges</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Standard Shipping:</strong> A flat fee of ₹50 applies to orders below ₹599.</li>
                            <li><strong>Free Shipping:</strong> We offer free standard shipping on all orders over <strong>₹599</strong>.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">4. Tracking Your Order</h2>
                        <p>Once your order is shipped, you will receive an email and SMS notification with a tracking number and a link to our logistics partner's website (e.g., Shiprocket) to track your package in real-time.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">5. Delivery Issues</h2>
                        <p>If your package is marked as delivered but you haven't received it, or if the package is missing entirely, please contact us within 24 hours at <strong>savikafoods@gmail.com</strong> so we can investigate with our courier partner.</p>
                    </section>
                </div>
            </div>
        </main>
    )
}
