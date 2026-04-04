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

  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    // If not admin/staff, redirect to home or a forbidden page
    redirect('/')
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
