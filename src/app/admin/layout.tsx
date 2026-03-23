import { redirect } from 'next/navigation'
import AdminLayoutClient from './AdminLayoutClient'

// In production, this would check Appwrite session + Team membership.
// For now, we pass a placeholder user and let the client-side handle auth.

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // TODO: Implement server-side Appwrite session check
    // 1. Read session cookie
    // 2. Call Appwrite to verify session
    // 3. Check if user belongs to 'admin' team
    // 4. If not authenticated, redirect('/admin/login')

    const user = {
        name: 'Admin',
        email: 'admin@savikafoods.in',
    }

    return (
        <AdminLayoutClient user={user}>
            {children}
        </AdminLayoutClient>
    )
}
