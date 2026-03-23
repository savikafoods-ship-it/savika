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
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A]">
                    <p>These terms and conditions outline the rules and regulations for the use of Savika Foods Pvt. Ltd.'s Website.</p>
                    
                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Savika Foods if you do not agree to take all of the terms and conditions stated on this page.</p>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">2. Products and Disclaimers</h2>
                    <p>All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">3. User Accounts</h2>
                    <p>If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account.</p>

                    <h2 className="text-xl font-bold text-[#2E2E2E] mt-8 mb-4">4. Governing Law</h2>
                    <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
                </div>
            </div>
        </main>
    )
}
