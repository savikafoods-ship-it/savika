// Admin Layout - Server Component
// Handles role-based access control server-side before rendering anything
import { redirect } from 'next/navigation'
import AdminLayoutClient from './AdminLayoutClient'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const { data: adminData } = await supabase.from('admins').select('role, full_name').eq('id', user.id).single()

    if (!adminData || adminData.role !== 'admin') {
        redirect('/admin/login?error=unauthorized')
    }

    const permissions = {
        can_manage_products: true,
        can_manage_orders: true,
        can_manage_users: true,
        can_manage_admins: true,
    }

    return (
        <AdminLayoutClient
            role={adminData.role as 'admin' | 'super_admin'}
            permissions={permissions}
            userEmail={user.email || ''}
            userName={adminData.full_name || 'Admin'}
        >
            {children}
        </AdminLayoutClient>
    )
}
