export const metadata = {
    title: 'Refund & Cancellation Policy - Savika Foods',
}

export default function RefundPolicyPage() {
    return (
        <main className="pb-20 pt-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-[#F0E8DC] p-8 md:p-14 space-y-8">
                <div className="border-b border-[#F0E8DC] pb-6 mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-2 font-display">Refund & Cancellation</h1>
                    <p className="text-[#8E562E] text-sm">Effective as of {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                
                <div className="prose prose-[#C17F24] max-w-none text-[#5A5A5A] text-sm leading-relaxed space-y-12">
                    <section>
                        <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#C17F24] rounded-full"></span>
                            Refund and Cancellation policy
                        </h2>
                        <div className="space-y-4">
                            <p>This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform. Under this policy:</p>
                            <ul className="list-disc pl-5 space-y-3">
                                <li><strong>Cancellations:</strong> Will only be considered if the request is made 2 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.</li>
                                <li><strong>Perishable Items:</strong> 9898176667 does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.</li>
                                <li><strong>Damaged or Defective Items:</strong> In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed on the Platform, has checked and determined the same at its own end. This should be reported within 2 days of receipt of products.</li>
                                <li><strong>Product Expectation:</strong> In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 2 days of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.</li>
                                <li><strong>Manufacturer Warranty:</strong> In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.</li>
                                <li><strong>Refund Approval:</strong> In case of any refunds approved by 9898176667, it will take 2 days for the refund to be processed to you.</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
