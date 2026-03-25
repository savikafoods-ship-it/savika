import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTicket, faPlus } from '@fortawesome/free-solid-svg-icons'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
    let coupons: any[] = []

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) redirect('/admin/login')
        
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)
            
        if (error) throw error
        coupons = data || []
    } catch (err) {
        console.error('Error fetching coupons:', err)
        // Fallback
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Coupons & Discounts</h1>
                    <p className="text-[#a1a1aa] text-sm mt-1">Manage promotional codes and cart rules.</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-[#C17F24] hover:bg-[#D4A855] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors w-fit">
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" /> Create Coupon
                </button>
            </div>

            <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#27272a]/50 text-[#a1a1aa]">
                        <tr>
                            <th className="px-6 py-4 font-medium">Code</th>
                            <th className="px-6 py-4 font-medium">Discount</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Expiry</th>
                            <th className="px-6 py-4 font-medium text-right">Usage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]">
                        {coupons.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-[#a1a1aa]">
                                    <FontAwesomeIcon icon={faTicket} className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    <p>No coupons found. Create your first discount code!</p>
                                </td>
                            </tr>
                        ) : coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-[#27272a]/30 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-white">
                                    {coupon.code}
                                </td>
                                <td className="px-6 py-4 text-[#e4e4e7]">
                                    {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`} off
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${coupon.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                        {coupon.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-[#a1a1aa]">
                                    {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString('en-IN') : 'Never'}
                                </td>
                                <td className="px-6 py-4 text-right text-[#a1a1aa]">
                                    {coupon.usage_count || 0} / {coupon.max_uses || '∞'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
