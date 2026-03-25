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

  const isLoginPage = false // This check will be handled by middleware or simpler logic if needed, but for now we follow the existing pattern

  // We can simplify the layout to just check for user
  if (!user) {
    redirect('/admin/login')
  }

  if (isLoginPage) {
    return <>{children}</>
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
