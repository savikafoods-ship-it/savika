import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import CouponForm from '@/components/admin/CouponForm'

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let coupon = null

    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) throw error
        coupon = data
    } catch (error: any) {
        console.error('Error fetching coupon:', error)
        redirect('/admin/coupons')
    }

    return (
        <div className="pb-10 space-y-6">
            <CouponForm initialData={coupon} />
        </div>
    )
}
