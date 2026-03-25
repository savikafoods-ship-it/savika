import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircleUser, faShieldHalved, faEnvelope } from '@fortawesome/free-solid-svg-icons'

export const dynamic = 'force-dynamic'

export default async function AdminCustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let profile = null

    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single()
            
        if (error || !data) {
            if (error?.code === 'PGRST116') notFound() // Not found
            throw error
        }
        profile = data
    } catch (error: any) {
        console.error('Error fetching profile:', error)
        redirect('/admin/customers')
    }

    return (
        <div className="pb-10 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/customers" className="p-2 hover:bg-[#27272a] text-[#a1a1aa] hover:text-white rounded-lg transition-colors">
                    <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white">Customer Profile</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-[#27272a] flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faCircleUser} className="w-12 h-12 text-[#a1a1aa]" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">{profile.full_name || 'Anonymous User'}</h2>
                        <p className="text-sm text-[#a1a1aa] mb-4">{profile.email}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${profile.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                            {profile.is_active ? 'Active Account' : 'Blocked'}
                        </span>
                    </div>

                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-4">
                        <h3 className="font-semibold text-white border-b border-[#27272a] pb-2">Actions</h3>
                        <button className="w-full flex items-center gap-2 justify-center bg-[#27272a] hover:bg-[#3f3f46] text-white py-2 rounded-lg text-sm transition-colors">
                            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" /> Send Email
                        </button>
                        <button className="w-full flex items-center gap-2 justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20 py-2 rounded-lg text-sm transition-colors">
                            <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4" /> {profile.is_active ? 'Block User' : 'Unblock User'}
                        </button>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                        <h3 className="font-semibold text-white border-b border-[#27272a] pb-4 mb-4">Account Details</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                            <div>
                                <dt className="text-xs text-[#a1a1aa] uppercase tracking-wider mb-1">User ID</dt>
                                <dd className="text-sm font-mono text-[#e4e4e7]">{profile.id}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-[#a1a1aa] uppercase tracking-wider mb-1">Registered On</dt>
                                <dd className="text-sm text-[#e4e4e7]">{new Date(profile.created_at).toLocaleString('en-IN')}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-[#a1a1aa] uppercase tracking-wider mb-1">Status</dt>
                                <dd className="text-sm text-[#e4e4e7]">{profile.is_active ? '✅ Active' : '❌ Inactive/Blocked'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-[#a1a1aa] uppercase tracking-wider mb-1">Phone Number</dt>
                                <dd className="text-sm text-[#e4e4e7]">{profile.phone || 'Not provided'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 text-center">
                        <h3 className="font-semibold text-white border-b border-[#27272a] pb-4 mb-4 text-left">Recent Orders</h3>
                        <p className="text-[#a1a1aa] py-8">Order history will appear here once cross-referenced.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
