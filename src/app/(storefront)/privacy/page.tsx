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
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A]">
                    <p>At Savika Foods Pvt. Ltd., we respect your privacy and are committed to protecting it through our compliance with this policy.</p>
                    
                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">1. Information We Collect</h2>
                    <p>We may collect several types of information from and about users of our Website, including information:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>By which you may be personally identified, such as name, postal address, e-mail address, and telephone number.</li>
                        <li>That is about you but individually does not identify you.</li>
                        <li>About your internet connection, the equipment you use to access our Website, and usage details.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">2. How We Use Your Information</h2>
                    <p>We use information that we collect about you or that you provide to us, including any personal information:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>To present our Website and its contents to you.</li>
                        <li>To provide you with information, products, or services that you request from us.</li>
                        <li>To fulfill any other purpose for which you provide it.</li>
                        <li>To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">3. Payment Information</h2>
                    <p>All payments are processed securely through PhonePe. We do not store your credit card or UPI details on our servers. Your payment information is subject to PhonePe's respective privacy policies.</p>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">4. Contact Information</h2>
                    <p>To ask questions or comment about this privacy policy and our privacy practices, contact us at: <strong>privacy@savikafoods.in</strong> or via our Contact Us page.</p>
                </div>
            </div>
        </main>
    )
}
