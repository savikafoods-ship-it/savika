import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Check role in profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isSuperAdmin = user.email === 'savikafoods@gmail.com'

  if (!isSuperAdmin && (!profile || (profile.role !== 'admin' && profile.role !== 'staff'))) {
    // If not admin/staff, redirect to login with error
    redirect('/admin/login?error=unauthorized')
  }

  return (
    <AdminLayoutClient user={{ 
      name: (user as any)?.user_metadata?.name || user?.email?.split('@')[0] || 'Admin', 
      email: user?.email || '' 
    }}>
      {children}
    </AdminLayoutClient>
  )
}
