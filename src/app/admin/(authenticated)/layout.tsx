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

  const primaryAdminEmail = process.env.ADMIN_EMAIL || 'savikafoods@gmail.com'
  const isSuperAdmin = user.email === primaryAdminEmail

  // Check role in profiles
  let { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // --- AUTO-PROVISIONING ---
  // If the user is the Super Admin (from env), ensure they have the 'admin' role in profiles
  if (isSuperAdmin && (!profile || profile.role !== 'admin')) {
    const { createServiceClient } = await import('@/lib/supabase/server')
    const serviceClient = await createServiceClient()
    
    const { data: newProfile, error: upsertError } = await serviceClient
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        role: 'admin',
        full_name: (user as any)?.user_metadata?.full_name || 'Super Admin',
      })
      .select()
      .single()
    
    if (!upsertError) {
      profile = newProfile
    }
  }

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
