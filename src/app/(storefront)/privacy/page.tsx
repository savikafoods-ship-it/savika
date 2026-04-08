export const metadata = {
    title: 'Privacy Policy - Savika Foods',
}

export default function PrivacyPolicyPage() {
    return (
        <main className="pb-20 pt-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-[#F0E8DC] p-8 md:p-14 space-y-8">
                <div className="border-b border-[#F0E8DC] pb-6 mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-2">Privacy Policy</h1>
                    <p className="text-[#8E562E] text-sm">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A] text-sm leading-relaxed space-y-6">
                    <p>At Savika Foods, accessible from savikafoods.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Savika Foods and how we use it.</p>
                    
                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">1. Consent</h2>
                        <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">2. Information We Collect</h2>
                        <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
                        <p className="mt-2">If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">3. How We Use Your Information</h2>
                        <p>We use the information we collect in various ways, including to:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Provide, operate, and maintain our website</li>
                            <li>Improve, personalize, and expand our website</li>
                            <li>Understand and analyze how you use our website</li>
                            <li>Develop new products, services, features, and functionality</li>
                            <li>Communicate with you, either directly or through one of our partners</li>
                            <li>Send you emails relating to your orders</li>
                            <li>Find and prevent fraud</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">4. Logistics and Payments</h2>
                        <p>We share necessary information with our delivery partners (e.g., Shiprocket) to ensure successful delivery. Payment processing is handled securely via PhonePe; we do not store sensitive payment credentials.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">5. Contact Us</h2>
                        <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>savikafoods@gmail.com</strong>.</p>
                    </section>
                </div>
            </div>
        </main>
    )
}
