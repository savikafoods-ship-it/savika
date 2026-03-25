import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faSignOutAlt, 
    faBox, 
    faUser, 
    faHeart, 
    faCog 
} from '@fortawesome/free-solid-svg-icons'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

    return (
        <div className="min-h-screen bg-[#F5F0E8] py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Profile Card */}
                <div className="bg-white rounded-3xl p-8 mb-8 border border-[#e8ddd0] flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#C17F24] to-[#8B5E16]" />
                    <div className="w-24 h-24 bg-[#F9F4EE] rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0">
                        <FontAwesomeIcon icon={faUser} className="w-10 h-10 text-[#C17F24]" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-[#2E2E2E] mb-1">{userName}</h1>
                        <p className="text-gray-500 font-medium">{user.email}</p>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Orders Card */}
                    <Link href="/orders" className="group bg-white p-6 rounded-2xl border border-[#e8ddd0] hover:border-[#C17F24] hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-[#F9F4EE] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#C17F24]/10 transition-colors">
                            <FontAwesomeIcon icon={faBox} className="w-6 h-6 text-[#C17F24]" />
                        </div>
                        <h2 className="text-lg font-bold text-[#2E2E2E] mb-1">My Orders</h2>
                        <p className="text-sm text-gray-500">Track shipments, view invoices, or reorder past purchases.</p>
                    </Link>

                    {/* Wishlist Card */}
                    <Link href="/wishlist" className="group bg-white p-6 rounded-2xl border border-[#e8ddd0] hover:border-[#C17F24] hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-[#F9F4EE] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#C17F24]/10 transition-colors">
                            <FontAwesomeIcon icon={faHeart} className="w-6 h-6 text-[#C17F24]" />
                        </div>
                        <h2 className="text-lg font-bold text-[#2E2E2E] mb-1">Wishlist</h2>
                        <p className="text-sm text-gray-500">View and manage your saved favourite spices.</p>
                    </Link>

                    {/* Settings Card */}
                    <Link href="/account/settings" className="group bg-white p-6 rounded-2xl border border-[#e8ddd0] hover:border-[#C17F24] hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-[#F9F4EE] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#C17F24]/10 transition-colors">
                            <FontAwesomeIcon icon={faCog} className="w-6 h-6 text-[#C17F24]" />
                        </div>
                        <h2 className="text-lg font-bold text-[#2E2E2E] mb-1">Account Settings</h2>
                        <p className="text-sm text-gray-500">Update your delivery addresses, phone number, and password.</p>
                    </Link>
                </div>

                <div className="mt-12 text-center md:text-right">
                    <form action={async () => {
                        'use server'
                        const supabase = await createClient()
                        await supabase.auth.signOut()
                        redirect('/auth/login')
                    }}>
                        <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors">
                            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" /> Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
