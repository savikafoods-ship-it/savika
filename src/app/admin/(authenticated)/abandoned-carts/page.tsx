import { createClient } from '@/lib/supabase/server'
import AbandonedCartsClient from './AbandonedCartsClient'

export const dynamic = 'force-dynamic'

export default async function AbandonedCartsPage() {
    const supabase = await createClient()

    // Fetch carts along with profiles
    const { data: carts, error } = await supabase
        .from('carts')
        .select(`
            *,
            profiles (
                full_name,
                email,
                mobile
            )
        `)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching abandoned carts:', error)
    }

    // Filter out empty carts (optional, but usually better)
    const validCarts = (carts as any[])?.filter(cart => 
        Array.isArray(cart.items) && cart.items.length > 0
    ) || []

    return <AbandonedCartsClient carts={validCarts} />
}
