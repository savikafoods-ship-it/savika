export const metadata = {
    title: 'Terms & Conditions - Savika Foods',
}

export default function TermsPage() {
    return (
        <main className="pb-20 pt-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-[#F0E8DC] p-8 md:p-14 space-y-8">
                <div className="border-b border-[#F0E8DC] pb-6 mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-2">Terms & Conditions</h1>
                    <p className="text-[#8E562E] text-sm">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A] text-sm leading-relaxed space-y-6">
                    <p>Welcome to Savika Foods. These Terms and Conditions govern your use of our website and the purchase of our products. By accessing or using our Website, you agree to be bound by these terms.</p>
                    
                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">1. Agreement to Terms</h2>
                        <p>By placing an order on our Website, you represent that you are at least 18 years of age or are using the Website under the supervision of a parent or guardian. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">2. Product Accuracy</h2>
                        <p>We take immense pride in the quality of our spices. However, as spices are natural agricultural products, there may be slight variations in color, aroma, or texture between batches. We reserve the right to modify prices or discontinue products at any time without prior notice.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">3. Payments and Security</h2>
                        <p>All transactions are processed through secure, third-party payment gateways (PhonePe). We do not store your financial data. Your use of those services is governed by their respective terms of service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">4. Intellectual Property</h2>
                        <p>The content, logo, graphics, and product names on this Website are the intellectual property of Savika Foods. Unauthorized use, reproduction, or distribution is strictly prohibited.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">5. Limitation of Liability</h2>
                        <p>Savika Foods shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our products or the inability to use our Website.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">6. Governing Law</h2>
                        <p>These terms are governed by the laws of India. Any disputes arising out of your use of the Website shall be subject to the exclusive jurisdiction of the courts in India.</p>
                    </section>
                </div>
            </div>
        </main>
    )
}
