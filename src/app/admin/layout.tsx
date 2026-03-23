import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/appwrite/getUser'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') ?? ''
  const isLoginPage = pathname.includes('/admin/login')

  let user = null

  if (!isLoginPage) {
    user = await getCurrentUser()
    if (!user) redirect('/admin/login')
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <AdminLayoutClient user={{ name: user?.name ?? 'Admin', email: user?.email ?? '' }}>
      {children}
    </AdminLayoutClient>
  )
}
