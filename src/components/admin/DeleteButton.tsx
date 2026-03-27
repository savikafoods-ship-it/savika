'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
    table: string
    id: string
    onDelete?: () => void
    redirectPath?: string
    className?: string
}

export default function DeleteButton({ table, id, onDelete, redirectPath, className }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async () => {
        if (!confirm) {
            setConfirm(true)
            setTimeout(() => setConfirm(false), 3000)
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', id)

            if (error) throw error

            if (onDelete) onDelete()
            if (redirectPath) {
                router.push(redirectPath)
                router.refresh()
            } else {
                router.refresh()
            }
        } catch (err: any) {
            alert(err.message || `Failed to delete from ${table}`)
        } finally {
            setLoading(false)
            setConfirm(false)
        }
    }

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDelete()
            }}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
                confirm 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'hover:bg-red-500/10 text-[#a1a1aa] hover:text-red-400'
            } ${className}`}
            title={confirm ? 'Click again to confirm' : 'Delete'}
        >
            <FontAwesomeIcon icon={loading ? faSpinner : faTrash} className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {confirm && <span className="ml-2 text-xs font-bold whitespace-nowrap">Confirm?</span>}
        </button>
    )
}
