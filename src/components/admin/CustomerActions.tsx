'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface CustomerActionsProps {
    profileId: string
    isActive: boolean
}

export default function CustomerActions({ profileId, isActive }: CustomerActionsProps) {
    const [loading, setLoading] = useState(false)
    const [statusLoading, setStatusLoading] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const toggleStatus = async () => {
        setStatusLoading(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: !isActive })
                .eq('id', profileId)

            if (error) throw error
            router.refresh()
        } catch (err: any) {
            alert(err.message || 'Failed to update user status')
        } finally {
            setStatusLoading(false)
        }
    }

    const deleteUser = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true)
            setTimeout(() => setConfirmDelete(false), 3000)
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', profileId)

            if (error) throw error
            router.push('/admin/customers')
            router.refresh()
        } catch (err: any) {
            alert(err.message || 'Failed to delete user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <button 
                onClick={toggleStatus}
                disabled={statusLoading}
                className={`w-full flex items-center gap-2 justify-center py-2 rounded-lg text-sm transition-colors ${
                    isActive 
                        ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' 
                        : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                }`}
            >
                <FontAwesomeIcon icon={statusLoading ? faSpinner : faShieldHalved} className={`w-4 h-4 ${statusLoading ? 'animate-spin' : ''}`} />
                {statusLoading ? 'Updating...' : isActive ? 'Block User' : 'Unblock User'}
            </button>

            <button 
                onClick={deleteUser}
                disabled={loading}
                className={`w-full flex items-center gap-2 justify-center py-2 rounded-lg text-sm transition-colors ${
                    confirmDelete 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                }`}
            >
                <FontAwesomeIcon icon={loading ? faSpinner : faTrash} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Deleting...' : confirmDelete ? 'Click again to confirm' : 'Delete Customer'}
            </button>
        </div>
    )
}
