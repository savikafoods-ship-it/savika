export const metadata = {
    title: 'Return Policy - Savika Foods',
}

export default function ReturnPolicyPage() {
    return (
        <main className="pb-20 pt-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-[#F0E8DC] p-8 md:p-14 space-y-8">
                <div className="border-b border-[#F0E8DC] pb-6 mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-2 font-display">Return Policy</h1>
                    <p className="text-[#8E562E] text-sm">Effective as of {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A] text-sm leading-relaxed space-y-12">
                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#C17F24] rounded-full"></span>
                            Return Policy
                        </h2>
                        <div className="space-y-4">
                            <p>We offer refund / exchange within first 2 days from the date of your purchase. If 2 days have passed since your purchase, you will not be offered a return, exchange or refund of any kind.</p>
                            
                            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 space-y-4">
                                <p className="font-semibold text-[#2E2E2E]">In order to become eligible for a return or an exchange:</p>
                                <ul className="list-decimal pl-5 space-y-2">
                                    <li>The purchased item should be unused and in the same condition as you received it.</li>
                                    <li>The item must have original packaging.</li>
                                    <li>If the item that you purchased was on a sale, then the item may not be eligible for a return / exchange.</li>
                                </ul>
                                <p className="text-sm">Further, only such items are replaced by us (based on an exchange request), if such items are found defective or damaged.</p>
                            </div>

                            <p>You agree that there may be a certain category of products / items that are exempted from returns or refunds. Such categories of the products would be identified to you at the item of purchase.</p>
                            
                            <p>For exchange / return accepted request(s) (as applicable), once your returned product / item is received and inspected by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further, if the same has been approved after the quality check at our end, your request (i.e. return / exchange) will be processed in accordance with our policies.</p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
