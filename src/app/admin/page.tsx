import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/appwrite/getUser'

export const dynamic = 'force-dynamic'

export default async function AdminRootPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect('/admin/dashboard')
  } else {
    redirect('/admin/login')
  }
}
